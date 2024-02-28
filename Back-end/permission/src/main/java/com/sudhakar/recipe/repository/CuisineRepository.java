package com.sudhakar.recipe.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Cuisine;

@Repository
public interface CuisineRepository extends MongoRepository<Cuisine, String>{

    Optional<Cuisine> findByName(String cuisine);

}
