package com.sudhakar.recipe.controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.dto.CategoryDto;
import com.sudhakar.recipe.dto.ExploreDto;
import com.sudhakar.recipe.dto.RecipeDto;
import com.sudhakar.recipe.entity.Category;
import com.sudhakar.recipe.service.CategoryService;

@RestController
@RequestMapping("/api/category")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping()
    public ResponseEntity<Category> createCategory(@RequestBody String categoryName) {
        return categoryService.createCategory(categoryName);
    }

    @GetMapping()
    public ResponseEntity<Page<CategoryDto>> getAllCategories(@RequestParam int page, @RequestParam int size) {
        return categoryService.getAllCategories(PageRequest.of(page, size));
    }

    @GetMapping("/getRecipes/{id}")
    public ResponseEntity<Page<RecipeDto>> getAllRecipeByCategoryId(
            @PathVariable String id,
            @RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return categoryService.getAllRecipeByCategoryId(id, pageable);
    }

    @GetMapping("{id}")
    public ResponseEntity<CategoryDto> getCuisineDetail(@PathVariable String id) {
        return categoryService.getCategoryDetail(id);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CategoryDto>> search(@RequestParam String searchText, @RequestParam int page, @RequestParam int size) {
        return categoryService.getCategoriesBySearch(searchText, PageRequest.of(page, size));
    }

    @GetMapping("/explore")
    public ResponseEntity<Set<ExploreDto>> exploreCategory() {
        return categoryService.exploreByCategory();
    }
}
