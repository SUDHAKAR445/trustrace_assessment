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
import com.sudhakar.recipe.service.FollowService;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/follow")
    public ResponseEntity<String> followRequest(@RequestParam String followerUserId, @RequestParam String followingUserId) {
        return followService.followRequest(followerUserId, followingUserId);
    }

    @DeleteMapping("/unfollow")
    public ResponseEntity<String> unFollowRequest(@RequestParam String followerUserId, @RequestParam String followingUserId) {
        return followService.unFollowRequest(followerUserId, followingUserId);
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<List<User>> getAllFollowingByUser(@PathVariable String userId) {
        return followService.getAllFollowingByUser(userId);
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<User>> getAllFollowersByUser(@PathVariable String userId) {
        return followService.getAllFollowersByUser(userId);
    }
}
