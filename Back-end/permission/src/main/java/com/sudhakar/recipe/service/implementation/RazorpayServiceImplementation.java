package com.sudhakar.recipe.service.implementation;

import java.util.Date;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.sudhakar.recipe.dto.BookingDto;
import com.sudhakar.recipe.dto.TransactionDto;
import com.sudhakar.recipe.entity.Booking;
import com.sudhakar.recipe.entity.MailStructure;
import com.sudhakar.recipe.entity.PaymentRequest;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.entity.Booking.PaymentStatus;
import com.sudhakar.recipe.repository.BookingRepository;
import com.sudhakar.recipe.repository.RecipeRepository;
import com.sudhakar.recipe.repository.UserRepository;
import com.sudhakar.recipe.service.MailService;
import com.sudhakar.recipe.service.RazorpayService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@PropertySource("classpath:application.properties")
public class RazorpayServiceImplementation implements RazorpayService {

    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    @Value("${razorpay.currency}")
    private String currency;

    @Value("${razorpay.company.name}")
    private String company;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MailService mailService;

    @Override
    @Transactional
    public ResponseEntity<BookingDto> createOrder(PaymentRequest request) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(apiKey, apiSecret);

            Booking booking = new Booking();
            booking.setBookerUser(request.getBookerId());
            booking.setBookedRecipe(request.getRecipeId());
            booking.setBookedRecipeUser(recipeRepository.findById(request.getRecipeId()).get().getUser().getId());
            booking.setCurrency(currency);
            booking.setOrderCreatedDate(new Date());
            booking.setPaymentStatus(PaymentStatus.CREATED);
            booking.setAmount(request.getAmount());

            JSONObject orderRequest = new JSONObject();

            orderRequest.put("amount", request.getAmount() * 100);
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1);
            Order order = razorpayClient.orders.create(orderRequest);

            booking.setOrderId(order.get("id"));
            booking.setReceiptId(order.get("receipt"));

            Booking savedBooking = bookingRepository.save(booking);
            System.out.println(savedBooking);

            return new ResponseEntity<>(convertDto(savedBooking), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    private BookingDto convertDto(Booking booking) {
        BookingDto bookingDto = new BookingDto();
        bookingDto.setId(booking.getId());
        bookingDto.setKey(apiKey);
        bookingDto.setOrderId(booking.getOrderId());
        bookingDto.setAmount(booking.getAmount());
        bookingDto.setCompanyName(company);
        bookingDto.setCurrency(currency);
        bookingDto.setBookerId(booking.getBookerUser());

        User user = userRepository.findById(booking.getBookerUser()).get();
        bookingDto.setBookerName(user.getFirstName() + " " + user.getLastName());
        bookingDto.setBookerEmail(user.getEmail());
        bookingDto.setBookerContact(user.getContact());

        return bookingDto;
    }

    @Override
    public ResponseEntity<String> updateBooking(String id, String paymentId) {
        try {
            Optional<Booking> booking = bookingRepository.findById(id);
            if (booking.isPresent()) {
                if (paymentId != null && paymentId != "") {
                    User user = userRepository.findById(booking.get().getBookedRecipeUser()).get();
                    user.setWallet(user.getWallet() + booking.get().getAmount());
                    userRepository.save(user);

                    Booking savedBooking = booking.get();
                    savedBooking.setPaymentId(paymentId);
                    savedBooking.setPaymentStatus(PaymentStatus.COMPLETED);
                    savedBooking.setOrderCompletedDate(new Date());

                    bookingRepository.save(savedBooking);
                    mailService.sendMail(userRepository.findById(booking.get().getBookerUser()).get().getEmail(), new MailStructure());
                    return new ResponseEntity<>("Booked Successfully", HttpStatus.OK);
                } else {
                    Booking savedBooking = booking.get();
                    savedBooking.setPaymentStatus(PaymentStatus.REJECTED);
                    savedBooking.setOrderCompletedDate(new Date());

                    bookingRepository.save(savedBooking);
                    return new ResponseEntity<>("Booking is failed", HttpStatus.BAD_REQUEST);
                }
            }
            return new ResponseEntity<>("No Booking found", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Problem in booking", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Page<TransactionDto>> getAllTransactions(Pageable page) {
        try {
            Page<Booking> transactions = bookingRepository.findAll(page);
            System.out.println(transactions);
            return new ResponseEntity<>(transactions.map(this::convertToTransactionDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<TransactionDto> getTransactionById(String id) {
        try {
            Optional<Booking> transactionOptional = bookingRepository.findById(id);
            if (transactionOptional.isPresent()) {
                return new ResponseEntity<>(convertToTransactionDto(transactionOptional.get()), HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
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
