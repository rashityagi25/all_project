package com.legalai.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimelineEvent {
    private String status;
    private String message;
    private LocalDateTime timestamp;
    private String updatedBy;
}