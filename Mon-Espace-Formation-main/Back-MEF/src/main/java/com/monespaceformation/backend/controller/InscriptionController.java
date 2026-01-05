package com.monespaceformation.backend.controller;

import com.monespaceformation.backend.dto.AdminInscriptionDTO;
import com.monespaceformation.backend.model.Inscription;
import com.monespaceformation.backend.model.SessionFormation;
import com.monespaceformation.backend.model.User;
import com.monespaceformation.backend.repository.InscriptionRepository;
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
@CrossOrigin(origins = "http://localhost:5173")
public class InscriptionController {

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    // 1. S'INSCRIRE (POST)
    @PostMapping
    public Inscription createInscription(@RequestBody Inscription inscription) {
        // On vérifie si l'utilisateur n'est pas déjà inscrit
        if (inscriptionRepository.existsByUserIdAndSessionId(inscription.getUserId(), inscription.getSessionId())) {
            throw new RuntimeException("Utilisateur déjà inscrit à cette session !");
        }
        return inscriptionRepository.save(inscription);
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
                Optional<User> userOpt = userRepository.findById(insc.getUserId());
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
                Optional<SessionFormation> sessionOpt = sessionRepository.findById(insc.getSessionId());
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
            Optional<Inscription> inscriptionOpt = inscriptionRepository.findById(id);
            if (inscriptionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Inscription inscription = inscriptionOpt.get();
            
            // Mettre à jour uniquement le statut si fourni
            if (inscriptionUpdate.getStatus() != null) {
                inscription.setStatus(inscriptionUpdate.getStatus());
            }

            Inscription saved = inscriptionRepository.save(inscription);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 5. SUPPRIMER UNE INSCRIPTION (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInscription(@PathVariable String id) {
        try {
            if (!inscriptionRepository.existsById(id)) {
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