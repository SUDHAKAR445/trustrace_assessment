package com.sudhakar.recipe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.entity.PaymentRequest;
import com.sudhakar.recipe.entity.Booking;
import com.sudhakar.recipe.service.RazorpayService;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {

    @Autowired
    private RazorpayService razorpayService;

    @PostMapping("/charge")
    public ResponseEntity<Booking> charge(@RequestBody PaymentRequest paymentRequest) {
        return razorpayService.createOrder(paymentRequest.getAmount());
    }
}
