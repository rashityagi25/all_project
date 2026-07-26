package com.legalai.controller;

import com.legalai.model.Evidence;
import com.legalai.service.EvidenceService;
import com.legalai.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/evidence")
@RequiredArgsConstructor
public class EvidenceController {

    private final EvidenceService evidenceService;
    private final JwtUtil jwtUtil;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadEvidence(
            @RequestParam("file") MultipartFile file,
            @RequestParam("complaintId") String complaintId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtUtil.extractUserId(token);
            Evidence evidence = evidenceService.uploadEvidence(file, complaintId, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(evidence);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<?> getEvidenceByComplaint(@PathVariable String complaintId) {
        try {
            List<Evidence> evidenceList = evidenceService.getEvidenceByComplaint(complaintId);
            return ResponseEntity.ok(evidenceList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/download/{evidenceId}")
    public ResponseEntity<?> downloadEvidence(
            @PathVariable String evidenceId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Evidence evidence = evidenceService.getEvidenceById(evidenceId);
            Resource resource = evidenceService.downloadEvidence(evidenceId);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(evidence.getMimeType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + evidence.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEvidenceById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(evidenceService.getEvidenceById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}