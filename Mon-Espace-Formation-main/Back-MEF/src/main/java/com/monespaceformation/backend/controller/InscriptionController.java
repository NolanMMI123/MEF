package com.monespaceformation.backend.controller;

import com.monespaceformation.backend.model.Inscription;
import com.monespaceformation.backend.repository.InscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inscriptions")
@CrossOrigin(origins = "http://localhost:5173")
public class InscriptionController {

    @Autowired
    private InscriptionRepository inscriptionRepository;

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
}