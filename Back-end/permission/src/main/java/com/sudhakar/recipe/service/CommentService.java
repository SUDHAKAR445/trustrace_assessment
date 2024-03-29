package com.sudhakar.recipe.service;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.dto.CommentDto;
import com.sudhakar.recipe.entity.Comment;
import com.sudhakar.recipe.entity.User;

public interface CommentService {

    Comment createComment(Comment comment, User user, String recipeId);

    ResponseEntity<Void> deleteComment(String commentId);

    ResponseEntity<Void> updateCommentLike(String commentId, String userId, boolean like);

    void deleteAllComment(List<String> comments);

    ResponseEntity<Page<CommentDto>> getAllComments(String recipeId, Pageable page);

    ResponseEntity<CommentDto> getCommentById(String id);

    ResponseEntity<Set<String>> getAllLikedComments(String id);
}
