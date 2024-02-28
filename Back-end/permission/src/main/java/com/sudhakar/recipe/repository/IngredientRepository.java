package com.sudhakar.recipe.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Ingredient;

@Repository
public interface IngredientRepository extends MongoRepository<Ingredient, String>{

}
