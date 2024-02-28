package com.sudhakar.recipe.authentication.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String userName;

    private String firstName;

    private String lastName;

    private String email;

    private String gender;

    private String password;

    private Date createAt;

    private Date updatedAt;

    private Date deletedAt;

}
