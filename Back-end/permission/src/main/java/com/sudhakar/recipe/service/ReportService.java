package com.sudhakar.recipe.service;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.dto.ReportBody;
import com.sudhakar.recipe.dto.ReportDto;
import com.sudhakar.recipe.entity.Status;

public interface ReportService {

    ResponseEntity<String> createCommentReport(String reporterId, ReportBody report);

    ResponseEntity<String> createRecipeReport(String reporterId, ReportBody report);

    ResponseEntity<String> createUserReport(String reporterId, ReportBody report);

    ResponseEntity<String> updateStatusOfReport(String reportId, String status);

    ResponseEntity<String> deleteReport(String reportId);

    ResponseEntity<Page<ReportDto>> getAllRecipeReport(Pageable pageable);

    ResponseEntity<Page<ReportDto>> getAllCommentReport(Pageable pageable);

    ResponseEntity<Page<ReportDto>> getAllUserReport(Pageable pageable);

    ResponseEntity<ReportDto> getReportById(String id);

}
