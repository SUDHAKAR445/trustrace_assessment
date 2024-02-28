package com.sudhakar.recipe.service;

import java.util.Set;

import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.entity.Comment;
import com.sudhakar.recipe.entity.User;

public interface CommentService {

    Comment createComment(Comment comment, User user);

    ResponseEntity<String> deleteComment(String commentId, String userId);

    ResponseEntity<String> updateCommentLike(String commentId, String userId, boolean like);

    void deleteAllComment(Set<Comment> comments);
}
