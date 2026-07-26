package com.legalai.service;

import com.legalai.model.Complaint;
import com.legalai.model.Evidence;
import com.legalai.repository.ComplaintRepository;
import com.legalai.repository.EvidenceRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EvidenceService {

    private final GridFsTemplate gridFsTemplate;
    private final GridFsOperations gridFsOperations;
    private final EvidenceRepository evidenceRepository;
    private final ComplaintRepository complaintRepository;

    public Evidence uploadEvidence(MultipartFile file, String complaintId, String userId) throws IOException {

        // Validate file type
        String mimeType = file.getContentType();
        if (mimeType == null || (!mimeType.startsWith("image/") &&
                !mimeType.equals("application/pdf") &&
                !mimeType.startsWith("video/"))) {
            throw new RuntimeException("Invalid file type. Only images, PDFs and videos are allowed.");
        }

        // Validate file size (max 50MB)
        if (file.getSize() > 50 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds 50MB limit.");
        }

        // Store file in GridFS
        ObjectId gridFsId = gridFsTemplate.store(
                file.getInputStream(),
                file.getOriginalFilename(),
                mimeType
        );

        // Save evidence metadata
        Evidence evidence = new Evidence();
        evidence.setComplaintId(complaintId);
        evidence.setGridFsId(gridFsId.toString());
        evidence.setFilename(file.getOriginalFilename());
        evidence.setMimeType(mimeType);
        evidence.setFileSize(file.getSize());
        evidence.setUploadedBy(userId);

        Evidence saved = evidenceRepository.save(evidence);

        // Add evidenceId to complaint
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.getEvidenceIds().add(saved.getId());
        complaintRepository.save(complaint);

        return saved;
    }

    public List<Evidence> getEvidenceByComplaint(String complaintId) {
        return evidenceRepository.findByComplaintId(complaintId);
    }

    public org.springframework.data.mongodb.gridfs.GridFsResource downloadEvidence(String evidenceId) {
        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new RuntimeException("Evidence not found"));

        com.mongodb.client.gridfs.model.GridFSFile gridFSFile = gridFsTemplate.findOne(
                new Query(Criteria.where("_id").is(new ObjectId(evidence.getGridFsId())))
        );

        if (gridFSFile == null) {
            throw new RuntimeException("File not found in storage");
        }

        return gridFsOperations.getResource(gridFSFile);
    }

    public Evidence getEvidenceById(String id) {
        return evidenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evidence not found with id: " + id));
    }
}