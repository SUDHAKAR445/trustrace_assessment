package com.sudhakar.recipe.dto;

import java.util.HashSet;
import java.util.Set;

import com.sudhakar.recipe.entity.Ingredient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeRequestDto {

    private String title;
    private String description;
    private String cuisine;
    private String category;
    private String instructions;
    private int cookingTime;
    private int preparationTime;
    private int servings;
    private String video;
    private Set<Ingredient> ingredients = new HashSet<>();

    public Set<Ingredient> getIngredients() {
        return ingredients;
    }

    public void setIngredients(Set<Ingredient> ingredients) {
        this.ingredients = ingredients;
    }
}
