package com.sudhakar.recipe.service.implementation;

import java.util.Date;
import java.util.Optional;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Void> updateBooking(String id, String paymentId) {
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

                    String userEmail = userRepository.findById(booking.get().getBookerUser()).get().getEmail();

                    MailStructure mailStructure = constructMailBody(userEmail, convertToTransactionDto(savedBooking));
                    mailService.sendMailWithQr(mailStructure);
                    return new ResponseEntity<>(HttpStatus.OK);
                } else {
                    Booking savedBooking = booking.get();
                    savedBooking.setPaymentStatus(PaymentStatus.REJECTED);
                    savedBooking.setOrderCompletedDate(new Date());

                    bookingRepository.save(savedBooking);
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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

    private MailStructure constructMailBody(String userEmail, TransactionDto transactionDto)
            throws IOException, WriterException {
        String qrCodeContent = "Transaction ID: " + transactionDto.getId() + "\n"
                + "Amount: " + transactionDto.getAmount() + " " + transactionDto.getCurrency() + "\n"
                + "Booker Username: " + transactionDto.getBookerUsername();

        String qrCodeBase64 = generateQRCode(qrCodeContent, 300, 300);

        String mailBody = "<html><body>"
                + "<p>Dear User,</p>"
                + "<p>Thank you for your transaction. Here are the details:</p>"
                + "<ul>"
                + "<li><strong>Transaction ID:</strong> " + transactionDto.getId() + "</li>"
                + "<li><strong>Order ID:</strong> " + transactionDto.getOrderId() + "</li>"
                + "<li><strong>Payment ID:</strong> " + transactionDto.getPaymentId() + "</li>"
                + "<li><strong>Amount:</strong> " + transactionDto.getAmount() + " " + transactionDto.getCurrency()
                + "</li>"
                + "<li><strong>Booker Information:</strong>"
                + "  <ul>"
                + "    <li><strong>Username:</strong> " + transactionDto.getBookerUsername() + "</li>"
                + "    <li><strong>Profile Image:</strong> <img src='" + transactionDto.getBookerProfileImage() + ",></li>"
                + "    <li><strong>Contact:</strong> " + transactionDto.getBookerContact() + "</li>"
                + "  </ul>"
                + "</li>";

        if (transactionDto.getRecipeId() != null) {
            mailBody += "<li><strong>Recipe Information:</strong>"
                    + "  <ul>"
                    + "    <li><strong>Recipe ID:</strong> " + transactionDto.getRecipeId() + "</li>"
                    + "    <li><strong>Recipe Title:</strong> " + transactionDto.getRecipeTitle() + "</li>"
                    + "    <li><strong>Recipe User ID:</strong> " + transactionDto.getRecipeUserId() + "</li>"
                    + "    <li><strong>Recipe User Username:</strong> " + transactionDto.getRecipeUsername() + "</li>"
                    + "    <li><strong>Recipe User Profile Image:</strong> <img src='" + transactionDto.getRecipeUserProfile()
                    + "'></li>"
                    + "  </ul>"
                    + "</li>";
        }

        mailBody += "</ul>"
                + "<p>Order Created At: " + transactionDto.getOrderCreatedAt() + "</p>"
                + "<p>Order Completed At: " + transactionDto.getOrderCompletedAt() + "</p>"
                + "<p>Order Status: " + transactionDto.getOrderStatus() + "</p>"
                + "<p>QR Code:</p>"
                + "<img src='data:image/png;base64," + qrCodeBase64 + "' alt='QR Code'>"
                + "<p>Thank you for using our service!</p>"
                + "<p>Best regards,<br>Your Company</p>"
                + "</body></html>";

        mailBody += "Click here to view transaction "+ "http://localhost:4200/user/booking/detail?detail=" + transactionDto.getId();
        MailStructure mailStructure = MailStructure.builder()
                .to(userEmail)
                .subject("Your order Details")
                .message(mailBody)
                .build();

        return mailStructure;
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

    private static String generateQRCode(String content, int width, int height) throws IOException, WriterException {
        BitMatrix bitMatrix = new MultiFormatWriter().encode(content, BarcodeFormat.QR_CODE, width, height);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        byte[] byteArray = outputStream.toByteArray();
        return Base64.getEncoder().encodeToString(byteArray);
    }
}
