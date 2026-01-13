package com.monespaceformation.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    
    @Id
    private String id; // C'est cet ID que React attend !

    private String nom;
    private String prenom;
    private String email;
    private String password;
    private String entreprise;
    private String poste;
    private String role; // "USER", "TRAINER", "ADMIN"

    // Champs pour la gestion de la rentabilité (formateurs)
    private String typeContrat; // "Freelance", "CDD", "Vacataire"
    private Double tarif; // Tarif horaire ou journalier en euros

    // Constructeur vide
    public User() {}

    // Constructeur avec arguments
    public User(String nom, String prenom, String email, String password) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
    }

    // --- LES GETTERS (C'est la partie CRITIQUE) ---
    // Sans la méthode ci-dessous, l'ID reste bloqué côté serveur.
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEntreprise() { return entreprise; }
    public void setEntreprise(String entreprise) { this.entreprise = entreprise; }

    public String getPoste() { return poste; }
    public void setPoste(String poste) { this.poste = poste; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getTypeContrat() { return typeContrat; }
    public void setTypeContrat(String typeContrat) { this.typeContrat = typeContrat; }

    public Double getTarif() { return tarif; }
    public void setTarif(Double tarif) { this.tarif = tarif; }
}