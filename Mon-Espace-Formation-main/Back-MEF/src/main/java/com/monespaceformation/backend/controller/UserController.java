package com.monespaceformation.backend.controller;

import com.monespaceformation.backend.dto.AdminTrainerDTO;
import com.monespaceformation.backend.model.User;
import com.monespaceformation.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Controller pour gérer les utilisateurs (formateurs pour l'admin)
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Endpoint pour récupérer les utilisateurs par rôle
     * GET /api/users?role=TRAINER
     */
    @GetMapping
    public ResponseEntity<List<AdminTrainerDTO>> getUsersByRole(@RequestParam(required = false) String role) {
        try {
            List<User> users;
            if (role != null && !role.isEmpty()) {
                users = userRepository.findByRole(role);
            } else {
                users = userRepository.findAll();
            }

            List<AdminTrainerDTO> result = new ArrayList<>();

            for (User user : users) {
                String fullname = (user.getPrenom() != null ? user.getPrenom() : "") + " " + 
                                 (user.getNom() != null ? user.getNom() : "");
                fullname = fullname.trim();
                if (fullname.isEmpty()) {
                    fullname = user.getEmail() != null ? user.getEmail() : "N/A";
                }

                // Pour l'instant, on met 0 car il faudrait compter les sessions actives
                // Cela nécessiterait une relation entre User et SessionFormation
                int activeSessions = 0;

                AdminTrainerDTO dto = new AdminTrainerDTO(
                    user.getId(),
                    fullname,
                    user.getEmail() != null ? user.getEmail() : "N/A",
                    user.getPoste() != null ? user.getPoste() : "N/A",
                    activeSessions
                );

                result.add(dto);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint pour créer un nouveau formateur
     * POST /api/users/trainer
     */
    @PostMapping("/trainer")
    public ResponseEntity<User> createTrainer(@RequestBody User user) {
        try {
            // Vérifier si l'email existe déjà
            Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.badRequest().build();
            }

            // S'assurer que le rôle est TRAINER
            user.setRole("TRAINER");

            // Hacher le mot de passe si fourni
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            } else {
                // Mot de passe par défaut si non fourni
                user.setPassword(passwordEncoder.encode("trainer123"));
            }

            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}

