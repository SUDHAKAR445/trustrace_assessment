package com.sudhakar.recipe.dto;

import java.util.Date;

import com.sudhakar.recipe.entity.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ReportDto {

    private String id;
    private String reportText;
    private Date reportedDate;
    private Status status;
    
    private String reporterUserId;
    private String reporterUserImage;
    private String reporterUsername;

    private String reportedUserId;
    private String reportedUserImage;
    private String reportedUsername;

    private String commentId;
    private String commentText;
    private String commentUserProfileImage;
    private String commentUserId;
    private String commentUsername;

    private String recipeId;
    private String recipeTitle;
    private String recipeUserId;
    private String recipeUserProfileImage;
    private String recipeUsername;


}
