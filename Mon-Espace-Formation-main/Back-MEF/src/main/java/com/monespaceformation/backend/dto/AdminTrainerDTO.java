package com.monespaceformation.backend.dto;

/**
 * DTO pour les formateurs dans l'interface d'administration
 */
public class AdminTrainerDTO {
    private String id;
    private String fullname;
    private String email;
    private String speciality;
    private int activeSessions;
    private String typeContrat;
    private Double tarif;

    public AdminTrainerDTO() {}

    public AdminTrainerDTO(String id, String fullname, String email, String speciality, int activeSessions) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.speciality = speciality;
        this.activeSessions = activeSessions;
    }

    public AdminTrainerDTO(String id, String fullname, String email, String speciality, int activeSessions, String typeContrat, Double tarif) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.speciality = speciality;
        this.activeSessions = activeSessions;
        this.typeContrat = typeContrat;
        this.tarif = tarif;
    }

    // Getters et Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSpeciality() { return speciality; }
    public void setSpeciality(String speciality) { this.speciality = speciality; }

    public int getActiveSessions() { return activeSessions; }
    public void setActiveSessions(int activeSessions) { this.activeSessions = activeSessions; }

    public String getTypeContrat() { return typeContrat; }
    public void setTypeContrat(String typeContrat) { this.typeContrat = typeContrat; }

    public Double getTarif() { return tarif; }
    public void setTarif(Double tarif) { this.tarif = tarif; }
}

