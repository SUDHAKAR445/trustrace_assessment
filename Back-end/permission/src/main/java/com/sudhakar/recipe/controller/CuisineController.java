package com.sudhakar.recipe.controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.dto.CuisineDto;
import com.sudhakar.recipe.dto.ExploreDto;
import com.sudhakar.recipe.dto.RecipeDto;
import com.sudhakar.recipe.entity.Cuisine;
import com.sudhakar.recipe.service.CuisineService;

@RestController
@RequestMapping("/api/cuisine")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
public class CuisineController {

    @Autowired
    private CuisineService cuisineService;

    @PostMapping()
    public ResponseEntity<Cuisine> createCuisine(@RequestBody String cuisineName) {
        return cuisineService.createCuisine(cuisineName);
    }

    @GetMapping()
    public ResponseEntity<Page<CuisineDto>> getAllCuisines(@RequestParam int page, @RequestParam int size) {
        return cuisineService.getAllCuisines( PageRequest.of(page, size));
    }

    @GetMapping("/getRecipes/{id}")
    public ResponseEntity<Page<RecipeDto>> getAllRecipeByCuisineId(
            @PathVariable String id,
            @RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return cuisineService.getAllRecipeByCuisineId(id, pageable);
    }

    @GetMapping("{id}")
    public ResponseEntity<CuisineDto> getCuisineDetail(@PathVariable String id) {
        return cuisineService.getCuisineDetail(id);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<CuisineDto>> search(@RequestParam String searchText, @RequestParam int page, @RequestParam int size) {
        return cuisineService.getCuisinesBySearch(searchText, PageRequest.of(page, size));
    }

    @GetMapping("/explore")
    public ResponseEntity<Set<ExploreDto>> exploreCuisine() {
        return cuisineService.exploreByCuisine();
    }
}
