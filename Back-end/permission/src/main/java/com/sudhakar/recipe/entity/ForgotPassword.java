package com.sudhakar.recipe.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder

@Document(collection = "forgot_password")
public class ForgotPassword {

    @Id
    private String id;

    @Field(name = "otp")
    private Integer otp;

    @Field(name = "expiration_time")
    private Date expirationTime;

    @Field(name = "user_ref")
    private String user;
}
