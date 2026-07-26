package com.legalai.repository;

import com.legalai.model.Helpline;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HelplineRepository extends MongoRepository<Helpline, String> {

    Optional<Helpline> findByCrimeTypeIgnoreCase(String crimeType);

    List<Helpline> findAll();
}