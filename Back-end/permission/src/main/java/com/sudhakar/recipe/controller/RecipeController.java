package com.sudhakar.recipe.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
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
import com.sudhakar.recipe.entity.Comment;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.filters.RecipeFilterDao;
import com.sudhakar.recipe.service.RecipeService;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:4200")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private RecipeFilterDao recipeFilterDao;

    @PostMapping("/create/{id}")
    public ResponseEntity<String> createRecipe(@PathVariable String id, @RequestBody Recipe createRecipe,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        return recipeService.createRecipe(id, createRecipe, imageFile);
    }

    @GetMapping()
    public ResponseEntity<Page<RecipeDto>> getAllRecipesOrderByCreationDate(@RequestParam int page,
            @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return recipeService.getAllRecipesOrderByCreationDate(pageable);
    }

    @PutMapping("/update/{id}/{recipeId}")
    public ResponseEntity<String> updateRecipe(@PathVariable String id, @PathVariable String recipeId,
            @RequestBody Recipe updateRecipe) {
        return recipeService.updateRecipe(id, recipeId, updateRecipe);
    }

    @DeleteMapping("/{recipeId}")
    public ResponseEntity<String> deleteRecipe(@PathVariable String recipeId) {
        return recipeService.deleteRecipe(recipeId);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Page<RecipeDto>> getAllRecipeByUserId(
            @PathVariable String id,
            @RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return recipeService.getAllRecipeByUserId(id, pageable);
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

    @PostMapping("/save/{userId}/{recipeId}")
    public ResponseEntity<String> saveRecipeInCollection(@PathVariable String userId, @PathVariable String recipeId) {
        return recipeService.saveRecipeForUser(userId, recipeId);
    }

    @GetMapping("{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable String id) {
        return recipeService.getRecipeById(id);
    }

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
}
