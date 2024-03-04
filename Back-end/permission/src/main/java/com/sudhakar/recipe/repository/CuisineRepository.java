package com.sudhakar.recipe.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Cuisine;

@Repository
public interface CuisineRepository extends MongoRepository<Cuisine, String>{

    Optional<Cuisine> findByName(String cuisine);

    @Query("{'$or': [{'name': {$regex: ?0, $options: 'i'}}]}")
    Page<Cuisine> searchCuisines(String searchText, Pageable pageable);
}
