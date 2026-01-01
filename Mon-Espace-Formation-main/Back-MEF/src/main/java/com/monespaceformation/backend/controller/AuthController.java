package com.monespaceformation.backend.controller;

import com.monespaceformation.backend.model.User;
import com.monespaceformation.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
// @CrossOrigin(origins = "http://localhost:5173") // Décommentez si besoin
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- ROUTE INSCRIPTION ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erreur : Cet email est déjà utilisé !"));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Inscription réussie !"));
    }

    // --- ROUTE CONNEXION (CORRIGÉE) ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Vérification du mot de passe
            if (passwordEncoder.matches(password, user.getPassword())) {
                
                // 👇 LA CORRECTION EST ICI 👇
                // Au lieu de construire une Map manuelle incomplète, 
                // on renvoie TOUT l'objet user. 
                // Comme ça, l'ID est envoyé automatiquement.
                return ResponseEntity.ok(user);
            }
        }

        return ResponseEntity.status(401).body(Map.of("message", "Email ou mot de passe incorrect"));
    }
}