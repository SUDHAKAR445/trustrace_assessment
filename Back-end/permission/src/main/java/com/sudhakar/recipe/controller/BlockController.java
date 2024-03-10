package com.sudhakar.recipe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
public class BlockController {

    @Autowired
    private BlockService blockService;

    @PostMapping("/{blockerUserId}/{blockedUserId}")
    public ResponseEntity<Void> blockUser(@PathVariable String blockerUserId, @PathVariable String blockedUserId) {
        return blockService.blockUser(blockerUserId, blockedUserId);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<User>> getAllBlockedUserByUser(@PathVariable String userId) {
        return blockService.getAllBlockedUserByUser(userId);
    }

    @DeleteMapping("/{blockerUserId}/{blockedUserId}")
    public ResponseEntity<Void> unblockUser(@RequestParam String blockingUserId, @RequestParam String blockedUserId) {
        return blockService.unblockUser(blockingUserId, blockedUserId);
    }
}
