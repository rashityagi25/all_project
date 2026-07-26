package com.legalai.model;

import lombok.Data;

@Data
public class HelplineContact {

    private String name;
    private String number;
    private String description;
    private boolean available24x7;
}