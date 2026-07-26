package com.legalai.repository;

import com.legalai.model.CrimeType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CrimeTypeRepository extends MongoRepository<CrimeType, String> {
    Optional<CrimeType> findByName(String name);
    List<CrimeType> findBySeverity(String severity);
    boolean existsByName(String name);
}