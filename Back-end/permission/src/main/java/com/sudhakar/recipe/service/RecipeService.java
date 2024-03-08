package com.sudhakar.recipe.service;

import java.util.Date;
import java.util.List;
import java.util.Set;

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

    ResponseEntity<Void> updateRecipe(String id, RecipeRequestDto UpdateRecipe);

    ResponseEntity<Void> deleteRecipe(String recipeId);

    ResponseEntity<Page<RecipeDto>> getAllRecipeByUserId(String id, Pageable pageable);

    ResponseEntity<Comment> commentRecipe(String recipeId, String userId, Comment comment);

    ResponseEntity<Void> saveRecipeForUser(String userId, String recipeId);

    ResponseEntity<Void> removeRecipeForUser(String userId, String recipeId);

    ResponseEntity<Void> updateRecipeLike(String recipeId, String userId, boolean like);

    ResponseEntity<List<Recipe>> getAllRecipeByTitle(String title, Pageable pageable);

    ResponseEntity<Recipe> getRecipeById(String id);

    ResponseEntity<List<RecipeDto>> getAllSavedRecipes(String userId);

    ResponseEntity<Set<String>> getAllLikedRecipes(String userId);
}
