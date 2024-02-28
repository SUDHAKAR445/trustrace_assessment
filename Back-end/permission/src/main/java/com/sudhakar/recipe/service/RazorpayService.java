package com.sudhakar.recipe.service;

import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.entity.Booking;

public interface RazorpayService {

    ResponseEntity<Booking> createOrder(int amount);
}
