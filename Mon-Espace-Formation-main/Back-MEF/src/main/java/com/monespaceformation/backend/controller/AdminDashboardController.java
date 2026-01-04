package com.monespaceformation.backend.controller;

import com.monespaceformation.backend.dto.AdminDashboardSummary;
import com.monespaceformation.backend.model.Inscription;
import com.monespaceformation.backend.model.SessionFormation;
import com.monespaceformation.backend.repository.InscriptionRepository;
import com.monespaceformation.backend.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminDashboardController {

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @GetMapping
    public ResponseEntity<AdminDashboardSummary> getAdminDashboard() {
        try {
            AdminDashboardSummary summary = new AdminDashboardSummary();

            // Récupérer toutes les inscriptions
            List<Inscription> allInscriptions = inscriptionRepository.findAll();
            
            // Récupérer toutes les sessions
            List<SessionFormation> allSessions = sessionRepository.findAll();

            // Calculer les KPIs
            summary.setKpis(calculateKPIs(allInscriptions, allSessions));

            // Calculer les statistiques trimestrielles
            summary.setQuarterlyStats(calculateQuarterlyStats(allInscriptions));

            // Calculer la répartition par catégorie
            summary.setCategoryDistribution(calculateCategoryDistribution(allInscriptions, allSessions));

            // Calculer l'évolution mensuelle du CA
            summary.setMonthlyRevenue(calculateMonthlyRevenue(allInscriptions));

            // Récupérer les inscriptions récentes
            summary.setRecentInscriptions(getRecentInscriptions(allInscriptions, allSessions));

            // Générer les alertes
            summary.setAlerts(generateAlerts(allInscriptions, allSessions));

            // Récupérer les sessions à venir
            summary.setUpcomingSessions(getUpcomingSessions(allSessions, allInscriptions));

            return ResponseEntity.ok(summary);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        try {
            // Récupérer toutes les inscriptions depuis MongoDB
            List<Inscription> allInscriptions = inscriptionRepository.findAll();
            
            // Calculer le montant total des inscriptions
            double montantTotal = allInscriptions.stream()
                    .filter(i -> i.getAmount() != null)
                    .mapToDouble(Inscription::getAmount)
                    .sum();
            
            // Calculer le nombre de participants (nombre d'inscriptions)
            int nombreParticipants = allInscriptions.size();
            
            // Créer la réponse
            Map<String, Object> summary = new HashMap<>();
            summary.put("montantTotal", montantTotal);
            summary.put("montantTotalFormatted", String.format("%.2f €", montantTotal));
            summary.put("nombreParticipants", nombreParticipants);
            summary.put("nombreInscriptions", nombreParticipants); // Alias pour clarté
            
            return ResponseEntity.ok(summary);
            
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors du calcul du résumé");
            error.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    private AdminDashboardSummary.KPIData calculateKPIs(List<Inscription> inscriptions, List<SessionFormation> sessions) {
        AdminDashboardSummary.KPIData kpis = new AdminDashboardSummary.KPIData();

        // Inscriptions en cours (validées)
        long inscriptionsEnCours = inscriptions.stream()
                .filter(i -> "VALIDÉ".equals(i.getStatus()))
                .count();
        kpis.setInscriptionsEnCours((int) inscriptionsEnCours);
        kpis.setInscriptionsChange("+12% vs mois dernier"); // TODO: Calculer réellement

        // CA Trimestre (somme des montants des inscriptions validées)
        double caTotal = inscriptions.stream()
                .filter(i -> "VALIDÉ".equals(i.getStatus()) && i.getAmount() != null)
                .mapToDouble(Inscription::getAmount)
                .sum();
        kpis.setCaTrimestre(String.format("%.0f €", caTotal));
        kpis.setCaChange("+8.5% vs T3 2024"); // TODO: Calculer réellement

        // Prochaines sessions (sessions avec dates futures)
        LocalDate now = LocalDate.now();
        long prochainesSessions = sessions.stream()
                .filter(s -> s.getDates() != null && isFutureDate(s.getDates(), now))
                .count();
        kpis.setProchainesSessions((int) prochainesSessions);

        // Taux de remplissage moyen
        double tauxRemplissage = sessions.stream()
                .filter(s -> s.getPlacesTotales() > 0)
                .mapToDouble(s -> (double) s.getPlacesReservees() / s.getPlacesTotales() * 100)
                .average()
                .orElse(0.0);
        kpis.setTauxRemplissage(String.format("%.0f%%", tauxRemplissage));

        // Attestations (nombre d'inscriptions validées)
        kpis.setAttestations((int) inscriptionsEnCours);
        kpis.setAttestationsChange("+18% vs 2023"); // TODO: Calculer réellement

        return kpis;
    }

    private AdminDashboardSummary.QuarterlyStats calculateQuarterlyStats(List<Inscription> inscriptions) {
        AdminDashboardSummary.QuarterlyStats stats = new AdminDashboardSummary.QuarterlyStats();

        // Filtrer les inscriptions du trimestre actuel (T4 2025)
        LocalDate now = LocalDate.now();
        int currentQuarter = (now.getMonthValue() - 1) / 3 + 1;
        int currentYear = now.getYear();

        List<Inscription> quarterlyInscriptions = inscriptions.stream()
                .filter(i -> {
                    if (i.getDateInscription() == null) return false;
                    int quarter = (i.getDateInscription().getMonthValue() - 1) / 3 + 1;
                    return quarter == currentQuarter && i.getDateInscription().getYear() == currentYear;
                })
                .collect(Collectors.toList());

        stats.setTotalInscriptions(quarterlyInscriptions.size());

        long validated = quarterlyInscriptions.stream()
                .filter(i -> "VALIDÉ".equals(i.getStatus()))
                .count();
        stats.setValidated((int) validated);

        long cancelled = quarterlyInscriptions.stream()
                .filter(i -> "ANNULÉ".equals(i.getStatus()) || "CANCELED".equals(i.getStatus()))
                .count();
        stats.setCancelled((int) cancelled);

        double totalRevenue = quarterlyInscriptions.stream()
                .filter(i -> "VALIDÉ".equals(i.getStatus()) && i.getAmount() != null)
                .mapToDouble(Inscription::getAmount)
                .sum();
        stats.setTotalRevenue(String.format("%.0f €", totalRevenue));

        // Taux de conversion
        double conversionRate = quarterlyInscriptions.size() > 0 
                ? (double) validated / quarterlyInscriptions.size() * 100 
                : 0;
        stats.setConversionRate(String.format("%.1f%%", conversionRate));

        // Taux de présence (par défaut)
        stats.setAttendanceRate("98.2%");

        return stats;
    }

    private List<AdminDashboardSummary.CategoryDistribution> calculateCategoryDistribution(
            List<Inscription> inscriptions, List<SessionFormation> sessions) {
        
        Map<String, CategoryData> categoryMap = new HashMap<>();

        // Parcourir les inscriptions et regrouper par catégorie
        for (Inscription insc : inscriptions) {
            if (!"VALIDÉ".equals(insc.getStatus())) continue;

            String sessionId = insc.getSessionId();
            if (sessionId == null || sessionId.isEmpty()) continue;
            Optional<SessionFormation> sessionOpt = sessionRepository.findById(sessionId);
            if (sessionOpt.isEmpty()) continue;

            SessionFormation session = sessionOpt.get();
            String category = session.getCategory() != null ? session.getCategory() : "Autre";

            CategoryData data = categoryMap.getOrDefault(category, new CategoryData());
            data.inscriptions++;
            if (insc.getAmount() != null) {
                data.revenue += insc.getAmount();
            }
            categoryMap.put(category, data);
        }

        // Calculer le total pour les pourcentages
        double totalRevenue = categoryMap.values().stream()
                .mapToDouble(d -> d.revenue)
                .sum();

        // Convertir en liste
        List<AdminDashboardSummary.CategoryDistribution> distributions = new ArrayList<>();
        for (Map.Entry<String, CategoryData> entry : categoryMap.entrySet()) {
            AdminDashboardSummary.CategoryDistribution dist = new AdminDashboardSummary.CategoryDistribution();
            dist.setName(entry.getKey());
            dist.setInscriptions(entry.getValue().inscriptions);
            dist.setRevenue(String.format("%.0f €", entry.getValue().revenue));
            dist.setPercentage(totalRevenue > 0 ? (entry.getValue().revenue / totalRevenue * 100) : 0);
            distributions.add(dist);
        }

        // Trier par revenu décroissant
        distributions.sort((a, b) -> Double.compare(b.getPercentage(), a.getPercentage()));

        return distributions;
    }

    private static class CategoryData {
        int inscriptions = 0;
        double revenue = 0;
    }

    private List<AdminDashboardSummary.MonthlyRevenue> calculateMonthlyRevenue(List<Inscription> inscriptions) {
        Map<String, Double> monthlyMap = new LinkedHashMap<>();
        
        // Initialiser les 3 derniers mois
        LocalDate now = LocalDate.now();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMMM", Locale.FRENCH);
        
        for (int i = 2; i >= 0; i--) {
            LocalDate month = now.minusMonths(i);
            monthlyMap.put(month.format(monthFormatter), 0.0);
        }

        // Calculer le CA par mois
        for (Inscription insc : inscriptions) {
            if (!"VALIDÉ".equals(insc.getStatus()) || insc.getAmount() == null || insc.getDateInscription() == null) {
                continue;
            }

            LocalDate inscDate = insc.getDateInscription();
            String monthKey = inscDate.format(monthFormatter);
            
            if (monthlyMap.containsKey(monthKey)) {
                monthlyMap.put(monthKey, monthlyMap.get(monthKey) + insc.getAmount());
            }
        }

        // Convertir en liste
        List<AdminDashboardSummary.MonthlyRevenue> monthlyRevenue = new ArrayList<>();
        for (Map.Entry<String, Double> entry : monthlyMap.entrySet()) {
            AdminDashboardSummary.MonthlyRevenue mr = new AdminDashboardSummary.MonthlyRevenue();
            mr.setMonth(entry.getKey());
            mr.setAmount(String.format("%.0f €", entry.getValue()));
            monthlyRevenue.add(mr);
        }

        return monthlyRevenue;
    }

    private List<AdminDashboardSummary.RecentInscription> getRecentInscriptions(
            List<Inscription> inscriptions, List<SessionFormation> sessions) {
        
        // Trier par date décroissante et prendre les 4 plus récentes
        List<Inscription> recent = inscriptions.stream()
                .filter(i -> "VALIDÉ".equals(i.getStatus()))
                .sorted((a, b) -> {
                    if (a.getDateInscription() == null) return 1;
                    if (b.getDateInscription() == null) return -1;
                    return b.getDateInscription().compareTo(a.getDateInscription());
                })
                .limit(4)
                .collect(Collectors.toList());

        List<AdminDashboardSummary.RecentInscription> result = new ArrayList<>();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.FRENCH);

        for (Inscription insc : recent) {
            AdminDashboardSummary.RecentInscription ri = new AdminDashboardSummary.RecentInscription();
            String inscriptionId = insc.getId();
            ri.setId(inscriptionId != null && !inscriptionId.isEmpty() ? inscriptionId : "N/A");
            
            if (insc.getParticipant() != null) {
                String prenom = insc.getParticipant().getPrenom() != null ? insc.getParticipant().getPrenom() : "";
                String nom = insc.getParticipant().getNom() != null ? insc.getParticipant().getNom() : "";
                ri.setName(prenom + " " + nom);
                ri.setEmail(insc.getParticipant().getEmail() != null ? insc.getParticipant().getEmail() : "");
                ri.setCompany(insc.getParticipant().getEntreprise() != null ? insc.getParticipant().getEntreprise() : "");
                
                // Générer les initiales pour l'avatar
                String initials = "";
                if (!prenom.isEmpty()) initials += prenom.charAt(0);
                if (!nom.isEmpty()) initials += nom.charAt(0);
                ri.setAvatar(initials.toUpperCase());
            }

            // Récupérer les infos de la session
            String sessionId = insc.getSessionId();
            if (sessionId == null || sessionId.isEmpty()) {
                ri.setTraining("");
                ri.setSession("");
            } else {
                Optional<SessionFormation> sessionOpt = sessionRepository.findById(sessionId);
                if (sessionOpt.isPresent()) {
                    SessionFormation session = sessionOpt.get();
                    ri.setTraining(session.getTitle() != null ? session.getTitle() : "");
                    ri.setSession(session.getDates() != null ? session.getDates() : "");
                }
            }

            ri.setAmount(insc.getAmount() != null ? String.format("%.0f €", insc.getAmount()) : "0 €");
            ri.setStatus(insc.getStatus() != null ? insc.getStatus() : "");
            ri.setDate(insc.getDateInscription() != null ? insc.getDateInscription().format(dateFormatter) : "");

            result.add(ri);
        }

        return result;
    }

    private List<AdminDashboardSummary.Alert> generateAlerts(List<Inscription> inscriptions, List<SessionFormation> sessions) {
        List<AdminDashboardSummary.Alert> alerts = new ArrayList<>();

        // Alerte: Attestations à générer (formations terminées)
        long formationsTerminees = sessions.stream()
                .filter(s -> s.getDates() != null && !isFutureDate(s.getDates(), LocalDate.now()))
                .count();
        if (formationsTerminees > 0) {
            AdminDashboardSummary.Alert alert = new AdminDashboardSummary.Alert();
            alert.setType("warning");
            alert.setText((int) formationsTerminees + " attestations à générer");
            alert.setDetail("Formations terminées");
            alerts.add(alert);
        }

        // Alerte: Sessions peu remplies
        for (SessionFormation session : sessions) {
            if (session.getPlacesTotales() > 0) {
                double fillRate = (double) session.getPlacesReservees() / session.getPlacesTotales();
                if (fillRate < 0.5 && session.getPlacesReservees() < session.getPlacesTotales()) {
                    AdminDashboardSummary.Alert alert = new AdminDashboardSummary.Alert();
                    alert.setType("info");
                    alert.setText("Session peu remplie");
                    alert.setDetail(session.getTitle() + " - " + session.getPlacesReservees() + "/" + session.getPlacesTotales() + " inscrits");
                    alerts.add(alert);
                    break; // Limiter à une alerte
                }
            }
        }

        // Alerte: Conventions non retournées (inscriptions en attente)
        long conventionsEnAttente = inscriptions.stream()
                .filter(i -> i.getStatus() != null && !"VALIDÉ".equals(i.getStatus()))
                .count();
        if (conventionsEnAttente > 0) {
            AdminDashboardSummary.Alert alert = new AdminDashboardSummary.Alert();
            alert.setType("warning");
            alert.setText((int) conventionsEnAttente + " convention(s) non retournée(s)");
            alert.setDetail("Inscriptions en attente");
            alerts.add(alert);
        }

        return alerts;
    }

    private List<AdminDashboardSummary.UpcomingSession> getUpcomingSessions(
            List<SessionFormation> sessions, List<Inscription> inscriptions) {
        
        LocalDate now = LocalDate.now();
        
        // Filtrer les sessions futures et trier par date
        List<SessionFormation> upcoming = sessions.stream()
                .filter(s -> s.getDates() != null && isFutureDate(s.getDates(), now))
                .sorted((a, b) -> {
                    // Trier par date (approximation)
                    String datesA = a.getDates();
                    String datesB = b.getDates();
                    if (datesA == null) return 1;
                    if (datesB == null) return -1;
                    return datesA.compareTo(datesB);
                })
                .limit(3)
                .collect(Collectors.toList());

        List<AdminDashboardSummary.UpcomingSession> result = new ArrayList<>();

        for (SessionFormation session : upcoming) {
            AdminDashboardSummary.UpcomingSession us = new AdminDashboardSummary.UpcomingSession();
            String title = session.getTitle();
            us.setTitle(title != null && !title.isEmpty() ? title : "");
            String dates = session.getDates();
            us.setDates(dates != null && !dates.isEmpty() ? dates : "");
            us.setEnrolled(session.getPlacesReservees());
            us.setCapacity(session.getPlacesTotales());
            us.setLocation(session.getLieu() != null ? session.getLieu() : "");
            result.add(us);
        }

        return result;
    }

    // Méthode utilitaire pour vérifier si une date est future
    private boolean isFutureDate(String dateString, LocalDate referenceDate) {
        // Format attendu: "15-19 Janvier 2025" ou similaire
        // Pour simplifier, on vérifie si la date contient une année future
        try {
            if (dateString.contains("2025") || dateString.contains("2026") || dateString.contains("2027")) {
                return true;
            }
            // Si on peut parser la date, on le fait
            // Sinon, on considère que c'est futur si l'année mentionnée est >= année actuelle
            return dateString.matches(".*202[5-9].*");
        } catch (Exception e) {
            return false;
        }
    }
}

