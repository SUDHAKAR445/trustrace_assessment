package com.sudhakar.recipe.service.implementation;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.entity.Ingredient;
import com.sudhakar.recipe.repository.IngredientRepository;
import com.sudhakar.recipe.service.IngredientService;

@Service
public class IngredientServiceImplementation implements IngredientService{

    @Autowired
    private IngredientRepository ingredientRepository;
    
    @Override
    public Set<Ingredient> createIngredients(Set<Ingredient> ingredients) {
        
        if(ingredients != null) {
            return new HashSet<>(ingredientRepository.saveAll(ingredients));
        }
        return null;
    }


    public void deleteIngredients(Set<Ingredient> ingredients) {
        if(ingredients != null) {
            ingredientRepository.deleteAll(ingredients);
        }
    }
}
