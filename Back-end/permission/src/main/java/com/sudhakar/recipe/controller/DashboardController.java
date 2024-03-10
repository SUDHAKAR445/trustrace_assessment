package com.sudhakar.recipe.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<Map<String, Integer>> adminDashboardContent() {
        return dashboardService.adminDashboardContent();
    }

    @PreAuthorize("hasRole('MODERATOR')")
    @GetMapping("/moderator")
    public ResponseEntity<Map<String, Integer>> moderatorDashboardContent() {
        return dashboardService.moderatorDashboardContent();
    }
}
