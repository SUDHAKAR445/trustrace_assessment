package com.sudhakar.recipe.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Category;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String>{

    Optional<Category> findByName(String categoryName);

}
