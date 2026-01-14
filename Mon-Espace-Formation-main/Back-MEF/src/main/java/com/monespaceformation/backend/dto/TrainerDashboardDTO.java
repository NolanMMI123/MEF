package com.monespaceformation.backend.dto;

import com.monespaceformation.backend.model.Training;
import com.monespaceformation.backend.model.User;
import java.util.List;

/**
 * DTO pour le dashboard du formateur
 * Contient les informations du formateur, ses formations et les inscrits pour chaque formation
 */
public class TrainerDashboardDTO {
    private User trainer;
    private List<TrainingWithInscrits> formations;
    private Statistics stats;

    public TrainerDashboardDTO() {}

    public TrainerDashboardDTO(User trainer, List<TrainingWithInscrits> formations, Statistics stats) {
        this.trainer = trainer;
        this.formations = formations;
        this.stats = stats;
    }

    // Getters et Setters
    public User getTrainer() { return trainer; }
    public void setTrainer(User trainer) { this.trainer = trainer; }

    public List<TrainingWithInscrits> getFormations() { return formations; }
    public void setFormations(List<TrainingWithInscrits> formations) { this.formations = formations; }

    public Statistics getStats() { return stats; }
    public void setStats(Statistics stats) { this.stats = stats; }

    /**
     * Classe interne pour représenter une formation avec ses inscrits
     */
    public static class TrainingWithInscrits {
        private Training training;
        private List<InscritInfo> inscrits;

        public TrainingWithInscrits() {}

        public TrainingWithInscrits(Training training, List<InscritInfo> inscrits) {
            this.training = training;
            this.inscrits = inscrits;
        }

        public Training getTraining() { return training; }
        public void setTraining(Training training) { this.training = training; }

        public List<InscritInfo> getInscrits() { return inscrits; }
        public void setInscrits(List<InscritInfo> inscrits) { this.inscrits = inscrits; }
    }

    /**
     * Classe interne pour représenter les informations d'un inscrit
     */
    public static class InscritInfo {
        private String userId;
        private String userName;
        private String userEmail;
        private String inscriptionDate;
        private String status;
        private Double note;
        private String inscriptionId; // ID de l'inscription pour pouvoir la mettre à jour

        public InscritInfo() {}

        public InscritInfo(String userId, String userName, String userEmail, String inscriptionDate, String status) {
            this.userId = userId;
            this.userName = userName;
            this.userEmail = userEmail;
            this.inscriptionDate = inscriptionDate;
            this.status = status;
        }

        public InscritInfo(String userId, String userName, String userEmail, String inscriptionDate, String status, Double note, String inscriptionId) {
            this.userId = userId;
            this.userName = userName;
            this.userEmail = userEmail;
            this.inscriptionDate = inscriptionDate;
            this.status = status;
            this.note = note;
            this.inscriptionId = inscriptionId;
        }

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

        public String getInscriptionDate() { return inscriptionDate; }
        public void setInscriptionDate(String inscriptionDate) { this.inscriptionDate = inscriptionDate; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Double getNote() { return note; }
        public void setNote(Double note) { this.note = note; }

        public String getInscriptionId() { return inscriptionId; }
        public void setInscriptionId(String inscriptionId) { this.inscriptionId = inscriptionId; }
    }

    /**
     * Classe interne pour les statistiques du formateur
     */
    public static class Statistics {
        private int totalEleves;
        private int heuresCoursPrevues;
        private int nombreFormations;
        private double revenuTotal; // Revenu total calculé

        public Statistics() {}

        public Statistics(int totalEleves, int heuresCoursPrevues, int nombreFormations) {
            this.totalEleves = totalEleves;
            this.heuresCoursPrevues = heuresCoursPrevues;
            this.nombreFormations = nombreFormations;
            this.revenuTotal = 0.0;
        }

        public Statistics(int totalEleves, int heuresCoursPrevues, int nombreFormations, double revenuTotal) {
            this.totalEleves = totalEleves;
            this.heuresCoursPrevues = heuresCoursPrevues;
            this.nombreFormations = nombreFormations;
            this.revenuTotal = revenuTotal;
        }

        public int getTotalEleves() { return totalEleves; }
        public void setTotalEleves(int totalEleves) { this.totalEleves = totalEleves; }

        public int getHeuresCoursPrevues() { return heuresCoursPrevues; }
        public void setHeuresCoursPrevues(int heuresCoursPrevues) { this.heuresCoursPrevues = heuresCoursPrevues; }

        public int getNombreFormations() { return nombreFormations; }
        public void setNombreFormations(int nombreFormations) { this.nombreFormations = nombreFormations; }

        public double getRevenuTotal() { return revenuTotal; }
        public void setRevenuTotal(double revenuTotal) { this.revenuTotal = revenuTotal; }
    }
}

