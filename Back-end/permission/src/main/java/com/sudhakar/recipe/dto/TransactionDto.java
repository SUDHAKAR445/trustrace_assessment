package com.sudhakar.recipe.dto;


import java.util.Date;

import com.sudhakar.recipe.entity.Booking.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class TransactionDto {
    private String id;
    private String orderId;
    private String paymentId;
    private double amount;
    private String currency;
    private String bookerId;
    private String bookerUsername;
    private String bookerProfileImage;
    private long bookerContact;
    private double wallet;
    private String recipeId;
    private String recipeTitle;
    private String recipeUserId;
    private String recipeUsername;
    private String recipeUserProfile;
    private Date orderCreatedAt;
    private Date orderCompletedAt;
    private PaymentStatus orderStatus;
}
