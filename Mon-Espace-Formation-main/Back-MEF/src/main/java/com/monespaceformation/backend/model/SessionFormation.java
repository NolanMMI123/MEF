package com.monespaceformation.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

// 1. On pointe vers la collection où tu as mis tes données ("trainings")
@Document(collection = "trainings")
public class SessionFormation {

    @Id
    private String id;

    // 2. On ajoute les champs qui existent dans ta base et que React attend
    private String title;       // Le titre de la formation
    
    // Si dans Mongo c'est "desc" ou "description", on essaye de mapper
    private String desc;        
    
    private Double price;       // Le prix (Double pour gérer les centimes ou entiers)
    
    // Mapping pour gérer "location" (Mongo) vers "lieu" (Ton code actuel)
    @Field("location") 
    private String lieu;
    
    // Mapping pour "duration" (Mongo) vers "time" (React)
    @Field("duration")
    private String time; 

    private String level;       // Niveau
    private String category;    // Catégorie
    
    private String dates;       // Gardé pour compatibilité
    private int placesTotales;  
    private int placesReservees;

    public SessionFormation() {}

    // Getters et Setters (Indispensables pour que Spring remplisse l'objet)
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getLieu() { return lieu; }
    public void setLieu(String lieu) { this.lieu = lieu; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDates() { return dates; }
    public void setDates(String dates) { this.dates = dates; }

    public int getPlacesTotales() { return placesTotales; }
    public void setPlacesTotales(int placesTotales) { this.placesTotales = placesTotales; }

    public int getPlacesReservees() { return placesReservees; }
    public void setPlacesReservees(int placesReservees) { this.placesReservees = placesReservees; }
}