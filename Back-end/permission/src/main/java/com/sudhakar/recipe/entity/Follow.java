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
@Document(collection = "follows")
public class Follow {
    
    @Id
    private String id;

    @DBRef
    @Field(name = "follower_user_ref")
    private User followerUser;

    @DBRef
    @Field(name = "following_user_ref")
    private User followingUser;

    public Follow(User existingFollowerUser, User existingFollowingUser) {
        this.followerUser = existingFollowerUser;
        this.followingUser = existingFollowingUser;
    }
}
