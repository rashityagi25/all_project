package com.legalai.controller;

import com.legalai.dto.AiFirResponse;
import com.legalai.dto.AiLegalResponse;
import com.legalai.dto.AiPredictResponse;
import com.legalai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    // ── 1. Crime Prediction ──────────────────────
    @PostMapping("/predict")
    public ResponseEntity<AiPredictResponse> predict(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        if (title == null || title.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        AiPredictResponse response = aiService.predictCrime(title);
        return ResponseEntity.ok(response);
    }

    // ── 2. Legal Advice ──────────────────────────
    @PostMapping("/legal-advice")
    public ResponseEntity<AiLegalResponse> legalAdvice(@RequestBody Map<String, String> body) {
        String crimeType = body.get("crime_type");
        if (crimeType == null || crimeType.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        AiLegalResponse response = aiService.getLegalAdvice(crimeType);
        return ResponseEntity.ok(response);
    }

    // ── 3. Generate FIR ──────────────────────────
    @PostMapping("/generate-fir")
    public ResponseEntity<AiFirResponse> generateFir(@RequestBody Map<String, String> body) {
        AiFirResponse response = aiService.generateFir(
                body.getOrDefault("complainant_name", ""),
                body.getOrDefault("incident_description", ""),
                body.getOrDefault("incident_date", ""),
                body.getOrDefault("incident_location", ""),
                body.getOrDefault("crime_type", ""),
                body.getOrDefault("accused_name", "Unknown")
        );
        return ResponseEntity.ok(response);
    }
}