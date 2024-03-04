package com.sudhakar.recipe.filters;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.dto.UserResponseDto;

public interface UserFilterDao {

    ResponseEntity<Page<UserResponseDto>> searchUsersWithCriteria(String searchString, String selectedRole, String selectedGender, Pageable pageable);

}
