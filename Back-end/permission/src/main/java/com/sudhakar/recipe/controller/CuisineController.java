package com.sudhakar.recipe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.entity.Cuisine;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.service.CuisineService;

@RestController
@RequestMapping("/api/cuisine")
public class CuisineController {

    @Autowired
    private CuisineService cuisineService;

    @PostMapping("/create")
    public ResponseEntity<Cuisine> createCuisine(@RequestParam String cuisineName) {
        return cuisineService.createCuisine(cuisineName);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<String>> getAllCuisines() {
        return cuisineService.getAllCuisines();
    }

    @GetMapping("/getRecipes/{cuisineName}")
    public ResponseEntity<List<Recipe>> getAllRecipeByCuisineName(
            @PathVariable String cuisineName,
            @RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return cuisineService.getAllRecipeByCuisineName(cuisineName, pageable);
    }
}
