package com.legalai.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "evidence")
public class Evidence {

    @Id
    private String id;

    private String complaintId;

    private String gridFsId;

    private String filename;

    private String mimeType;

    private long fileSize;

    private String uploadedBy;

    private LocalDateTime uploadedAt = LocalDateTime.now();
}