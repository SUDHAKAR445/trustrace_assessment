package com.sudhakar.recipe.filters;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.dto.TransactionDto;

public interface PaymentFilterDao {

    ResponseEntity<Page<TransactionDto>> searchTransaction(String searchText, String status, Date startDate, Date endDate, Pageable pageable);

    ResponseEntity<Page<TransactionDto>> getAllTransactionByUserId(String id, Pageable pageable);
}
