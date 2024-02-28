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

import com.sudhakar.recipe.entity.Category;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.service.CategoryService;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/create")
    public ResponseEntity<Category> createCategory(@RequestParam String categoryName) {
        return categoryService.createCategory(categoryName);
    }

    @GetMapping("/all")
    public ResponseEntity<List<String>> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/recipes/{categoryName}")
    public ResponseEntity<List<Recipe>> getAllRecipeByCategoryName(
            @PathVariable String categoryName,
            @RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return categoryService.getAllRecipeByCategoryName(categoryName, pageable);
    }
}
