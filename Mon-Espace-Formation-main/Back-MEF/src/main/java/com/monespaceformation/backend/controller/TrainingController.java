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
}

