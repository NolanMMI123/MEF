package com.monespaceformation.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "inscriptions")
public class Inscription {
    @Id
    private String id;

    // Champs techniques
    private String userId;      
    private String sessionId;   
    private String formationId; // Ajouté pour matcher ton React
    private LocalDate dateInscription;
    private String status;      // "VALIDÉ"

    // Champs métier (Le formulaire)
    private Double amount;      // Le prix payé (2490)
    private Participant participant; // L'objet complexe avec adresse, nom, etc.
    private Double note;       // Note attribuée par le formateur (sur 20)

    public Inscription() {
        this.dateInscription = LocalDate.now();
    }

    // --- GETTERS ET SETTERS ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getFormationId() { return formationId; }
    public void setFormationId(String formationId) { this.formationId = formationId; }

    public LocalDate getDateInscription() { return dateInscription; }
    public void setDateInscription(LocalDate dateInscription) { this.dateInscription = dateInscription; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Participant getParticipant() { return participant; }
    public void setParticipant(Participant participant) { this.participant = participant; }

    public Double getNote() { return note; }
    public void setNote(Double note) { this.note = note; }
}