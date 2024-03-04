package com.sudhakar.recipe.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.User;

@Repository
public interface UserRepository extends MongoRepository<User, String>{

    Optional<User> findByUsernameValueOrEmail(String username, String email);

    boolean existsByUsernameValueOrEmail(String username, String email);

    Optional<User> findByUsernameValue(String username);

    List<User> findByDeletedAtIsNotNull();

    List<User> findByDeletedAtIsNull();

}
