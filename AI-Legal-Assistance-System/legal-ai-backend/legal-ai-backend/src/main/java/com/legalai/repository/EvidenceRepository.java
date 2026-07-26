package com.legalai.repository;

import com.legalai.model.Evidence;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EvidenceRepository extends MongoRepository<Evidence, String> {
    List<Evidence> findByComplaintId(String complaintId);
    List<Evidence> findByUploadedBy(String uploadedBy);
}