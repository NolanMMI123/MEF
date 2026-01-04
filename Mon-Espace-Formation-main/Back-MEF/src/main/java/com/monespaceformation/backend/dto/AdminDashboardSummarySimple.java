package com.monespaceformation.backend.dto;

public class AdminDashboardSummarySimple {
    
    private int totalInscriptions;
    private double totalRevenue;
    private int upcomingSessions;
    private double registrationTrend;
    private double revenueTrend;

    // Constructeur vide
    public AdminDashboardSummarySimple() {}

    // Constructeur avec arguments
    public AdminDashboardSummarySimple(int totalInscriptions, double totalRevenue, int upcomingSessions, 
                                      double registrationTrend, double revenueTrend) {
        this.totalInscriptions = totalInscriptions;
        this.totalRevenue = totalRevenue;
        this.upcomingSessions = upcomingSessions;
        this.registrationTrend = registrationTrend;
        this.revenueTrend = revenueTrend;
    }

    // Getters et Setters
    public int getTotalInscriptions() {
        return totalInscriptions;
    }

    public void setTotalInscriptions(int totalInscriptions) {
        this.totalInscriptions = totalInscriptions;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public int getUpcomingSessions() {
        return upcomingSessions;
    }

    public void setUpcomingSessions(int upcomingSessions) {
        this.upcomingSessions = upcomingSessions;
    }

    public double getRegistrationTrend() {
        return registrationTrend;
    }

    public void setRegistrationTrend(double registrationTrend) {
        this.registrationTrend = registrationTrend;
    }

    public double getRevenueTrend() {
        return revenueTrend;
    }

    public void setRevenueTrend(double revenueTrend) {
        this.revenueTrend = revenueTrend;
    }
}

