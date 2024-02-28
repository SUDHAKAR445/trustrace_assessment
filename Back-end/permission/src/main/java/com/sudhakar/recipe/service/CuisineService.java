package com.sudhakar.recipe.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.entity.Cuisine;
import com.sudhakar.recipe.entity.Recipe;

public interface CuisineService {

    ResponseEntity<Cuisine> createCuisine(String cuisine);

    ResponseEntity<List<String>> getAllCuisines();

    ResponseEntity<List<Recipe>> getAllRecipeByCuisineName(String cuisineName, Pageable page);
}
