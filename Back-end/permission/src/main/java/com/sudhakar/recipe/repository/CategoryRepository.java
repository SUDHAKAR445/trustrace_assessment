package com.sudhakar.recipe.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Category;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String>{

    Optional<Category> findByName(String categoryName);

    @Query("{'$or': [{'name': {$regex: ?0, $options: 'i'}}]}")
    Page<Category> searchCategories(String searchText, Pageable page);

}
