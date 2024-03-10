package com.sudhakar.recipe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.service.ForgotPasswordService;

@RestController
@RequestMapping("/api/forgot-password")
@CrossOrigin(origins = "http://localhost:4200")
public class ForgotPasswordController {

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @PostMapping("/verify/{email}")
    public ResponseEntity<Void> verifyEmail(@PathVariable String email) {
        return forgotPasswordService.verifyEmail(email);
    }

    @GetMapping("/verify-otp/{otp}/{email}")
    public ResponseEntity<Void> verifyOtp(@PathVariable int otp, @PathVariable String email) {
        return forgotPasswordService.verifyOtp(otp, email);
    }

    @PutMapping("/change-password/{email}")
    public ResponseEntity<Void> changePassword(@PathVariable String email, @RequestBody String password) {
        return forgotPasswordService.changePassword(email, password);
    }
}
