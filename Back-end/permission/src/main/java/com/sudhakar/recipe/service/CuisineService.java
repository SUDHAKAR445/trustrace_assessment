package com.sudhakar.recipe.service;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.dto.CuisineDto;
import com.sudhakar.recipe.dto.ExploreDto;
import com.sudhakar.recipe.dto.RecipeDto;
import com.sudhakar.recipe.entity.Cuisine;

public interface CuisineService {

    ResponseEntity<Cuisine> createCuisine(String cuisine);

    ResponseEntity<Page<CuisineDto>> getAllCuisines(Pageable page);

    ResponseEntity<Page<RecipeDto>> getAllRecipeByCuisineId(String id, Pageable page);

    ResponseEntity<CuisineDto> getCuisineDetail(String id);

    ResponseEntity<Page<CuisineDto>> getCuisinesBySearch(String searchText, Pageable page);

    ResponseEntity<Set<ExploreDto>> exploreByCuisine();
}
