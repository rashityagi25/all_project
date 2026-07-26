package com.legalai.service;

import com.legalai.dto.AiFirResponse;
import com.legalai.dto.AiLegalResponse;
import com.legalai.dto.AiPredictResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    private final WebClient webClient;

    @Value("${ai.service.url:http://localhost:5000}")
    private String aiServiceUrl;

    // ── 1. Crime Prediction ──────────────────────
    public AiPredictResponse predictCrime(String title) {
        try {
            return webClient.post()
                    .uri(aiServiceUrl + "/ai/predict")
                    .bodyValue(Map.of("title", title))
                    .retrieve()
                    .bodyToMono(AiPredictResponse.class)
                    .block();
        } catch (Exception e) {
            log.error("AI predict failed: {}", e.getMessage());
            AiPredictResponse fallback = new AiPredictResponse();
            fallback.setTitle(title);
            fallback.setCrime(false);
            fallback.setConfidence(0.0);
            fallback.setLabel("UNKNOWN");
            return fallback;
        }
    }

    // ── 2. Legal Advice ──────────────────────────
    public AiLegalResponse getLegalAdvice(String crimeType) {
        try {
            return webClient.post()
                    .uri(aiServiceUrl + "/ai/legal-advice")
                    .bodyValue(Map.of("crime_type", crimeType))
                    .retrieve()
                    .bodyToMono(AiLegalResponse.class)
                    .block();
        } catch (Exception e) {
            log.error("AI legal advice failed: {}", e.getMessage());
            AiLegalResponse fallback = new AiLegalResponse();
            fallback.setCrimeType(crimeType);
            fallback.setMessage("Legal advice unavailable. Please consult a lawyer.");
            return fallback;
        }
    }

    // ── 3. Generate FIR ──────────────────────────
    public AiFirResponse generateFir(String complainantName,
                                     String description,
                                     String incidentDate,
                                     String location,
                                     String crimeType,
                                     String accusedName) {
        try {
            Map<String, String> body = Map.of(
                    "complainant_name",      complainantName,
                    "incident_description",  description,
                    "incident_date",         incidentDate,
                    "incident_location",     location,
                    "crime_type",            crimeType,
                    "accused_name",          accusedName
            );

            return webClient.post()
                    .uri(aiServiceUrl + "/ai/generate-fir")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(AiFirResponse.class)
                    .block();
        } catch (Exception e) {
            log.error("AI FIR generation failed: {}", e.getMessage());
            AiFirResponse fallback = new AiFirResponse();
            fallback.setStatus("FAILED");
            fallback.setFirDraft("FIR generation failed. Please try again.");
            return fallback;
        }
    }
}