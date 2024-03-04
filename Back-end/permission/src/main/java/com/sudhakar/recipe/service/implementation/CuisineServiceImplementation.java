package com.sudhakar.recipe.service.implementation;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.swing.text.html.Option;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.dto.CuisineDto;
import com.sudhakar.recipe.dto.RecipeDto;
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

    public ResponseEntity<Page<CuisineDto>> getAllCuisines(Pageable page) {
        try {
            Page<Cuisine> cuisines = cuisineRepository.findAll(page);

            Page<CuisineDto> cuisineDtoPage = cuisines.map(cuisine -> {
                CuisineDto cuisineDto = new CuisineDto();
                cuisineDto.setId(cuisine.getId());
                cuisineDto.setName(cuisine.getName());
                cuisineDto.setCount(recipeRepository.findByCuisine(cuisine).size());
                return cuisineDto;
            });

            return new ResponseEntity<>(cuisineDtoPage, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Page<RecipeDto>> getAllRecipeByCuisineId(String id, Pageable page) {
        try {
            Optional<Cuisine> cuisine = cuisineRepository.findById(id);
            if (cuisine.isPresent()) {

                Page<Recipe> recipes = recipeRepository.findByCuisineOrderByDateCreatedDesc(cuisine.get(),
                        PageRequest.of(page.getPageNumber(), page.getPageSize()));

                return new ResponseEntity<>(recipes.map(this::convertDto), HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<CuisineDto> getCuisineDetail(String id) {
        try {
            Optional<Cuisine> cuisine = cuisineRepository.findById(id);
            if (cuisine.isPresent()) {
                Cuisine cuisineDetail = cuisine.get();
                CuisineDto cuisineDto = new CuisineDto();
                cuisineDto.setId(cuisineDetail.getId());
                cuisineDto.setName(cuisineDetail.getName());
                cuisineDto.setCount(recipeRepository.findByCuisine(cuisineDetail).size());

                return new ResponseEntity<>(cuisineDto, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Page<CuisineDto>> getCuisinesBySearch(String searchText, Pageable page) {
        try {
            Page<Cuisine> cuisines = cuisineRepository.searchCuisines(searchText, page);

            return new ResponseEntity<>(cuisines.map(this::convertToCuisineDto), HttpStatus.OK);
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

    private CuisineDto convertToCuisineDto(Cuisine cuisineDetail) {
        CuisineDto cuisineDto = new CuisineDto();
        cuisineDto.setId(cuisineDetail.getId());
        cuisineDto.setName(cuisineDetail.getName());
        cuisineDto.setCount(recipeRepository.findByCuisine(cuisineDetail).size());
        return cuisineDto;
    }
}
