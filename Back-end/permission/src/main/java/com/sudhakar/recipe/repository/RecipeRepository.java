package com.sudhakar.recipe.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Category;
import com.sudhakar.recipe.entity.Cuisine;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.entity.User;

@Repository
public interface RecipeRepository extends MongoRepository<Recipe, String> {
    
    @Query("{'date_created': {$exists: true}}")
    Page<Recipe> findAllByOrderByDateCreatedDesc(Pageable pageable);
    
    Page<Recipe> findByCuisineOrderByDateCreatedDesc(Cuisine cuisine, PageRequest of);

    Page<Recipe> findByCategoryOrderByDateCreatedDesc(Category category, PageRequest of);

    Page<Recipe> findByUser(User user, Pageable sortedPageable);

    Page<Recipe> findByTitleContainingIgnoreCaseOrderByDateCreatedDesc(String title, Pageable pageable);

}
