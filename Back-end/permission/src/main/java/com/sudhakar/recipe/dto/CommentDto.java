package com.sudhakar.recipe.dto;

import java.util.Date;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CommentDto {

    private String id;
    private String text;
    private String userId;
    private String username;
    private Date  commentDate;
    private String profileImageUrl;
    private int likeCount;
    private Set<String> likes;
}
