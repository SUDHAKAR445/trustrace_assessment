package com.sudhakar.recipe.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.ConfirmationToken;

@Repository
public interface ConfirmationTokenRepository extends MongoRepository<ConfirmationToken, String>{

    Optional<ConfirmationToken> findByConfirmationToken(String confirmationToken);
}
