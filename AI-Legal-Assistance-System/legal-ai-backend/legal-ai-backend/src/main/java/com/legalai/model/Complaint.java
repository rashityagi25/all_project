package com.legalai.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "complaints")
public class Complaint {

    @Id
    private String id;

    private String userId;

    private String crimeTypeId;

    private String officerId;

    private String title;

    private String description;

    private Address address;

    private String status; // DRAFT, SUBMITTED, UNDER_REVIEW, RESOLVED, REJECTED

    private List<TimelineEvent> timeline = new ArrayList<>();

    private List<String> evidenceIds = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime lastUpdatedAt = LocalDateTime.now();
}