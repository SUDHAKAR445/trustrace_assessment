package com.sudhakar.recipe.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.sudhakar.recipe.entity.Comment;
import com.sudhakar.recipe.entity.Recipe;

public interface RecipeService {

    ResponseEntity<String> createRecipe(String id, Recipe createRecipe, MultipartFile imageFile);

    ResponseEntity<List<Recipe>> getAllRecipesOrderByCreationDate(Pageable pageable);

    ResponseEntity<String> updateRecipe(String id, String recipeId, Recipe UpdateRecipe);

    ResponseEntity<String> deleteRecipe(String recipeId);

    ResponseEntity<List<Recipe>> getAllRecipeByUsername(String username, Pageable pageable);

    ResponseEntity<String> commentRecipe(String recipeId, String userId, Comment comment);

    ResponseEntity<String> saveRecipeForUser(String userId, String recipeId);

    ResponseEntity<String> updateRecipeLike(String recipeId, String userId, boolean like);

    ResponseEntity<List<Recipe>> getAllRecipeByTitle(String title, Pageable pageable);
}
