package com.sudhakar.recipe.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Follow;
import com.sudhakar.recipe.entity.User;

@Repository
public interface FollowRepository extends MongoRepository<Follow, String> {

    Optional<Follow> findByFollowerUserAndFollowingUser(User user, User user2);

    List<Follow> findByFollowingUser(User user);

    List<Follow> findByFollowerUser(User user);

}
