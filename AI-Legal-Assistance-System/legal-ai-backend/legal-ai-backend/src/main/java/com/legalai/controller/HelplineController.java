package com.legalai.controller;

import com.legalai.model.Helpline;
import com.legalai.service.HelplineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/helplines")
@RequiredArgsConstructor
public class HelplineController {

    private final HelplineService helplineService;

    // ── Get all helplines ────────────────────────
    @GetMapping
    public ResponseEntity<List<Helpline>> getAllHelplines() {
        return ResponseEntity.ok(helplineService.getAllHelplines());
    }

    // ── Get helpline by crime type ───────────────
    @GetMapping("/{crimeType}")
    public ResponseEntity<Helpline> getHelplineByCrimeType(@PathVariable String crimeType) {
        Optional<Helpline> helpline = helplineService.getHelplineByCrimeType(crimeType);
        return helpline.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}