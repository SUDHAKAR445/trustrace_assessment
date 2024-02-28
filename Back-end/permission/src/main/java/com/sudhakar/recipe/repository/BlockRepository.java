package com.sudhakar.recipe.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Block;
import com.sudhakar.recipe.entity.User;

@Repository
public interface BlockRepository extends MongoRepository<Block, String>{

    Optional<Block> findByBlockingUserAndBlockedUser(User user, User user2);

    List<Block> findByBlockingUser(User user);

}
