package com.monespaceformation.backend.repository;

import com.monespaceformation.backend.model.Inscription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InscriptionRepository extends MongoRepository<Inscription, String> {
    // Trouver toutes les inscriptions d'un utilisateur
    List<Inscription> findByUserId(String userId);
    
    // Vérifier si un utilisateur est déjà inscrit à une session
    boolean existsByUserIdAndSessionId(String userId, String sessionId);
}