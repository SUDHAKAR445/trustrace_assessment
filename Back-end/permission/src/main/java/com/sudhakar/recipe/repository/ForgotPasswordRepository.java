package com.sudhakar.recipe.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.sudhakar.recipe.entity.ForgotPassword;

public interface ForgotPasswordRepository extends MongoRepository<ForgotPassword, String>{

    Optional<ForgotPassword> findByOtpAndUser(int otp, String id);

}
