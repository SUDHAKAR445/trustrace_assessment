package com.sudhakar.recipe.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    @Field(name = "booker_user_ref")
    private String bookerUser;

    @Field(name = "booked_recipe_user_ref")
    private String bookedRecipeUser;

    @Field(name = "booked_recipe_ref")
    private String bookedRecipe;

    @Field(name = "amount")
    private double amount;

    @Field(name = "order_id")
    private String orderId;

    @Field(name = "receipt_id")
    private String receiptId;

    @Field(name = "payment_id")
    private String paymentId;

    @Field(name = "currency")
    private String currency;

    @Field(name = "payment_status")
    private PaymentStatus paymentStatus;

    @Field(name = "order_created_date")
    private Date orderCreatedDate;

    @Field(name = "order_completed_date")
    private Date orderCompletedDate;


    public enum PaymentStatus {
        CREATED,
        REJECTED,
        COMPLETED
    }
}
