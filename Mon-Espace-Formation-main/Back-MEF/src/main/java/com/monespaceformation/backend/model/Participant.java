package com.monespaceformation.backend.model;

public class Participant {
    
    private String typeInscription; // "individuel" ou "entreprise"
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String cp;
    private String ville;
    private String entreprise; // Peut être null
    private String poste;      // Peut être null

    public Participant() {}

    // --- GETTERS ET SETTERS (Obligatoires) ---
    public String getTypeInscription() { return typeInscription; }
    public void setTypeInscription(String typeInscription) { this.typeInscription = typeInscription; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getCp() { return cp; }
    public void setCp(String cp) { this.cp = cp; }

    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }

    public String getEntreprise() { return entreprise; }
    public void setEntreprise(String entreprise) { this.entreprise = entreprise; }

    public String getPoste() { return poste; }
    public void setPoste(String poste) { this.poste = poste; }
}