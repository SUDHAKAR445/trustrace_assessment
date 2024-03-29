package com.sudhakar.recipe.dto;

import java.util.Date;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecipeDto {

    private String recipeId;
    private String title;
    private Date dateCreated;
    private Date deletedAt;
    private String category;
    private String cuisine;
    private String userId;
    private String username;
    private String profileImageUrl;
    private String recipeImageUrl;
    private String description;
    private String video;
    private Set<String> likes;
}
