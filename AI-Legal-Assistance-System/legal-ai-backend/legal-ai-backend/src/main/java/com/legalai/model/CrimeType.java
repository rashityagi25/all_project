package com.legalai.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@Document(collection = "crimeTypes")
public class CrimeType {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String ipcSection;

    private String severity; // LOW, MEDIUM, HIGH

    private boolean bailable;

    private String description;
}