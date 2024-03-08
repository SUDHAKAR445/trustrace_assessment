package com.sudhakar.recipe.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.dto.BookingDto;
import com.sudhakar.recipe.dto.TransactionDto;
import com.sudhakar.recipe.entity.PaymentRequest;

public interface RazorpayService {

    ResponseEntity<BookingDto> createOrder(PaymentRequest request);

    ResponseEntity<Void> updateBooking(String id, String paymentId);

    ResponseEntity<Page<TransactionDto>> getAllTransactions(Pageable page);

    ResponseEntity<TransactionDto> getTransactionById(String id);
}
