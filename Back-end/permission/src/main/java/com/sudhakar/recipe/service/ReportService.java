package com.sudhakar.recipe.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.dto.ReportBody;
import com.sudhakar.recipe.dto.ReportDto;

public interface ReportService {

    ResponseEntity<Void> createCommentReport(String reporterId, ReportBody report);

    ResponseEntity<Void> createRecipeReport(String reporterId, ReportBody report);

    ResponseEntity<Void> createUserReport(String reporterId, ReportBody report);

    ResponseEntity<Void> updateStatusOfReport(String reportId, String status);

    ResponseEntity<String> deleteReport(String reportId);

    ResponseEntity<Page<ReportDto>> getAllRecipeReport(Pageable pageable);

    ResponseEntity<Page<ReportDto>> getAllCommentReport(Pageable pageable);

    ResponseEntity<Page<ReportDto>> getAllUserReport(Pageable pageable);

    ResponseEntity<ReportDto> getReportById(String id);

}
