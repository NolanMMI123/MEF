package com.monespaceformation.backend.config;

import com.monespaceformation.backend.model.Training;
import com.monespaceformation.backend.model.TrainingDocument;
import com.monespaceformation.backend.repository.TrainingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(TrainingRepository trainingRepository) {
        return args -> {
            // On ajoute la formation SEULEMENT si la base est vide
            if (trainingRepository.count() == 0) {
                Training t = new Training();
                t.setTitle("Développement Front-End avec React et TypeScript");
                t.setReference("FORM-DEV-001");
                t.setSessionRef("INS-2024-001234");
                t.setStartDate("15 Janvier 2025");
                t.setEndDate("19 Janvier 2025");
                t.setDuration("5 Jours");
                t.setLocation("42 Avenue des Champs-Élysées, 75008 Paris");

                t.setTrainerName("Jean-Pierre Martin");
                t.setTrainerRole("Expert React & TypeScript");
                t.setTrainerEmail("jp.martin@txlforma.fr");
                t.setStatus("A Venir");

                // Les documents de ta maquette
                t.setDocuments(Arrays.asList(
                        new TrainingDocument("Facture acquittée", "FAC-2024-001234", "Facture", "#"),
                        new TrainingDocument("Confirmation d'inscription", "INS-2024", "Confirmation", "#"),
                        new TrainingDocument("Convention de formation", "CONV-2024", "Convention", "#")
                ));

                trainingRepository.save(t);
                System.out.println("--- DONNÉES DE DÉMO AJOUTÉES (Formation React) ---");
            }
        };
    }
}