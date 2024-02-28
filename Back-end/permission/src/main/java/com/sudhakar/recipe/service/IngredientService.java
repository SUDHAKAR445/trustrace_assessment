package com.sudhakar.recipe.service;

import java.util.Set;

import com.sudhakar.recipe.entity.Ingredient;

public interface IngredientService {

    Set<Ingredient> createIngredients(Set<Ingredient> ingredients);

    void deleteIngredients(Set<Ingredient> ingredients);
}
