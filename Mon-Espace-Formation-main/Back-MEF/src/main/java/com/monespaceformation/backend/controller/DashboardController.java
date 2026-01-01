package com.monespaceformation.backend.controller;

import com.monespaceformation.backend.dto.DashboardSummary;
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
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private SessionRepository sessionRepository;

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
}