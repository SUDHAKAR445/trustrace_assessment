package com.sudhakar.recipe.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.dto.ReportBody;
import com.sudhakar.recipe.dto.ReportDto;
import com.sudhakar.recipe.entity.Status;
import com.sudhakar.recipe.filters.ReportFilterDao;
import com.sudhakar.recipe.service.ReportService;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private ReportFilterDao reportFilterDao;

    @PostMapping("/recipe/{reporterId}")
    public ResponseEntity<String> createRecipeReport(@PathVariable String reporterId, @RequestBody ReportBody report) {
        return reportService.createRecipeReport(reporterId, report);
    }

    @PostMapping("/comment/{reporterId}")
    public ResponseEntity<String> createCommentReport(@PathVariable String reporterId, @RequestBody ReportBody report) {
        return reportService.createCommentReport(reporterId, report);
    }

    @PostMapping("/user/{reporterId}")
    public ResponseEntity<String> createUserReport(@PathVariable String reporterId, @RequestBody ReportBody report) {
        return reportService.createUserReport(reporterId, report);
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<String> updateStatusOfReport(@PathVariable String reportId, @RequestBody String status) {
        return reportService.updateStatusOfReport(reportId, status);
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<String> deleteReport(@PathVariable String reportId) {
        return reportService.deleteReport(reportId);
    }

    @GetMapping("/recipe")
    public ResponseEntity<Page<ReportDto>> getAllReportedRecipe(@RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reportService.getAllRecipeReport(pageable);
    }

    @GetMapping("/comment")
    public ResponseEntity<Page<ReportDto>> getAllReportedComment(@RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reportService.getAllCommentReport(pageable);
    }

    @GetMapping("/user")
    public ResponseEntity<Page<ReportDto>> getAllReportedUser(@RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reportService.getAllUserReport(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportDto> getReportById(@PathVariable String id) {
        return reportService.getReportById(id);
    }

    @GetMapping("/recipe/status")
    public ResponseEntity<Page<ReportDto>> getAllRecipeReportsWithStatus(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Date start,
            @RequestParam(required = false) Date end,
            @RequestParam(required = false) int page,
            @RequestParam(required = false) int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reportFilterDao.getAllRecipeReportWithStatus(searchText, status, start, end, pageable);
    }

    @GetMapping("/comment/status")
    public ResponseEntity<Page<ReportDto>> getAllCommentReportsWithStatus(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Date start,
            @RequestParam(required = false) Date end,
            @RequestParam(required = false) int page,
            @RequestParam(required = false) int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reportFilterDao.getAllCommentReportWithStatus(searchText, status, start, end, pageable);
    }

    @GetMapping("/user/status")
    public ResponseEntity<Page<ReportDto>> getAllUserReportsWithStatus(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Date start,
            @RequestParam(required = false) Date end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reportFilterDao.getAllUserReportWithStatus(searchText, status, start, end, pageable);
    }
}
