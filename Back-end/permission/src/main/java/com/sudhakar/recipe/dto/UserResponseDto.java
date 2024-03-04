package com.sudhakar.recipe.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserResponseDto {

    private String id;
    private String usernameValue;
    private String firstName;
    private String lastName;
    private String gender;
    private String email;
    private long contact;
    private String role;
    private Date createdAt;
    private Date updatedAt;
    private Date deletedAt;
    private String profileImageUrl;
    private double wallet;
    @JsonIgnore
    private String password;

}
