package com.sudhakar.recipe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.entity.Report;
import com.sudhakar.recipe.service.ReportService;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping("/create")
    public ResponseEntity<String> createReport(@RequestBody Report report) {
        return reportService.createReport(report);
    }

    @PatchMapping("/update/{reportId}")
    public ResponseEntity<String> updateStatusOfReport(@PathVariable String reportId, @RequestParam String status) {
        return reportService.updateStatusOfReport(reportId, status);
    }

    @DeleteMapping("/delete/{reportId}")
    public ResponseEntity<String> deleteReport(@PathVariable String reportId) {
        return reportService.deleteReport(reportId);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Report>> getAllReport(@RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reportService.getAllReport(pageable);
    }
}
