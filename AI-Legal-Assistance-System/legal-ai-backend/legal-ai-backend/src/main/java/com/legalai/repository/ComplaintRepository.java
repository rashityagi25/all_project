package com.legalai.repository;

import com.legalai.model.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    List<Complaint> findByUserId(String userId);
    List<Complaint> findByStatus(String status);
    List<Complaint> findByOfficerId(String officerId);
    List<Complaint> findByUserIdOrderByCreatedAtDesc(String userId);
    long countByOfficerId(String officerId);
}