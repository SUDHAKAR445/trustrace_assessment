
package com.sudhakar.recipe.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Comment;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String>{

    Page<Comment> findByRecipeOrderByDateDesc(String id, Pageable page);

    List<Comment> findByLikesContains(String id);

}
