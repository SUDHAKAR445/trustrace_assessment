package com.sudhakar.recipe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.service.CommentService;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable String commentId, @RequestParam String userId) {
        return commentService.deleteComment(commentId, userId);
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

}