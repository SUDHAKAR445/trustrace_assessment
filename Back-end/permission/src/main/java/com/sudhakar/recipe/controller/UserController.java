package com.sudhakar.recipe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.service.UserService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User createUserRequest) {
        return userService.createUser(createUserRequest);
    }

    @DeleteMapping("{usernameOrEmail}")
    public ResponseEntity<Void> deleteUser(@PathVariable String usernameOrEmail) {
        return userService.deleteUser(usernameOrEmail);
    }

    @PutMapping("{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @ModelAttribute User userRequest,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        return userService.updateUser(id, userRequest, imageFile);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(@RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.getAllUsers(pageable);
    }

    @GetMapping("{id}")
    public ResponseEntity<User> getProfile(@PathVariable String id) {
        return userService.getProfile(id);
    }
}
