package com.sudhakar.recipe.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Booking;
import com.sudhakar.recipe.entity.Booking.PaymentStatus;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String>{

    List<Booking> findByPaymentIdIsNotNull();

    Page<Booking> findByPaymentStatusOrderByOrderCreatedDateDesc(PaymentStatus status, Pageable pageable);

}
