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
@Document(collection = "blocks")
public class Block {

    @Id
    private String id;

    @DBRef
    @Field(name = "blocking_user_ref")
    private User blockingUser;

    @DBRef
    @Field(name = "blocked_user_ref")
    private User blockedUser;

    public Block(User existingBlockingUser, User existingBlockedUser) {
        this.blockingUser = existingBlockingUser;
        this.blockedUser = existingBlockedUser;
    }
}
