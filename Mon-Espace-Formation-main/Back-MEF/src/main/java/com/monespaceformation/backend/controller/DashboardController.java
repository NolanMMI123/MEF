package com.monespaceformation.backend.controller;

import com.monespaceformation.backend.dto.AdminDashboardSummaryDTO;
import com.monespaceformation.backend.dto.DashboardSummary;
import com.monespaceformation.backend.dto.TrainerDashboardDTO;
import com.monespaceformation.backend.model.Inscription;
import com.monespaceformation.backend.model.SessionFormation;
import com.monespaceformation.backend.model.Training;
import com.monespaceformation.backend.model.User;
import com.monespaceformation.backend.repository.InscriptionRepository;
import com.monespaceformation.backend.repository.SessionRepository;
import com.monespaceformation.backend.repository.TrainingRepository;
import com.monespaceformation.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TrainingRepository trainingRepository;

    @GetMapping("/{email}")
    public ResponseEntity<?> getDashboard(@PathVariable String email) {
        try {
            // 1. Trouver l'utilisateur
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            User user = userOpt.get();

            // 2. Trouver TOUTES ses inscriptions (Liste d'IDs)
            List<Inscription> mesInscriptions = inscriptionRepository.findByUserId(user.getId());

            // 3. Récupérer les détails complets des SESSIONS (Titres, dates...)
            List<SessionFormation> mesSessions = new ArrayList<>();
            int heuresTotales = 0;

            for (Inscription insc : mesInscriptions) {
                // On cherche la session correspondante à l'inscription
                Optional<SessionFormation> sessionOpt = sessionRepository.findById(insc.getSessionId());
                
                if (sessionOpt.isPresent()) {
                    SessionFormation session = sessionOpt.get();
                    mesSessions.add(session); // On l'ajoute à la liste à envoyer
                    
                    // Calcul des heures (ex: 35h par formation)
                    heuresTotales += 35; 
                }
            }

            // 4. Préparer les statistiques
            DashboardSummary.Statistics stats = new DashboardSummary.Statistics(
                    mesSessions.size(), // Nombre total de formations trouvées
                    heuresTotales,
                    0
            );

            // 5. Créer et renvoyer le résumé avec la LISTE
            DashboardSummary summary = new DashboardSummary(user, mesSessions, stats);
            
            return ResponseEntity.ok(summary);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ENDPOINT POUR LES STATISTIQUES GLOBALES DE L'ADMIN
    @GetMapping("/summary")
    public ResponseEntity<AdminDashboardSummaryDTO> getAdminSummary() {
        try {
            int totalInscriptions = (int) inscriptionRepository.count();
            int totalTrainings = (int) trainingRepository.count();
            int totalSessions = (int) sessionRepository.count();
            int totalUsers = (int) userRepository.count();

            AdminDashboardSummaryDTO summary = new AdminDashboardSummaryDTO(
                totalInscriptions,
                totalTrainings,
                totalSessions,
                totalUsers
            );

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ENDPOINT POUR LE DASHBOARD DU FORMATEUR
    @GetMapping("/trainer/{email}")
    public ResponseEntity<?> getTrainerDashboard(@PathVariable String email) {
        try {
            // 1. Trouver le formateur par email
            Optional<User> trainerOpt = userRepository.findByEmail(email);
            if (trainerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            User trainer = trainerOpt.get();

            // Vérifier que c'est bien un formateur
            if (trainer.getRole() == null || !trainer.getRole().equals("TRAINER")) {
                return ResponseEntity.badRequest().body("L'utilisateur n'est pas un formateur");
            }

            // 2. Trouver toutes les formations assignées à ce formateur
            List<Training> formations = trainingRepository.findByTrainerId(trainer.getId());

            // 3. Pour chaque formation, trouver les inscrits
            List<TrainerDashboardDTO.TrainingWithInscrits> formationsWithInscrits = new ArrayList<>();
            int totalEleves = 0;
            int heuresCoursPrevues = 0;

            for (Training training : formations) {
                // Trouver toutes les sessions qui correspondent à cette formation (par titre)
                List<SessionFormation> sessions = sessionRepository.findAll();
                List<SessionFormation> relatedSessions = new ArrayList<>();
                for (SessionFormation session : sessions) {
                    if (session.getTitle() != null && training.getTitle() != null 
                        && session.getTitle().equals(training.getTitle())) {
                        relatedSessions.add(session);
                    }
                }

                // Pour chaque session, trouver les inscriptions
                List<TrainerDashboardDTO.InscritInfo> inscrits = new ArrayList<>();
                for (SessionFormation session : relatedSessions) {
                    List<Inscription> inscriptions = inscriptionRepository.findBySessionId(session.getId());
                    
                    for (Inscription inscription : inscriptions) {
                        // Récupérer les informations de l'utilisateur
                        Optional<User> userOpt = userRepository.findById(inscription.getUserId());
                        if (userOpt.isPresent()) {
                            User user = userOpt.get();
                            String userName = (user.getPrenom() != null ? user.getPrenom() : "") + " " + 
                                            (user.getNom() != null ? user.getNom() : "");
                            userName = userName.trim();
                            if (userName.isEmpty()) {
                                userName = user.getEmail() != null ? user.getEmail() : "N/A";
                            }

                            TrainerDashboardDTO.InscritInfo inscritInfo = new TrainerDashboardDTO.InscritInfo(
                                user.getId(),
                                userName,
                                user.getEmail() != null ? user.getEmail() : "N/A",
                                inscription.getDateInscription() != null ? 
                                    inscription.getDateInscription().toString() : "N/A",
                                inscription.getStatus() != null ? inscription.getStatus() : "N/A"
                            );
                            inscrits.add(inscritInfo);
                            totalEleves++;
                        }
                    }
                }

                // Calculer les heures de cours prévues (approximatif : 35h par formation)
                if (training.getDuration() != null) {
                    try {
                        // Essayer d'extraire un nombre de la durée (ex: "60 Jours" -> 60)
                        String durationStr = training.getDuration().replaceAll("[^0-9]", "");
                        if (!durationStr.isEmpty()) {
                            heuresCoursPrevues += Integer.parseInt(durationStr);
                        } else {
                            heuresCoursPrevues += 35; // Valeur par défaut
                        }
                    } catch (NumberFormatException e) {
                        heuresCoursPrevues += 35; // Valeur par défaut en cas d'erreur
                    }
                } else {
                    heuresCoursPrevues += 35; // Valeur par défaut
                }

                TrainerDashboardDTO.TrainingWithInscrits trainingWithInscrits = 
                    new TrainerDashboardDTO.TrainingWithInscrits(training, inscrits);
                formationsWithInscrits.add(trainingWithInscrits);
            }

            // 4. Calculer le revenu total
            // Le revenu = tarif du formateur × nombre d'heures de cours prévues
            double revenuTotal = 0.0;
            if (trainer.getTarif() != null && trainer.getTarif() > 0) {
                // Multiplier le tarif horaire par le nombre d'heures
                revenuTotal = trainer.getTarif() * heuresCoursPrevues;
            }

            // 5. Créer les statistiques
            TrainerDashboardDTO.Statistics stats = new TrainerDashboardDTO.Statistics(
                totalEleves,
                heuresCoursPrevues,
                formations.size(),
                revenuTotal
            );

            // 6. Créer et renvoyer le DTO
            TrainerDashboardDTO dashboard = new TrainerDashboardDTO(trainer, formationsWithInscrits, stats);
            
            return ResponseEntity.ok(dashboard);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}