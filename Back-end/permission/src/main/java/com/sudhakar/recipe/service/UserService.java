package com.sudhakar.recipe.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.sudhakar.recipe.dto.UserResponseDto;
import com.sudhakar.recipe.entity.User;

public interface UserService {

    ResponseEntity<UserResponseDto> createUser(User createUserRequest);

    ResponseEntity<Void> deleteUser(String id);

    ResponseEntity<UserResponseDto> updateUser(String id, UserResponseDto updateRequest, MultipartFile imageFile);

    ResponseEntity<Page<UserResponseDto>> getAllUsers(Pageable pageable);

    ResponseEntity<UserResponseDto> getProfile( String id);

    ResponseEntity<Boolean> checkUsernameOrEmail(String usernameOrEmail);

    UserResponseDto convertToUserDto(User user);
}