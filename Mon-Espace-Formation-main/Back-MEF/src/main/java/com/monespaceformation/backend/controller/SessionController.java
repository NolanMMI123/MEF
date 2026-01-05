package com.monespaceformation.backend.controller;

import com.monespaceformation.backend.model.SessionFormation;
import com.monespaceformation.backend.repository.SessionRepository; // Assurez-vous que ce fichier existe
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sessions")
// 👇 Autorise React (Vite utilise souvent le port 5173, sinon mettez 3000)
@CrossOrigin(origins = "http://localhost:5173") 
public class SessionController {

    @Autowired
    private SessionRepository sessionRepository;

    // 1. Ça, c'est ce qui fait marcher votre Catalogue (La liste complète)
    @GetMapping
    public List<SessionFormation> getAllSessions() {
        return sessionRepository.findAll();
    }

    // 👇 2. AJOUTEZ CECI : C'est ce qui manque pour la page Détails !
    // Ça permet de trouver une formation précise grâce à son ID
    @GetMapping("/{id}")
    public ResponseEntity<SessionFormation> getSessionById(@PathVariable String id) {
        // On cherche dans la base de données
        Optional<SessionFormation> session = sessionRepository.findById(id);

        // Si on trouve, on renvoie la formation. Sinon, erreur 404.
        if (session.isPresent()) {
            return ResponseEntity.ok(session.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. CRÉER UNE NOUVELLE SESSION (POST)
    @PostMapping
    public ResponseEntity<SessionFormation> createSession(@RequestBody SessionFormation session) {
        try {
            // Initialiser les places réservées à 0 si non défini
            if (session.getPlacesReservees() < 0) {
                session.setPlacesReservees(0);
            }
            
            SessionFormation saved = sessionRepository.save(session);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}