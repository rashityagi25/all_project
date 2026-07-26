package com.legalai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ComplaintRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Crime type is required")
    private String crimeTypeId;

    private String street;
    private String city;
    private String state;
    private String pincode;
}