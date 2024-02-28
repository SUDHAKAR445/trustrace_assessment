package com.sudhakar.recipe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sudhakar.recipe.entity.Comment;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.service.RecipeService;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @PostMapping("/create/{id}")
    public ResponseEntity<String> createRecipe(@PathVariable String id, @RequestBody Recipe createRecipe,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        return recipeService.createRecipe(id, createRecipe, imageFile);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Recipe>> getAllRecipesOrderByCreationDate(@RequestParam int page,
            @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return recipeService.getAllRecipesOrderByCreationDate(pageable);
    }

    @PutMapping("/update/{id}/{recipeId}")
    public ResponseEntity<String> updateRecipe(@PathVariable String id, @PathVariable String recipeId, @RequestBody Recipe updateRecipe) {
        return recipeService.updateRecipe(id, recipeId, updateRecipe);
    }

    @DeleteMapping("/delete/{recipeId}")
    public ResponseEntity<String> deleteRecipe(@PathVariable String recipeId) {
        return recipeService.deleteRecipe(recipeId);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Recipe>> getAllRecipeByUsername(
            @PathVariable String username,
            @RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return recipeService.getAllRecipeByUsername(username, pageable);
    }

    @PostMapping("/comment/{recipeId}/{userId}")
    public ResponseEntity<String> commentRecipe(
            @PathVariable String recipeId,
            @PathVariable String userId,
            @RequestBody Comment comment) {
        return recipeService.commentRecipe(recipeId, userId, comment);
    }

    @PutMapping("/like/{recipeId}")
    public ResponseEntity<String> likeRecipe(@PathVariable String recipeId,
            @RequestParam String userId) {
        return recipeService.updateRecipeLike(recipeId, userId, true);
    }

    @PutMapping("/unlike/{recipeId}")
    public ResponseEntity<String> unlikeRecipe(@PathVariable String recipeId,
            @RequestParam String userId) {
        return recipeService.updateRecipeLike(recipeId, userId, false);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Recipe>> getAllRecipeByTitle(
            @RequestParam(required = false) String title,
            @RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return recipeService.getAllRecipeByTitle(title, pageable);
    }

    @PostMapping("/save/{userId}/{recipeId}")
    public ResponseEntity<String> saveRecipeInCollection(@PathVariable String userId, @PathVariable String recipeId) {
        return recipeService.saveRecipeForUser(userId, recipeId);
    }
}
