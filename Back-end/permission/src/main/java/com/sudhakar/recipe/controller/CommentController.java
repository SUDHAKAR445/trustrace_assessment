package com.sudhakar.recipe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
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
public class CommentController {

    @Autowired
    private CommentService commentService;

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable String commentId) {
        return commentService.deleteComment(commentId);
    }

    @PutMapping("/{commentId}/like")
    public ResponseEntity<String> likeComment(@PathVariable String commentId,
            @RequestParam String userId) {
        return commentService.updateCommentLike(commentId, userId, true);
    }

    @PutMapping("/{commentId}/unlike")
    public ResponseEntity<String> unlikeComment(@PathVariable String commentId,
            @RequestParam String userId) {
        return commentService.updateCommentLike(commentId, userId, false);
    }

    @GetMapping("/{recipeId}")
    public ResponseEntity<Page<CommentDto>> getAllComments(@PathVariable String recipeId, @RequestParam int page,
            @RequestParam int size) {
        return commentService.getAllComments(recipeId, PageRequest.of(page, size));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<CommentDto> getCommentById(@PathVariable String id) {
        return commentService.getCommentById(id);
    }

}