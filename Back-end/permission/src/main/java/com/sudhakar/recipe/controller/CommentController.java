package com.sudhakar.recipe.controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.dto.CommentDto;
import com.sudhakar.recipe.service.CommentService;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String commentId) {
        return commentService.deleteComment(commentId);
    }

    @PutMapping("/like/{commentId}/{userId}")
    public ResponseEntity<Void> likeComment(@PathVariable String commentId,
            @PathVariable String userId) {
        return commentService.updateCommentLike(commentId, userId, true);
    }

    @PutMapping("/unlike/{commentId}/{userId}")
    public ResponseEntity<Void> unlikeComment(@PathVariable String commentId,
            @PathVariable String userId) {
        return commentService.updateCommentLike(commentId, userId, false);
    }

    @GetMapping("/like/{userId}")
    public ResponseEntity<Set<String>> getAllLikedComments(@PathVariable String userId) {
        return commentService.getAllLikedComments(userId);
    }

    @GetMapping("/{recipeId}")
    public ResponseEntity<Page<CommentDto>> getAllComments(@PathVariable String recipeId, @RequestParam int page,
            @RequestParam int size) {
        return commentService.getAllComments(recipeId, PageRequest.of(page, size));
    }
    
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR') or hasRole('USER')")
    @GetMapping("/id/{id}")
    public ResponseEntity<CommentDto> getCommentById(@PathVariable String id) {
        return commentService.getCommentById(id);
    }

}