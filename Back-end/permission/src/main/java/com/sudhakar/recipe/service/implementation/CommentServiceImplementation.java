package com.sudhakar.recipe.service.implementation;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.entity.Comment;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.repository.CommentRepository;
import com.sudhakar.recipe.repository.UserRepository;
import com.sudhakar.recipe.service.CommentService;

@Service
public class CommentServiceImplementation implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Comment createComment(Comment comment, User user) {
        if (comment != null) {
            comment.setUser(user);
            comment.setDate(new Date());
            Comment savedComment = commentRepository.save(comment);
            return savedComment;
        }
        return null;
    }

    @Override
    public ResponseEntity<String> deleteComment(String commentId, String userId) {
        try {
            Optional<Comment> comment = commentRepository.findById(commentId);
            Optional<User> user = userRepository.findById(userId);

            if (comment.isPresent() && user.isPresent()) {

                if (comment.get().getUser() == user.get()) {
                    return new ResponseEntity<>("Unauthorized action", HttpStatus.BAD_REQUEST);
                }
                commentRepository.delete(comment.get());
                return new ResponseEntity<>("Comment deleted successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("No comment present", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Problem in delete the comment", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> updateCommentLike(String commentId, String userId, boolean like) {
        try {
            Optional<Comment> commentOptional = commentRepository.findById(commentId);
            Optional<User> userOptional = userRepository.findById(userId);

            if (commentOptional.isPresent() && userOptional.isPresent()) {
                Comment comment = commentOptional.get();
                User user = userOptional.get();

                // if (comment.getUser().equals(user)) {
                // return new ResponseEntity<>("Unauthorized action", HttpStatus.BAD_REQUEST);
                // }

                List<User> likes = comment.getLikes();

                if (like) {
                    likes.add(0, user);
                    commentRepository.save(comment);
                    return new ResponseEntity<>("Comment liked successfully", HttpStatus.OK);
                } else {
                    likes.remove(user);
                    commentRepository.save(comment);
                    return new ResponseEntity<>("Comment unliked successfully", HttpStatus.OK);
                }
            }

            return new ResponseEntity<>("Comment does not exist or user not found", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Problem in updating comment like", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void deleteAllComment(Set<Comment> comments) {
        if (comments != null) {
            commentRepository.deleteAll(comments);
        }
    }
}
