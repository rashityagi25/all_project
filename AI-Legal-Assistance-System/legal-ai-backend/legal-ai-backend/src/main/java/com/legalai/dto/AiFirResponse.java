package com.legalai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AiFirResponse {

    @JsonProperty("fir_number")
    private String firNumber;

    @JsonProperty("filed_date")
    private String filedDate;

    @JsonProperty("complainant_name")
    private String complainantName;

    @JsonProperty("crime_type")
    private String crimeType;

    @JsonProperty("ipc_section")
    private String ipcSection;

    @JsonProperty("accused_name")
    private String accusedName;

    @JsonProperty("fir_draft")
    private String firDraft;

    private String status;
}