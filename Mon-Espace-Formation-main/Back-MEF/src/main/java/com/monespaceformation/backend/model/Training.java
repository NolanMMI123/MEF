package com.monespaceformation.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "trainings")
public class Training {
    @Id
    private String id;

    private String title;          // Ex: Développement Front-End avec React
    private String reference;      // Ex: FORM-DEV-001
    private String sessionRef;     // Ex: INS-2024-001234

    private String startDate;      // Ex: 15 Janvier 2025
    private String endDate;        // Ex: 19 Janvier 2025
    private String duration;       // Ex: 60 Jours (ou heures)
    private String location;       // Ex: 42 Avenue des Champs...
    private Double price;          // Prix en euros

    // Infos du formateur
    private String trainerName;    // Ex: Jean-Pierre Martin
    private String trainerRole;    // Ex: Expert React & TypeScript
    private String trainerEmail;
    private String trainerId;      // ID du formateur (User.id) pour lier la formation au formateur

    // Statut (pour l'affichage "A Venir", "En cours")
    private String status;

    // Contenu pédagogique (éditable par le formateur)
    private List<String> objectifs;    // Liste des objectifs de la formation
    private List<String> prerequis;    // Liste des prérequis
    private String programme;           // Programme détaillé de la formation

    // Liste des documents (simulés pour l'instant)
    private List<TrainingDocument> documents;
}