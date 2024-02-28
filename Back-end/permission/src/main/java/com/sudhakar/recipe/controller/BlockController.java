package com.sudhakar.recipe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.service.BlockService;

@RestController
@RequestMapping("/api/block")
public class BlockController {

    @Autowired
    private BlockService blockService;

    @PostMapping("/block-user")
    public ResponseEntity<String> blockUser(@RequestParam String blockingUserId, @RequestParam String blockedUserId) {
        return blockService.blockUser(blockingUserId, blockedUserId);
    }

    @GetMapping("/blocked-users/{userId}")
    public ResponseEntity<List<User>> getAllBlockedUserByUser(@PathVariable String userId) {
        return blockService.getAllBlockedUserByUser(userId);
    }

    @DeleteMapping("/unblock-user")
    public ResponseEntity<String> unblockUser(@RequestParam String blockingUserId, @RequestParam String blockedUserId) {
        return blockService.unblockUser(blockingUserId, blockedUserId);
    }
}
