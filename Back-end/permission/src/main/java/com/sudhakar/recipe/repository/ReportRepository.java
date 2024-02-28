package com.sudhakar.recipe.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Report;

@Repository
public interface ReportRepository extends MongoRepository<Report, String> {

}
