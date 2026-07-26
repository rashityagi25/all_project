package com.legalai.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "helplines")
public class Helpline {

    @Id
    private String id;

    private String crimeType;
    private String title;
    private List<HelplineContact> contacts;
    private String description;
}