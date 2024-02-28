package com.sudhakar.recipe.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.entity.Report;

public interface ReportService {

    ResponseEntity<String> createReport(Report report);

    ResponseEntity<String> updateStatusOfReport(String reportId, String status);

    ResponseEntity<String> deleteReport(String reportId);

    ResponseEntity<List<Report>> getAllReport(Pageable pageable);

    // ResponseEntity<List<Report>> getReportByUserIdOrRecipeIdOrCommentIdOrUsername(String id, Pageable pageable);
}
