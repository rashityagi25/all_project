package com.legalai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class AiLegalResponse {

    @JsonProperty("crime_type")
    private String crimeType;

    private List<String> sections;

    private String description;

    @JsonProperty("bail_status")
    private String bailStatus;

    private String advice;

    private String helpline;

    private String message;
}