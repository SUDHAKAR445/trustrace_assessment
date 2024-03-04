package com.sudhakar.recipe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    
    private String id;
    private String key;
    private String orderId;
    private String companyName;
    private String currency;
    private double amount;
    private String bookerName;
    private String bookerId;
    private String bookerEmail;
    private long bookerContact;
}
