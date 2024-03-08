package com.sudhakar.recipe.service;

import org.springframework.http.ResponseEntity;

public interface ForgotPasswordService {

    ResponseEntity<Void> verifyEmail(String email);

    ResponseEntity<Void> verifyOtp(int otp, String email);

    ResponseEntity<Void> changePassword(String email, String password);
}
