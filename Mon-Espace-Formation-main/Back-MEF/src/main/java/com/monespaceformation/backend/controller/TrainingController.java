package com.monespaceformation.backend.controller;

import com.monespaceformation.backend.model.Training;
import com.monespaceformation.backend.repository.TrainingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller pour gérer les formations (trainings)
 */
@RestController
@RequestMapping("/api/trainings")
@CrossOrigin(origins = "http://localhost:5173")
public class TrainingController {

    @Autowired
    private TrainingRepository trainingRepository;

    /**
     * Récupérer toutes les formations
     * GET /api/trainings
     */
    @GetMapping
    public ResponseEntity<List<Training>> getAllTrainings() {
        try {
            List<Training> trainings = trainingRepository.findAll();
            return ResponseEntity.ok(trainings);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Créer une nouvelle formation
     * POST /api/trainings
     */
    @PostMapping
    public ResponseEntity<Training> createTraining(@RequestBody Training training) {
        try {
            // Générer une référence automatique si non fournie
            if (training.getReference() == null || training.getReference().isEmpty()) {
                String prefix = "FORM-";
                String category = "GEN";
                if (training.getTitle() != null && training.getTitle().toUpperCase().contains("REACT")) {
                    category = "DEV";
                }
                String refNumber = String.format("%03d", trainingRepository.count() + 1);
                training.setReference(prefix + category + "-" + refNumber);
            }

            // Initialiser le statut si non défini
            if (training.getStatus() == null || training.getStatus().isEmpty()) {
                training.setStatus("A Venir");
            }

            Training saved = trainingRepository.save(training);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}

