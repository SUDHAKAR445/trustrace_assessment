package com.sudhakar.recipe.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
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

    public Booking(String orderId, String currency, int amount, String key) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.key = key;
    }

    @Id
    private String id;

    @DBRef
    @Field(name = "recipe_ref")
    private Recipe recipe;

    @DBRef
    @Field(name = "booker_user_ref")
    private User bookerUser;

    @DBRef
    @Field(name = "booked_user_ref")
    private User bookedUser;

    @Field(name = "booking_date")
    private String bookingDate;

    @Field(name = "payment_status")
    private String paymentStatus;

    @Field(name = "amount")
    private double amount;

    @Field(name = "order_id")
    private String orderId;

    @Field(name = "currency")
    private String currency;

    @Field(name = "key")
    private String key;
}
