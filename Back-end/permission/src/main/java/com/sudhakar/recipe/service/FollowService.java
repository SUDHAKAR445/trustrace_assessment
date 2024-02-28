package com.sudhakar.recipe.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.entity.User;

public interface FollowService {

    ResponseEntity<String> followRequest(String followerUser, String followingUser);

    ResponseEntity<String> unFollowRequest(String followerUser, String followingUser);

    ResponseEntity<List<User>> getAllFollowingByUser(String userId);

    ResponseEntity<List<User>> getAllFollowersByUser(String userId);
}
