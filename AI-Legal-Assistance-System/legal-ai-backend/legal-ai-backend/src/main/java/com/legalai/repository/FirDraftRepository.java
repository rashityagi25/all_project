package com.legalai.repository;

import com.legalai.model.FirDraft;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FirDraftRepository extends MongoRepository<FirDraft, String> {

    Optional<FirDraft> findByComplaintId(String complaintId);

    List<FirDraft> findAllByOrderByGeneratedAtDesc();
}