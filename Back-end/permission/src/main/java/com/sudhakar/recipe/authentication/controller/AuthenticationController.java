package com.sudhakar.recipe.authentication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.authentication.dto.AuthenticationRequest;
import com.sudhakar.recipe.authentication.dto.AuthenticationResponse;
import com.sudhakar.recipe.authentication.dto.RegisterRequest;
import com.sudhakar.recipe.authentication.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<Void> register(
            @RequestBody RegisterRequest request) {
        return service.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        return service.authenticate(request);
    }

    @PostMapping("/confirm-account")
    public ResponseEntity<Void> confirmationUserAccount(@RequestBody String token) {
        return service.confirmUserAccount(token);
    }
}
