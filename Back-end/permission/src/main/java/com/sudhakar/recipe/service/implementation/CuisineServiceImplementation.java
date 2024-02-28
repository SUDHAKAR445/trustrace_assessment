package com.sudhakar.recipe.service.implementation;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.entity.Cuisine;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.repository.CuisineRepository;
import com.sudhakar.recipe.repository.RecipeRepository;
import com.sudhakar.recipe.service.CuisineService;

@Service
public class CuisineServiceImplementation implements CuisineService {

    @Autowired
    private CuisineRepository cuisineRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Override
    public ResponseEntity<Cuisine> createCuisine(String cuisine) {
        try {
            Optional<Cuisine> existingCuisine = cuisineRepository.findByName(cuisine);
            if (existingCuisine.isPresent()) {
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            } else {
                Cuisine createCuisine = new Cuisine(cuisine);
                createCuisine = cuisineRepository.save(createCuisine);
                return new ResponseEntity<>(createCuisine, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<String>> getAllCuisines() {
        try {
            List<Cuisine> cuisines = cuisineRepository.findAll();
            List<String> cuisineList = cuisines.stream()
                    .map(Cuisine::getName)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(cuisineList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<Recipe>> getAllRecipeByCuisineName(String cuisineName, Pageable page) {
        try {
            Optional<Cuisine> cuisine = cuisineRepository.findByName(cuisineName);
            if (cuisine.isPresent()) {

                Page<Recipe> recipes = recipeRepository.findByCuisineOrderByDateCreatedDesc(cuisine.get(),
                        PageRequest.of(page.getPageNumber(), page.getPageSize()));
                List<Recipe> recipeList = recipes.getContent();
                if (!recipeList.isEmpty()) {
                    return new ResponseEntity<>(recipeList, HttpStatus.OK);
                }
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
