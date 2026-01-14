package com.monespaceformation.backend.controller;

import com.monespaceformation.backend.dto.AdminInscriptionDTO;
import com.monespaceformation.backend.model.Inscription;
import com.monespaceformation.backend.model.Notification;
import com.monespaceformation.backend.model.SessionFormation;
import com.monespaceformation.backend.model.User;
import com.monespaceformation.backend.repository.InscriptionRepository;
import com.monespaceformation.backend.repository.NotificationRepository;
import com.monespaceformation.backend.repository.SessionRepository;
import com.monespaceformation.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inscriptions")
@CrossOrigin(originPatterns = {"http://localhost:5173", "https://*.vercel.app"})
public class InscriptionController {

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // 1. S'INSCRIRE (POST)
    @PostMapping
    public ResponseEntity<?> createInscription(@RequestBody Inscription inscription) {
        try {
            // Vérifier que les champs obligatoires sont présents
            if (inscription.getUserId() == null || inscription.getUserId().isEmpty()) {
                return ResponseEntity.badRequest().body("L'ID utilisateur est requis");
            }
            
            if (inscription.getSessionId() == null || inscription.getSessionId().isEmpty()) {
                return ResponseEntity.badRequest().body("L'ID de session est requis");
            }
            
        // On vérifie si l'utilisateur n'est pas déjà inscrit
        if (inscriptionRepository.existsByUserIdAndSessionId(inscription.getUserId(), inscription.getSessionId())) {
                return ResponseEntity.badRequest().body("Vous êtes déjà inscrit à cette session !");
            }
            
            // Vérifier que la session existe
            String sessionId = inscription.getSessionId();
            Optional<SessionFormation> sessionOpt = (sessionId != null) ? sessionRepository.findById(sessionId) : Optional.empty();
            if (sessionOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("La session sélectionnée n'existe pas");
            }
            
            // Initialiser la date d'inscription si elle n'est pas définie
            if (inscription.getDateInscription() == null) {
                inscription.setDateInscription(java.time.LocalDate.now());
        }
        
            // Sauvegarder l'inscription
        Inscription saved = inscriptionRepository.save(inscription);
        
        // Créer une notification pour l'admin
        try {
            String userName = "N/A";
            String trainingTitle = "N/A";
            
            // Récupérer le nom de l'utilisateur
            String userId = inscription.getUserId();
            Optional<User> userOpt = (userId != null) ? userRepository.findById(userId) : Optional.empty();
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                userName = (user.getPrenom() != null ? user.getPrenom() : "") + " " + 
                          (user.getNom() != null ? user.getNom() : "");
                userName = userName.trim();
                if (userName.isEmpty() && inscription.getParticipant() != null) {
                    userName = (inscription.getParticipant().getPrenom() != null ? inscription.getParticipant().getPrenom() : "") + " " +
                              (inscription.getParticipant().getNom() != null ? inscription.getParticipant().getNom() : "");
                    userName = userName.trim();
                }
            } else if (inscription.getParticipant() != null) {
                userName = (inscription.getParticipant().getPrenom() != null ? inscription.getParticipant().getPrenom() : "") + " " +
                          (inscription.getParticipant().getNom() != null ? inscription.getParticipant().getNom() : "");
                userName = userName.trim();
            }
            
            // Récupérer le titre de la formation
                SessionFormation session = sessionOpt.get();
                if (session.getTitle() != null) {
                    trainingTitle = session.getTitle();
            }
            
            // Créer la notification
            Notification notification = new Notification(
                "Nouvel inscrit : " + userName + " à la formation " + trainingTitle,
                "INFO"
            );
            notificationRepository.save(notification);
        } catch (Exception e) {
            // Ne pas faire échouer l'inscription si la notification échoue
                System.err.println("Erreur lors de la création de la notification: " + e.getMessage());
                e.printStackTrace();
            }
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Erreur lors de la création de l'inscription: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur lors de la création de l'inscription: " + e.getMessage());
        }
    }

    // 2. VOIR MES INSCRIPTIONS (GET)
    @GetMapping("/user/{userId}")
    public List<Inscription> getUserInscriptions(@PathVariable String userId) {
        return inscriptionRepository.findByUserId(userId);
    }

    // 3. GET ALL INSCRIPTIONS POUR L'ADMIN (avec détails enrichis)
    @GetMapping
    public ResponseEntity<List<AdminInscriptionDTO>> getAllInscriptions() {
        try {
            List<Inscription> inscriptions = inscriptionRepository.findAll();
            List<AdminInscriptionDTO> result = new ArrayList<>();

            for (Inscription insc : inscriptions) {
                // Récupérer les informations de l'utilisateur
                String userName = "N/A";
                String userEmail = "N/A";
                String inscUserId = insc.getUserId();
                Optional<User> userOpt = (inscUserId != null) ? userRepository.findById(inscUserId) : Optional.empty();
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    userName = (user.getPrenom() != null ? user.getPrenom() : "") + " " + 
                              (user.getNom() != null ? user.getNom() : "");
                    userName = userName.trim();
                    if (userName.isEmpty()) {
                        // Si pas de nom/prénom, utiliser les données du participant
                        if (insc.getParticipant() != null) {
                            userName = (insc.getParticipant().getPrenom() != null ? insc.getParticipant().getPrenom() : "") + " " +
                                      (insc.getParticipant().getNom() != null ? insc.getParticipant().getNom() : "");
                            userName = userName.trim();
                            userEmail = insc.getParticipant().getEmail() != null ? insc.getParticipant().getEmail() : "N/A";
                        }
                    } else {
                        userEmail = user.getEmail() != null ? user.getEmail() : "N/A";
                    }
                } else if (insc.getParticipant() != null) {
                    // Fallback sur les données du participant
                    userName = (insc.getParticipant().getPrenom() != null ? insc.getParticipant().getPrenom() : "") + " " +
                              (insc.getParticipant().getNom() != null ? insc.getParticipant().getNom() : "");
                    userName = userName.trim();
                    userEmail = insc.getParticipant().getEmail() != null ? insc.getParticipant().getEmail() : "N/A";
                }

                // Récupérer les informations de la session/formation
                String trainingTitle = "N/A";
                String sessionDate = "N/A";
                String inscSessionId = insc.getSessionId();
                Optional<SessionFormation> sessionOpt = (inscSessionId != null) ? sessionRepository.findById(inscSessionId) : Optional.empty();
                if (sessionOpt.isPresent()) {
                    SessionFormation session = sessionOpt.get();
                    trainingTitle = session.getTitle() != null ? session.getTitle() : "N/A";
                    sessionDate = session.getDates() != null ? session.getDates() : "N/A";
                }

                AdminInscriptionDTO dto = new AdminInscriptionDTO(
                    insc.getId(),
                    userName,
                    userEmail,
                    trainingTitle,
                    sessionDate,
                    insc.getDateInscription() != null ? insc.getDateInscription() : null,
                    insc.getStatus() != null ? insc.getStatus() : "N/A"
                );

                result.add(dto);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 4. METTRE À JOUR LE STATUT D'UNE INSCRIPTION (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Inscription> updateInscription(@PathVariable String id, @RequestBody Inscription inscriptionUpdate) {
        try {
            if (id == null) {
                return ResponseEntity.badRequest().build();
            }
            Optional<Inscription> inscriptionOpt = inscriptionRepository.findById(id);
            if (inscriptionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Inscription inscription = inscriptionOpt.get();
            
            // Mettre à jour uniquement le statut si fourni
            if (inscriptionUpdate.getStatus() != null) {
                inscription.setStatus(inscriptionUpdate.getStatus());
            }
            
            // Mettre à jour la note si fournie
            if (inscriptionUpdate.getNote() != null) {
                // Valider que la note est entre 0 et 20
                Double noteValue = inscriptionUpdate.getNote();
                if (noteValue < 0 || noteValue > 20) {
                    return ResponseEntity.badRequest().build();
                }
                inscription.setNote(noteValue);
            }

            Inscription saved = inscriptionRepository.save(inscription);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 6. ATTRIBUER UNE NOTE À UN ÉLÈVE (PUT)
    @PutMapping("/{id}/note")
    public ResponseEntity<?> updateNote(@PathVariable String id, @RequestBody java.util.Map<String, Object> requestBody) {
        try {
            if (id == null) {
                return ResponseEntity.badRequest().body("L'ID de l'inscription est requis");
            }
            
            Optional<Inscription> inscriptionOpt = inscriptionRepository.findById(id);
            if (inscriptionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Inscription inscription = inscriptionOpt.get();
            
            // Récupérer la note depuis le body
            Object noteObj = requestBody.get("note");
            if (noteObj == null) {
                return ResponseEntity.badRequest().body("La note est requise");
            }
            
            Double note;
            try {
                if (noteObj instanceof Number) {
                    note = ((Number) noteObj).doubleValue();
                } else if (noteObj instanceof String) {
                    String noteStr = (String) noteObj;
                    if (noteStr.trim().isEmpty()) {
                        // Permettre de supprimer la note en envoyant une chaîne vide
                        inscription.setNote(null);
                        Inscription saved = inscriptionRepository.save(inscription);
                        return ResponseEntity.ok(saved);
                    }
                    note = Double.parseDouble(noteStr);
                } else {
                    return ResponseEntity.badRequest().body("Format de note invalide");
                }
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("La note doit être un nombre");
            }
            
            // Valider que la note est entre 0 et 20
            if (note < 0 || note > 20) {
                return ResponseEntity.badRequest().body("La note doit être comprise entre 0 et 20");
            }
            
            inscription.setNote(note);
            Inscription saved = inscriptionRepository.save(inscription);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur lors de la mise à jour de la note: " + e.getMessage());
        }
    }

    // 5. SUPPRIMER UNE INSCRIPTION (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInscription(@PathVariable String id) {
        try {
            if (id == null || !inscriptionRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            inscriptionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}