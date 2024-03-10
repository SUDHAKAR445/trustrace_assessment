package com.sudhakar.recipe.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.entity.User;

public interface BlockService {

    ResponseEntity<Void> blockUser(String blockingUserId, String blockedUserId);

    ResponseEntity<List<User>> getAllBlockedUserByUser(String userId);

    ResponseEntity<Void> unblockUser(String blockingUserId, String blockedUserId);
}
