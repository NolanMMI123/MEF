package com.monespaceformation.backend.repository;

import com.monespaceformation.backend.model.Training;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TrainingRepository extends MongoRepository<Training, String> {
    // C'est vide pour l'instant, c'est normal !
    // MongoRepository fait tout le travail magique derrière.
}