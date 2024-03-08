package com.sudhakar.recipe.entity;

import java.util.Date;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Document(collection = "confirmation_tokens")
public class ConfirmationToken {

    @Id
    private String id;

    @Field(name = "token_id")
    private String tokenId;

    @Field(name = "confirmation_token")
    private String confirmationToken;

    @Field(name = "created_at")
    private Date createdAt;

    @Field(name = "user_ref")
    private String user;

    public ConfirmationToken(String userId) {
        this.user = userId;
        createdAt = new Date();
        confirmationToken = UUID.randomUUID().toString();
    }
    
}
