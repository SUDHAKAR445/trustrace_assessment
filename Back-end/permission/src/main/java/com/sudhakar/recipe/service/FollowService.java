package com.sudhakar.recipe.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.entity.User;

public interface FollowService {

    ResponseEntity<Void> followRequest(String followerUser, String followingUser);

    ResponseEntity<Void> unFollowRequest(String followerUser, String followingUser);

    ResponseEntity<List<User>> getAllFollowingByUser(String userId);

    ResponseEntity<List<User>> getAllFollowersByUser(String userId);
}
