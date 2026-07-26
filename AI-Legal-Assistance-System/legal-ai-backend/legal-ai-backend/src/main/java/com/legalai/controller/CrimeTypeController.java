package com.legalai.controller;

import com.legalai.model.CrimeType;
import com.legalai.service.CrimeTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crimes")
@RequiredArgsConstructor
public class CrimeTypeController {

    private final CrimeTypeService crimeTypeService;

    @GetMapping
    public ResponseEntity<List<CrimeType>> getAllCrimeTypes() {
        return ResponseEntity.ok(crimeTypeService.getAllCrimeTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCrimeTypeById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(crimeTypeService.getCrimeTypeById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createCrimeType(@RequestBody CrimeType crimeType) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(crimeTypeService.createCrimeType(crimeType));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCrimeType(@PathVariable String id, @RequestBody CrimeType crimeType) {
        try {
            return ResponseEntity.ok(crimeTypeService.updateCrimeType(id, crimeType));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCrimeType(@PathVariable String id) {
        try {
            crimeTypeService.deleteCrimeType(id);
            return ResponseEntity.ok("Crime type deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}