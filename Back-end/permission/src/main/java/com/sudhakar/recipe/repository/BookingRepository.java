package com.sudhakar.recipe.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Booking;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String>{

}
