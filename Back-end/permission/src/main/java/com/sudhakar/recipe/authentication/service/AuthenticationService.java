package com.sudhakar.recipe.authentication.service;

import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.authentication.dto.AuthenticationRequest;
import com.sudhakar.recipe.authentication.dto.AuthenticationResponse;
import com.sudhakar.recipe.authentication.dto.RegisterRequest;

public interface AuthenticationService {
    
    ResponseEntity<Void> register(RegisterRequest request);

    ResponseEntity<AuthenticationResponse> authenticate(AuthenticationRequest request);

    ResponseEntity<Void> confirmUserAccount(String confirmationToken);
}
