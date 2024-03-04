package com.sudhakar.recipe.entity;

import java.util.Date;
import java.util.List;

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
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    @Field(name = "text")
    private String text;

    @Field(name = "date")
    private Date date;

    @Field(name = "posted_recipe_ref")
    private String recipe;

    @Field(name = "commented_user_ref")
    private String user;

    @Field(name = "liked_user_ref")
    private List<String> likes;
}
