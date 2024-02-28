package com.sudhakar.recipe.service.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.entity.Category;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.repository.CategoryRepository;
import com.sudhakar.recipe.repository.RecipeRepository;
import com.sudhakar.recipe.service.CategoryService;

@Service
public class CategoryServiceImplementation implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Override
    public ResponseEntity<Category> createCategory(String categoryName) {
        try {
            Optional<Category> existingCategory = categoryRepository.findByName(categoryName);
            if (existingCategory.isPresent()) {
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            } else {
                Category createCategory = new Category(categoryName);
                createCategory = categoryRepository.save(createCategory);
                return new ResponseEntity<>(createCategory, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<String>> getAllCategories() {
        try {
            List<Category> categories = categoryRepository.findAll();
            List<String> categoryList = new ArrayList<>();
            for (Category category : categories) {
                categoryList.add(category.getName());
            }
            return new ResponseEntity<>(categoryList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<Recipe>> getAllRecipeByCategoryName(String categoryName, Pageable page) {
        try {
            Optional<Category> category = categoryRepository.findByName(categoryName);
            if (category.isPresent()) {

                Page<Recipe> recipes = recipeRepository.findByCategoryOrderByDateCreatedDesc(category.get(),
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
