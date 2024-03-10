package com.sudhakar.recipe.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sudhakar.recipe.entity.PaymentRequest;
import com.sudhakar.recipe.filters.PaymentFilterDao;
import com.sudhakar.recipe.dto.BookingDto;
import com.sudhakar.recipe.dto.TransactionDto;
import com.sudhakar.recipe.service.RazorpayService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
public class PaymentController {

    @Autowired
    private RazorpayService razorpayService;

    @Autowired
    private PaymentFilterDao paymentFilterDao;

    @PostMapping("/charge")
    public ResponseEntity<BookingDto> createBooking(@RequestBody PaymentRequest paymentRequest) {
        return razorpayService.createOrder(paymentRequest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBooking(@PathVariable String id, @RequestBody String paymentId) {
        return razorpayService.updateBooking(id, paymentId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping()
    public ResponseEntity<Page<TransactionDto>> getAllTransactions(@RequestParam int page, @RequestParam int size) {
        return razorpayService.getAllTransactions(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDto> getTransactionById(@PathVariable String id) {
        return razorpayService.getTransactionById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<Page<TransactionDto>> searchTransaction(
        @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Date startDate,
            @RequestParam(required = false) Date endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return paymentFilterDao.searchTransaction(searchText, status, startDate, endDate, PageRequest.of(page, size));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<TransactionDto>> getTransactionsByUserId(
        @PathVariable String userId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
            return paymentFilterDao.getAllTransactionByUserId(userId, PageRequest.of(page, size));
        }
}
