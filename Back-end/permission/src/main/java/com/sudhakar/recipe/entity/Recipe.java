package com.sudhakar.recipe.entity;

import java.util.Date;
import java.util.Set;

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
@Document(collection = "recipes")
public class Recipe {

    @Id
    private String id;
    
    @Field(name = "title")
    private String title;

    @Field(name = "description")
    private String description;

    @Field(name = "instructions")
    private String instructions;

    @Field(name = "preparation_time")
    private int preparationTime;

    @Field(name = "cooking_time")
    private int cookingTime;

    @Field(name ="servings")
    private int servings;

    @Field(name = "date_created")
    private Date dateCreated;

    @DBRef
    @Field(name = "post_user_ref")
    private User user;

    @Field(name = "photo")
    private String photo;

    @Field(name = "video")
    private String video;

    @Field(name = "liked_user_ref")
    private Set<String> likes;

    @DBRef
    @Field(name = "category_ref")
    private Category category;

    @DBRef
    @Field(name = "cuisine_ref")
    private Cuisine cuisine;

    @DBRef
    @Field(name = "comments_ref")
    private Set<Comment> comments;

    @DBRef
    @Field(name = "ingredients_ref")
    private Set<Ingredient> ingredients;

}
