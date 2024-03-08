package com.sudhakar.recipe.service;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.dto.CategoryDto;
import com.sudhakar.recipe.dto.ExploreDto;
import com.sudhakar.recipe.dto.RecipeDto;
import com.sudhakar.recipe.entity.Category;

public interface CategoryService {

    ResponseEntity <Category> createCategory(String categoryName);

    ResponseEntity <Page<CategoryDto>> getAllCategories(Pageable pageable);

    ResponseEntity<Page<RecipeDto>> getAllRecipeByCategoryId(String id, Pageable page);

    ResponseEntity<CategoryDto> getCategoryDetail(String id);

    ResponseEntity<Page<CategoryDto>> getCategoriesBySearch(String searchText, Pageable page);

    ResponseEntity<Set<ExploreDto>> exploreByCategory();
}
