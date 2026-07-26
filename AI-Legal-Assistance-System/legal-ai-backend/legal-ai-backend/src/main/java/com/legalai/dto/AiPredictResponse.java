package com.legalai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AiPredictResponse {

    private String title;

    @JsonProperty("is_crime")
    private boolean isCrime;

    private double confidence;

    private String label;
}