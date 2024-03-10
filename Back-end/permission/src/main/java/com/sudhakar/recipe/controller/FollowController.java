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
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.service.FollowService;

@RestController
@RequestMapping("/api/follow")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/{followerUserId}/{followingUserId}")
    public ResponseEntity<Void> followRequest(@PathVariable String followerUserId, @PathVariable String followingUserId) {
        return followService.followRequest(followerUserId, followingUserId);
    }

    @DeleteMapping("/{followerUserId}/{followingUserId}")
    public ResponseEntity<Void> unFollowRequest(@PathVariable String followerUserId, @PathVariable String followingUserId) {
        return followService.unFollowRequest(followerUserId, followingUserId);
    }

    @PreAuthorize("hasRole('ADMIN')or hasRole('MODERATOR') or hasRole('USER')")
    @GetMapping("/following/{userId}")
    public ResponseEntity<List<User>> getAllFollowingByUser(@PathVariable String userId) {
        return followService.getAllFollowingByUser(userId);
    }

    @PreAuthorize("hasRole('ADMIN')or hasRole('MODERATOR') or hasRole('USER')")
    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<User>> getAllFollowersByUser(@PathVariable String userId) {
        return followService.getAllFollowersByUser(userId);
    }
}
