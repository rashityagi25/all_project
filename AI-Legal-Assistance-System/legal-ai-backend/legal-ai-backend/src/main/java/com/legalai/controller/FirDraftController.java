package com.legalai.controller;

import com.legalai.model.FirDraft;
import com.legalai.service.FirDraftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/fir")
@RequiredArgsConstructor
public class FirDraftController {

    private final FirDraftService firDraftService;

    // ── Get FIR by Complaint ID ──────────────────
    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<FirDraft> getByComplaintId(@PathVariable String complaintId) {
        Optional<FirDraft> firDraft = firDraftService.getByComplaintId(complaintId);
        return firDraft.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Get All FIRs ─────────────────────────────
    @GetMapping("/all")
    public ResponseEntity<List<FirDraft>> getAllFirDrafts() {
        List<FirDraft> firDrafts = firDraftService.getAllFirDrafts();
        return ResponseEntity.ok(firDrafts);
    }
}