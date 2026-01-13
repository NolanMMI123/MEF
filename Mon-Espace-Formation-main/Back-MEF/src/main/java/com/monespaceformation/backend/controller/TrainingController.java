package com.monespaceformation.backend.controller;

import com.monespaceformation.backend.model.Training;
import com.monespaceformation.backend.repository.TrainingRepository;
import com.monespaceformation.backend.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller pour gérer les formations (trainings)
 */
@RestController
@RequestMapping("/api/trainings")
@CrossOrigin(origins = "http://localhost:5173")
public class TrainingController {

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private SessionRepository sessionRepository;

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

            // Initialiser les champs pédagogiques s'ils sont null (mais pas s'ils sont vides - liste vide ou chaîne vide sont valides)
            if (training.getDescription() == null) {
                training.setDescription("");
            }
            if (training.getObjectifs() == null) {
                training.setObjectifs(new java.util.ArrayList<>());
            }
            if (training.getPrerequis() == null) {
                training.setPrerequis(new java.util.ArrayList<>());
            }
            if (training.getProgramme() == null) {
                training.setProgramme("");
            }
            
            // Log pour déboguer
            System.out.println("📝 Création formation - Objectifs: " + training.getObjectifs());
            System.out.println("📝 Création formation - Prérequis: " + training.getPrerequis());
            System.out.println("📝 Création formation - Programme: " + training.getProgramme());

            Training saved = trainingRepository.save(training);
            System.out.println("✅ Formation sauvegardée - ID: " + saved.getId());
            System.out.println("✅ Formation sauvegardée - Objectifs: " + saved.getObjectifs());
            System.out.println("✅ Formation sauvegardée - Prérequis: " + saved.getPrerequis());
            System.out.println("✅ Formation sauvegardée - Programme: " + saved.getProgramme());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Récupérer une formation par son ID
     * GET /api/trainings/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Training> getTrainingById(@PathVariable String id) {
        try {
            Optional<Training> training = trainingRepository.findById(id);
            if (training.isPresent()) {
                return ResponseEntity.ok(training.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Mettre à jour une formation
     * PUT /api/trainings/{id}
     * Les formateurs ne peuvent modifier que leurs propres formations (vérification via trainerId)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Training> updateTraining(
            @PathVariable String id, 
            @RequestBody Training trainingUpdate,
            @RequestHeader(value = "X-Trainer-Id", required = false) String trainerIdHeader) {
        try {
            Optional<Training> trainingOpt = trainingRepository.findById(id);
            if (trainingOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Training training = trainingOpt.get();
            
            // Vérification de sécurité : si un trainerId est fourni dans le header, 
            // vérifier que la formation appartient bien à ce formateur
            if (trainerIdHeader != null && !trainerIdHeader.isEmpty()) {
                if (training.getTrainerId() == null || !training.getTrainerId().equals(trainerIdHeader)) {
                    return ResponseEntity.status(403).build(); // Forbidden
                }
            }
            
            // Mettre à jour les champs
            if (trainingUpdate.getTitle() != null) {
                training.setTitle(trainingUpdate.getTitle());
            }
            if (trainingUpdate.getDuration() != null) {
                training.setDuration(trainingUpdate.getDuration());
            }
            if (trainingUpdate.getLocation() != null) {
                training.setLocation(trainingUpdate.getLocation());
            }
            if (trainingUpdate.getPrice() != null) {
                training.setPrice(trainingUpdate.getPrice());
            }
            if (trainingUpdate.getTrainerName() != null) {
                training.setTrainerName(trainingUpdate.getTrainerName());
            }
            if (trainingUpdate.getTrainerRole() != null) {
                training.setTrainerRole(trainingUpdate.getTrainerRole());
            }
            if (trainingUpdate.getTrainerEmail() != null) {
                training.setTrainerEmail(trainingUpdate.getTrainerEmail());
            }
            if (trainingUpdate.getStatus() != null) {
                training.setStatus(trainingUpdate.getStatus());
            }
            // Mettre à jour les dates
            if (trainingUpdate.getStartDate() != null) {
                training.setStartDate(trainingUpdate.getStartDate());
            }
            if (trainingUpdate.getEndDate() != null) {
                training.setEndDate(trainingUpdate.getEndDate());
            }
            // Mettre à jour la description et le contenu pédagogique
            if (trainingUpdate.getDescription() != null) {
                training.setDescription(trainingUpdate.getDescription());
            }
            // Toujours mettre à jour l'image d'aperçu (même si c'est une chaîne vide pour supprimer l'image)
            String newImageUrl = trainingUpdate.getImageUrl() != null ? trainingUpdate.getImageUrl() : "";
            training.setImageUrl(newImageUrl);
            System.out.println("📝 Mise à jour formation - ImageUrl: " + (newImageUrl != null && !newImageUrl.isEmpty() ? newImageUrl.substring(0, Math.min(50, newImageUrl.length())) + "..." : "vide"));
            // Toujours mettre à jour les objectifs (même si c'est une liste vide)
            training.setObjectifs(trainingUpdate.getObjectifs() != null ? trainingUpdate.getObjectifs() : new java.util.ArrayList<>());
            // Toujours mettre à jour les prérequis (même si c'est une liste vide)
            training.setPrerequis(trainingUpdate.getPrerequis() != null ? trainingUpdate.getPrerequis() : new java.util.ArrayList<>());
            // Toujours mettre à jour le programme (même si c'est une chaîne vide)
            training.setProgramme(trainingUpdate.getProgramme() != null ? trainingUpdate.getProgramme() : "");
            
            // Log pour déboguer
            System.out.println("📝 Mise à jour formation - Objectifs: " + training.getObjectifs());
            System.out.println("📝 Mise à jour formation - Prérequis: " + training.getPrerequis());
            System.out.println("📝 Mise à jour formation - Programme: " + training.getProgramme());

            Training saved = trainingRepository.save(training);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Supprimer une formation
     * DELETE /api/trainings/{id}
     * Les formateurs ne peuvent supprimer que leurs propres formations (vérification via trainerId)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTraining(
            @PathVariable String id,
            @RequestHeader(value = "X-Trainer-Id", required = false) String trainerIdHeader) {
        try {
            Optional<Training> trainingOpt = trainingRepository.findById(id);
            if (trainingOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Training training = trainingOpt.get();
            
            // Vérification de sécurité : si un trainerId est fourni dans le header, 
            // vérifier que la formation appartient bien à ce formateur
            if (trainerIdHeader != null && !trainerIdHeader.isEmpty()) {
                if (training.getTrainerId() == null || !training.getTrainerId().equals(trainerIdHeader)) {
                    return ResponseEntity.status(403).build(); // Forbidden
                }
            }
            
            // Vérifier s'il y a des sessions liées à cette formation (par titre)
            List<com.monespaceformation.backend.model.SessionFormation> sessions = sessionRepository.findAll();
            boolean hasRelatedSessions = sessions.stream()
                .anyMatch(session -> session.getTitle() != null && session.getTitle().equals(training.getTitle()));

            if (hasRelatedSessions) {
                return ResponseEntity.badRequest().body("Impossible de supprimer cette formation car des sessions y sont liées. Veuillez d'abord supprimer les sessions associées.");
            }

            trainingRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Mettre à jour uniquement le contenu pédagogique d'une formation
     * PUT /api/trainings/{id}/pedagogical-content
     * Accessible aux formateurs pour modifier objectifs, prerequis et programme
     */
    @PutMapping("/{id}/pedagogical-content")
    public ResponseEntity<Training> updatePedagogicalContent(
            @PathVariable String id, 
            @RequestBody Training trainingUpdate,
            @RequestHeader(value = "X-Trainer-Id", required = false) String trainerIdHeader) {
        try {
            Optional<Training> trainingOpt = trainingRepository.findById(id);
            if (trainingOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Training training = trainingOpt.get();
            
            // Vérification de sécurité : si un trainerId est fourni dans le header, 
            // vérifier que la formation appartient bien à ce formateur
            if (trainerIdHeader != null && !trainerIdHeader.isEmpty()) {
                if (training.getTrainerId() == null || !training.getTrainerId().equals(trainerIdHeader)) {
                    return ResponseEntity.status(403).build(); // Forbidden
                }
            }
            
            // Mettre à jour uniquement le contenu pédagogique
            if (trainingUpdate.getObjectifs() != null) {
                training.setObjectifs(trainingUpdate.getObjectifs());
            }
            if (trainingUpdate.getPrerequis() != null) {
                training.setPrerequis(trainingUpdate.getPrerequis());
            }
            if (trainingUpdate.getProgramme() != null) {
                training.setProgramme(trainingUpdate.getProgramme());
            }

            Training saved = trainingRepository.save(training);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}

