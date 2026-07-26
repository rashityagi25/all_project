package com.legalai.service;

import com.legalai.dto.AiFirResponse;
import com.legalai.dto.AiPredictResponse;
import com.legalai.model.Complaint;
import com.legalai.model.FirDraft;
import com.legalai.repository.FirDraftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FirDraftService {

    private final FirDraftRepository firDraftRepository;
    private final AiService aiService;

    // ── Auto generate FIR when complaint is filed ──
    public FirDraft generateAndSave(Complaint complaint, String complainantName) {

        // 1. Check if FIR already exists for this complaint
        Optional<FirDraft> existing = firDraftRepository.findByComplaintId(complaint.getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        // 2. AI Crime Prediction
        AiPredictResponse prediction = aiService.predictCrime(complaint.getTitle());

        // 3. AI FIR Generation
        AiFirResponse firResponse = aiService.generateFir(
                complainantName,
                complaint.getDescription(),
                complaint.getCreatedAt().toLocalDate().toString(),
                complaint.getAddress() != null ? complaint.getAddress().getCity() : "Unknown",
                complaint.getTitle(),
                "Unknown"
        );

        // 4. Save to MongoDB
        FirDraft firDraft = new FirDraft();
        firDraft.setComplaintId(complaint.getId());
        firDraft.setFirNumber(firResponse.getFirNumber());
        firDraft.setComplainantName(complainantName);
        firDraft.setCrimeType(complaint.getTitle());
        firDraft.setIpcSection(firResponse.getIpcSection());
        firDraft.setAccusedName("Unknown");
        firDraft.setFirDraft(firResponse.getFirDraft());
        firDraft.setStatus(firResponse.getStatus());
        firDraft.setCrime(prediction.isCrime());
        firDraft.setAiConfidence(prediction.getConfidence());

        return firDraftRepository.save(firDraft);
    }

    // ── Get FIR by complaint ID ──
    public Optional<FirDraft> getByComplaintId(String complaintId) {
        return firDraftRepository.findByComplaintId(complaintId);
    }

    // ── Get all FIRs ──
    public List<FirDraft> getAllFirDrafts() {
        return firDraftRepository.findAllByOrderByGeneratedAtDesc();
    }
}