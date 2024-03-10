package com.sudhakar.recipe.service.implementation;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.dto.CommentDto;
import com.sudhakar.recipe.entity.Comment;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.repository.CommentRepository;
import com.sudhakar.recipe.repository.RecipeRepository;
import com.sudhakar.recipe.repository.UserRepository;
import com.sudhakar.recipe.service.CommentService;

@Service
public class CommentServiceImplementation implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Override
    public Comment createComment(Comment comment, User user, String recipeId) {
        if (comment != null) {
            comment.setRecipe(recipeId);
            comment.setUser(user.getId());
            comment.setDate(new Date());
            Comment savedComment = commentRepository.save(comment);
            return savedComment;
        }
        return null;
    }

    @Override
    public ResponseEntity<Void> deleteComment(String commentId) {
        try {
            Optional<Comment> comment = commentRepository.findById(commentId);

            if (comment.isPresent()) {
                commentRepository.delete(comment.get());
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Void> updateCommentLike(String commentId, String userId, boolean like) {
        try {
            Optional<Comment> commentOptional = commentRepository.findById(commentId);
            Optional<User> userOptional = userRepository.findById(userId);

            if (commentOptional.isPresent() && userOptional.isPresent()) {
                Comment comment = commentOptional.get();
                User user = userOptional.get();

                Set<String> likes = comment.getLikes();

                if (like) {
                    likes.add(user.getId());
                    commentRepository.save(comment);
                    return new ResponseEntity<>(HttpStatus.OK);
                } else {
                    likes.remove(user.getId());
                    commentRepository.save(comment);
                    return new ResponseEntity<>(HttpStatus.OK);
                }
            }

            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void deleteAllComment(List<String> comments) {
        if (comments != null) {
            commentRepository.deleteAllById(comments);
        }
    }

    public ResponseEntity<Page<CommentDto>> getAllComments(String recipeId, Pageable page) {
        try {
            Optional<Recipe> recipeOptional = recipeRepository.findById(recipeId);

            if (recipeOptional.isPresent()) {
                Page<Comment> comments = commentRepository.findByRecipeOrderByDateDesc(recipeOptional.get().getId(), page);

                return new ResponseEntity<>(comments.map(this::convertToDto), HttpStatus.OK);
            }

            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {

            System.out.println(e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @Override
    public ResponseEntity<CommentDto> getCommentById(String id) {
        try{
            Optional<Comment> commentOptional = commentRepository.findById(id);
            if(commentOptional.isPresent()) {
                return new ResponseEntity<>(convertToDto(commentOptional.get()), HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Set<String>> getAllLikedComments(String id) {
        try {
            Optional<User> userOptional = userRepository.findById(id);
            if(userOptional.isPresent()) {
                List<Comment> comments = commentRepository.findByLikesContains(id);
                Set<String> likedComment = new HashSet<>();
                for(Comment comment : comments) {
                    likedComment.add(comment.getId());
                }
                return new ResponseEntity<>(likedComment, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch ( Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public CommentDto convertToDto(Comment comment) {
        CommentDto commentDto = new CommentDto();
        commentDto.setId(comment.getId());
        commentDto.setText(comment.getText());
        User user = userRepository.findById(comment.getUser()).get();
        commentDto.setUserId(user.getId());
        commentDto.setUsername(user.getUsernameValue());
        commentDto.setProfileImageUrl(user.getProfileImageUrl());
        commentDto.setLikeCount(comment.getLikes() == null ? 0 : comment.getLikes().size());
        commentDto.setCommentDate(comment.getDate());
        commentDto.setLikes(comment.getLikes());

        return commentDto;
    }
}
