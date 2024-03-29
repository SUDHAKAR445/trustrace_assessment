package com.sudhakar.recipe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sudhakar.recipe.dto.UserResponseDto;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.filters.UserFilterDao;
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

    @Autowired
    private UserFilterDao userFilterDao;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(@RequestBody User createUserRequest) {
        return userService.createUser(createUserRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        return userService.deleteUser(id);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR') or hasRole('USER')")
    @PutMapping("{id}")
    public ResponseEntity<UserResponseDto> updateUser(@PathVariable String id,
            @ModelAttribute UserResponseDto userRequest,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        return userService.updateUser(id, userRequest, imageFile);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<UserResponseDto>> getAllUsers(@RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.getAllUsers(pageable);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR') or hasRole('USER')")
    @GetMapping("{id}")
    public ResponseEntity<UserResponseDto> getProfile(@PathVariable String id) {
        return userService.getProfile(id);
    }

    // @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR') or hasRole('USER')")
    @GetMapping("/check/username/{username}")
    public ResponseEntity<Boolean> checkUsername(@PathVariable String username) {
        return userService.checkUsername(username);
    }

    // @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR') or hasRole('USER')")
    @GetMapping("/check/email/{email}")
    public ResponseEntity<Boolean> checkEmail(@PathVariable String email) {
        return userService.checkEmail(email);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<Page<UserResponseDto>> search(@RequestParam String searchText,
            @RequestParam String selectedRole,
            @RequestParam String selectedGender,
            @RequestParam int page,
            @RequestParam int size) {
        return userFilterDao.searchUsersWithCriteria(searchText, selectedRole, selectedGender, PageRequest.of(page, size));
    }
}

// inputValue, selectedRole, selectedGender, pageIndex, pageSize