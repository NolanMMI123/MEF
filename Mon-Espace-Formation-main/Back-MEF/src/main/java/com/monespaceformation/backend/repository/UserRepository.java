package com.monespaceformation.backend.repository;

import com.monespaceformation.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    // Permet de trouver un utilisateur par son email (pour le Login)
    Optional<User> findByEmail(String email);

    // Permet de savoir si un email existe déjà (pour l'Inscription)
    Boolean existsByEmail(String email);
}