package com.legalai.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "fir_drafts")
public class FirDraft {

    @Id
    private String id;

    private String complaintId;
    private String firNumber;
    private String complainantName;
    private String crimeType;
    private String ipcSection;
    private String accusedName;
    private String firDraft;
    private String status;
    private boolean isCrime;
    private double aiConfidence;
    private LocalDateTime generatedAt = LocalDateTime.now();
}