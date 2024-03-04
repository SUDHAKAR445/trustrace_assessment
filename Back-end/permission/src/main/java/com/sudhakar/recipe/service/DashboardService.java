package com.sudhakar.recipe.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;

public interface DashboardService {

    ResponseEntity<Map<String, Integer>> adminDashboardContent();

    ResponseEntity<Map<String, Integer>> moderatorDashboardContent();
}
