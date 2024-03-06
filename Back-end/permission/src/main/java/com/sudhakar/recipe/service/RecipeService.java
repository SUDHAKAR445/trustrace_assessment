package com.sudhakar.recipe.service;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.sudhakar.recipe.dto.RecipeDto;
import com.sudhakar.recipe.dto.RecipeIdDTO;
import com.sudhakar.recipe.dto.RecipeRequestDto;
import com.sudhakar.recipe.entity.Comment;
import com.sudhakar.recipe.entity.Recipe;

public interface RecipeService {

    ResponseEntity<RecipeIdDTO> createRecipe(String id, RecipeRequestDto createRecipe);

    ResponseEntity<Void> updateRecipeImage(String id, MultipartFile imageFile);

    ResponseEntity<Page<RecipeDto>> getAllRecipesOrderByCreationDate(Pageable pageable);

    ResponseEntity<String> updateRecipe(String id, String recipeId, RecipeRequestDto UpdateRecipe);

    ResponseEntity<String> deleteRecipe(String recipeId);

    ResponseEntity<Page<RecipeDto>> getAllRecipeByUserId(String id, Pageable pageable);

    ResponseEntity<String> commentRecipe(String recipeId, String userId, Comment comment);

    ResponseEntity<String> saveRecipeForUser(String userId, String recipeId);

    ResponseEntity<String> updateRecipeLike(String recipeId, String userId, boolean like);

    ResponseEntity<List<Recipe>> getAllRecipeByTitle(String title, Pageable pageable);

    ResponseEntity<Recipe> getRecipeById(String id);

}
