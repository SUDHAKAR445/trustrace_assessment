package com.sudhakar.recipe.filters.implementation;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.sudhakar.recipe.dto.TransactionDto;
import com.sudhakar.recipe.entity.Booking;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.entity.Report;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.filters.PaymentFilterDao;
import com.sudhakar.recipe.repository.RecipeRepository;
import com.sudhakar.recipe.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PaymentFilterDaoImplementation implements PaymentFilterDao {

    private final MongoTemplate mongoTemplate;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    @Override
    public ResponseEntity<Page<TransactionDto>> searchTransaction(String searchText, String status, Date startDate,
            Date endDate, Pageable pageable) {
        try {
            Query query = new Query();

            if (StringUtils.hasText(status)) {
                query.addCriteria(Criteria.where("paymentStatus").is(status));
            }

            if (StringUtils.hasText(searchText)) {
                query.addCriteria(Criteria.where("orderId").regex(searchText, "i"));
            }

            if (startDate != null && endDate != null) {
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(endDate);
                calendar.add(Calendar.DAY_OF_MONTH, 1);
                endDate = calendar.getTime();
                Criteria dateCriteria = Criteria.where("orderCreatedDate").gte(startDate).lte(endDate);
                query.addCriteria(dateCriteria);
            }

            long count = mongoTemplate.count(query, Report.class);
            List<Booking> bookings = mongoTemplate.find(query.with(pageable).with(Sort.by(Sort.Direction.ASC, "orderCreatedDate")), Booking.class);
            Page<Booking> bookingsList = new PageImpl<>(bookings, pageable, count);

            return new ResponseEntity<>(bookingsList.map(this::convertToTransactionDto), HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Page<TransactionDto>> getAllTransactionByUserId(String id, Pageable pageable) {
        try {
            Criteria criteria = new Criteria().orOperator(
                    Criteria.where("bookerUser").is(id),
                    Criteria.where("bookedRecipeUser").is(id));

            Query query = new Query(criteria)
                    .with(pageable)
                    .with(Sort.by(Sort.Direction.ASC, "orderCreatedDate"));

            List<Booking> bookings = mongoTemplate.find(query, Booking.class);
            long count = mongoTemplate.count(query, Booking.class);

            Page<Booking> bookingsList = new PageImpl<>(bookings, pageable, count);

            List<TransactionDto> transactionDtos = bookingsList
                    .stream()
                    .map(this::convertToTransactionDto)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(new PageImpl<>(transactionDtos, pageable, count), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private TransactionDto convertToTransactionDto(Booking booking) {
        TransactionDto transactionDto = new TransactionDto();
        transactionDto.setId(booking.getId());
        transactionDto.setOrderId(booking.getOrderId());
        transactionDto.setPaymentId(booking.getPaymentId());
        transactionDto.setAmount(booking.getAmount());
        transactionDto.setCurrency(booking.getCurrency());
        transactionDto.setBookerId(booking.getBookerUser());

        Optional<User> user = userRepository.findById(booking.getBookerUser());
        if (user.isPresent()) {
            transactionDto.setBookerUsername(user.get().getUsernameValue());
            transactionDto.setBookerProfileImage(user.get().getProfileImageUrl());
            transactionDto.setBookerContact(user.get().getContact());
        }

        Optional<Recipe> recipe = recipeRepository.findById(booking.getBookedRecipe());
        if (recipe != null) {
            transactionDto.setRecipeId(recipe.get().getId());
            transactionDto.setRecipeTitle(recipe.get().getTitle());
            transactionDto.setRecipeUserId(recipe.get().getUser().getId());
            transactionDto.setRecipeUsername(recipe.get().getUser().getUsernameValue());
            transactionDto.setRecipeUserProfile(recipe.get().getUser().getProfileImageUrl());
            transactionDto.setWallet(recipe.get().getUser().getWallet());
        }

        transactionDto.setOrderCreatedAt(booking.getOrderCreatedDate());
        transactionDto.setOrderCompletedAt(booking.getOrderCompletedDate());
        transactionDto.setOrderStatus(booking.getPaymentStatus());

        return transactionDto;
    }
}
