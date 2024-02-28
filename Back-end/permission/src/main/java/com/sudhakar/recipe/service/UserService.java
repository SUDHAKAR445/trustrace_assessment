package com.sudhakar.recipe.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.sudhakar.recipe.entity.User;

public interface UserService {

    ResponseEntity<User> createUser(User createUserRequest);

    ResponseEntity<Void> deleteUser(String id);

    ResponseEntity<User> updateUser(String id, User updateRequest, MultipartFile imageFile);

    ResponseEntity<List<User>> getAllUsers(Pageable pageable);

    ResponseEntity<User> getProfile( String id);
}