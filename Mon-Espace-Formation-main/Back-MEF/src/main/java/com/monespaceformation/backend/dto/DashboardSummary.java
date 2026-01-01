package com.monespaceformation.backend.dto;

import com.monespaceformation.backend.model.SessionFormation;
import com.monespaceformation.backend.model.User;
import java.util.List; // <--- TRÈS IMPORTANT

public class DashboardSummary {
    private User user;
    
    // 👇 ON A REMPLACÉ "SessionFormation" PAR "List<SessionFormation>"
    private List<SessionFormation> inscriptions; 
    
    private Statistics stats;

    public DashboardSummary(User user, List<SessionFormation> inscriptions, Statistics stats) {
        this.user = user;
        this.inscriptions = inscriptions;
        this.stats = stats;
    }

    // --- GETTERS & SETTERS ---
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    // Le getter renvoie une liste
    public List<SessionFormation> getInscriptions() { return inscriptions; }
    public void setInscriptions(List<SessionFormation> inscriptions) { this.inscriptions = inscriptions; }

    public Statistics getStats() { return stats; }
    public void setStats(Statistics stats) { this.stats = stats; }

    // --- CLASSE INTERNE STATISTICS ---
    public static class Statistics {
        private int formationsSuivies;
        private int heuresFormation;
        private int attestations;

        public Statistics() {}

        public Statistics(int formationsSuivies, int heuresFormation, int attestations) {
            this.formationsSuivies = formationsSuivies;
            this.heuresFormation = heuresFormation;
            this.attestations = attestations;
        }

        public int getFormationsSuivies() { return formationsSuivies; }
        public void setFormationsSuivies(int formationsSuivies) { this.formationsSuivies = formationsSuivies; }
        public int getHeuresFormation() { return heuresFormation; }
        public void setHeuresFormation(int heuresFormation) { this.heuresFormation = heuresFormation; }
        public int getAttestations() { return attestations; }
        public void setAttestations(int attestations) { this.attestations = attestations; }
    }
}