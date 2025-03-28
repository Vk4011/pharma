package com.example.server.model;

import jakarta.persistence.*;

@Entity
@Table(name = "medicine_info")
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    private String precautions;
    private String suggestedDosage;
    private String bestTimeToTake;
    private String uses;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPrecautions() { return precautions; }
    public void setPrecautions(String precautions) { this.precautions = precautions; }
    public String getSuggestedDosage() { return suggestedDosage; }
    public void setSuggestedDosage(String suggestedDosage) { this.suggestedDosage = suggestedDosage; }
    public String getBestTimeToTake() { return bestTimeToTake; }
    public void setBestTimeToTake(String bestTimeToTake) { this.bestTimeToTake = bestTimeToTake; }
    public String getUses() { return uses; }
    public void setUses(String uses) { this.uses = uses; }
}