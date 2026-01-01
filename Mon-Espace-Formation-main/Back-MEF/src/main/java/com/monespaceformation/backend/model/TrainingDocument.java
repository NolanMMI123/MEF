package com.monespaceformation.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainingDocument {
    private String title;       // Ex: Facture acquittée
    private String ref;         // Ex: FAC-2024-001234
    private String type;        // Ex: Facture, Convention
    private String downloadUrl; // Lien pour télécharger
}