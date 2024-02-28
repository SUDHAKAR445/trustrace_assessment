
package com.sudhakar.recipe.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Comment;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String>{

}
