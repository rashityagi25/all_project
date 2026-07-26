package com.legalai.service;

import com.legalai.model.CrimeType;
import com.legalai.repository.CrimeTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrimeTypeService {

    private final CrimeTypeRepository crimeTypeRepository;

    public List<CrimeType> getAllCrimeTypes() {
        return crimeTypeRepository.findAll();
    }

    public CrimeType getCrimeTypeById(String id) {
        return crimeTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crime type not found with id: " + id));
    }

    public CrimeType createCrimeType(CrimeType crimeType) {
        if (crimeTypeRepository.existsByName(crimeType.getName())) {
            throw new RuntimeException("Crime type already exists: " + crimeType.getName());
        }
        return crimeTypeRepository.save(crimeType);
    }

    public CrimeType updateCrimeType(String id, CrimeType crimeType) {
        CrimeType existing = getCrimeTypeById(id);
        existing.setName(crimeType.getName());
        existing.setIpcSection(crimeType.getIpcSection());
        existing.setSeverity(crimeType.getSeverity());
        existing.setBailable(crimeType.isBailable());
        existing.setDescription(crimeType.getDescription());
        return crimeTypeRepository.save(existing);
    }

    public void deleteCrimeType(String id) {
        CrimeType existing = getCrimeTypeById(id);
        crimeTypeRepository.delete(existing);
    }

    public List<CrimeType> getCrimeTypesBySeverity(String severity) {
        return crimeTypeRepository.findBySeverity(severity);
    }
}