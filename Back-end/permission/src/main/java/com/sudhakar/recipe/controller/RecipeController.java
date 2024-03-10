package com.sudhakar.recipe.controller;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
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

import com.sudhakar.recipe.dto.RecipeDto;
import com.sudhakar.recipe.dto.RecipeIdDTO;
import com.sudhakar.recipe.dto.RecipeRequestDto;
import com.sudhakar.recipe.entity.Comment;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.filters.RecipeFilterDao;
import com.sudhakar.recipe.service.RecipeService;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR') or hasRole('USER')")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private RecipeFilterDao recipeFilterDao;

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/create/{id}")
    public ResponseEntity<RecipeIdDTO> createRecipe(@PathVariable String id, @RequestBody RecipeRequestDto createRecipe) {

        System.out.println(createRecipe);
        return recipeService.createRecipe(id, createRecipe);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/update/image/{id}")
    public ResponseEntity<Void> updateRecipeImage(@PathVariable String id, @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        return recipeService.updateRecipeImage(id, imageFile);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping()
    public ResponseEntity<Page<RecipeDto>> getAllRecipesOrderByCreationDate(@RequestParam int page,
            @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return recipeService.getAllRecipesOrderByCreationDate(pageable);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateRecipe(@PathVariable String id,
            @RequestBody RecipeRequestDto updateRecipe) {
        return recipeService.updateRecipe(id, updateRecipe);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @DeleteMapping("/{recipeId}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable String recipeId) {
        return recipeService.deleteRecipe(recipeId);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/user/{id}")
    public ResponseEntity<Page<RecipeDto>> getAllRecipeByUserId(
            @PathVariable String id,
            @RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return recipeService.getAllRecipeByUserId(id, pageable);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/comment/{recipeId}/{userId}")
    public ResponseEntity<Comment> commentRecipe(
            @PathVariable String recipeId,
            @PathVariable String userId,
            @RequestBody Comment comment) {
        return recipeService.commentRecipe(recipeId, userId, comment);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/like/{recipeId}/{userId}")
    public ResponseEntity<Void> likeRecipe(@PathVariable String recipeId,
            @PathVariable String userId) {
        return recipeService.updateRecipeLike(recipeId, userId, true);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/unlike/{recipeId}/{userId}")
    public ResponseEntity<Void> unlikeRecipe(@PathVariable String recipeId,
            @PathVariable String userId) {
        return recipeService.updateRecipeLike(recipeId, userId, false);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/save/{userId}/{recipeId}")
    public ResponseEntity<Void> saveRecipeInCollection(@PathVariable String userId, @PathVariable String recipeId) {
        return recipeService.saveRecipeForUser(userId, recipeId);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/remove/{userId}/{recipeId}")
    public ResponseEntity<Void> removeRecipeInCollection(@PathVariable String userId, @PathVariable String recipeId) {
        return recipeService.removeRecipeForUser(userId, recipeId);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR') or hasRole('USER')")
    @GetMapping("{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable String id) {
        return recipeService.getRecipeById(id);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/search")
    public ResponseEntity<Page<RecipeDto>> searchRecipes(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String cuisineName,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) Date startDate,
            @RequestParam(required = false) Date endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

                System.out.println(searchText);
        Pageable pageable = PageRequest.of(page, size);
        return recipeFilterDao.searchRecipeWithCriteria(searchText, cuisineName, categoryName,
                startDate, endDate, pageable);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/saved/{id}")
    public ResponseEntity<List<RecipeDto>> savedRecipes(@PathVariable String id) {
        return recipeService.getAllSavedRecipes(id);
    }

    @PreAuthorize("hasRole('ADMIN')or hasRole('MODERATOR') or hasRole('USER')")
    @GetMapping("/user-liked/{userId}")
    public ResponseEntity<Set<String>> getAllLikedRecipes(@PathVariable String userId) {
        return recipeService.getAllLikedRecipes(userId);
    }

    @PreAuthorize("hasRole('ADMIN')or hasRole('MODERATOR') or hasRole('USER')")
    @GetMapping("/post-count/{userId}")
    public ResponseEntity<List<Integer>> getCountOfRecipes(@PathVariable String userId) {
        return recipeService.getTotalRecipeCount(userId);
    }
}
