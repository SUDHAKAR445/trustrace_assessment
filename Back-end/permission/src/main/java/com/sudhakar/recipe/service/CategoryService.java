package com.sudhakar.recipe.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.entity.Category;
import com.sudhakar.recipe.entity.Recipe;

public interface CategoryService {

    ResponseEntity <Category> createCategory(String categoryName);

    ResponseEntity <List<String>> getAllCategories();

    ResponseEntity<List<Recipe>> getAllRecipeByCategoryName(String categoryName, Pageable page);
}
