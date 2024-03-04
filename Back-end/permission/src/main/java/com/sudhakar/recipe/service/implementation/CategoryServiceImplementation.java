package com.sudhakar.recipe.service.implementation;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.dto.CategoryDto;
import com.sudhakar.recipe.dto.RecipeDto;
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
    public ResponseEntity<Page<CategoryDto>> getAllCategories(Pageable pageable) {
        try {
            Page<Category> categories = categoryRepository.findAll(pageable);
            Page<CategoryDto> categoryDtoPage = categories.map(category -> {
                CategoryDto categoryDto = new CategoryDto();
                categoryDto.setId(category.getId());
                categoryDto.setName(category.getName());
                categoryDto.setCount(recipeRepository.findByCategory(category).size());
                return categoryDto;
            });

            return new ResponseEntity<>(categoryDtoPage, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Page<RecipeDto>> getAllRecipeByCategoryId(String id, Pageable page) {
        try {
            Optional<Category> category = categoryRepository.findById(id);
            if (category.isPresent()) {

                Page<Recipe> recipes = recipeRepository.findByCategoryOrderByDateCreatedDesc(category.get(),
                        PageRequest.of(page.getPageNumber(), page.getPageSize()));
                return new ResponseEntity<>(recipes.map(this::convertDto), HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<CategoryDto> getCategoryDetail(String id) {
        try {
            Optional<Category> category = categoryRepository.findById(id);
            if (category.isPresent()) {
                Category categoryDetail = category.get();
                CategoryDto categoryDto = new CategoryDto();
                categoryDto.setId(categoryDetail.getId());
                categoryDto.setName(categoryDetail.getName());
                categoryDto.setCount(recipeRepository.findByCategory(categoryDetail).size());

                return new ResponseEntity<>(categoryDto, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Page<CategoryDto>> getCategoriesBySearch(String searchText, Pageable page) {
        try {
            Page<Category> categories = categoryRepository.searchCategories(searchText, page);

            return new ResponseEntity<>(categories.map(this::convertToCategoryDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private RecipeDto convertDto(Recipe recipe) {
        RecipeDto recipeDto = new RecipeDto();
        recipeDto.setRecipeId(recipe.getId());
        recipeDto.setTitle(recipe.getTitle());
        recipeDto.setDateCreated(recipe.getDateCreated());
        recipeDto.setCategory(recipe.getCategory().getName());
        recipeDto.setCuisine(recipe.getCuisine().getName());
        recipeDto.setUserId(recipe.getUser().getId());
        recipeDto.setUsername(recipe.getUser().getUsernameValue());
        recipeDto.setProfileImageUrl(recipe.getUser().getProfileImageUrl());

        return recipeDto;
    }

    private CategoryDto convertToCategoryDto(Category categoryDetail) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(categoryDetail.getId());
        categoryDto.setName(categoryDetail.getName());
        categoryDto.setCount(recipeRepository.findByCategory(categoryDetail).size());
        return categoryDto;
    }
}
