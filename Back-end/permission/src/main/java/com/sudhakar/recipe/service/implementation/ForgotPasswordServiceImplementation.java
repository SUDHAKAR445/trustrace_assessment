package com.sudhakar.recipe.service.implementation;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.entity.ForgotPassword;
import com.sudhakar.recipe.entity.MailStructure;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.repository.ForgotPasswordRepository;
import com.sudhakar.recipe.repository.UserRepository;
import com.sudhakar.recipe.service.ForgotPasswordService;
import com.sudhakar.recipe.service.MailService;

@Service
public class ForgotPasswordServiceImplementation implements ForgotPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ForgotPasswordRepository forgotPasswordRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public ResponseEntity<Void> verifyEmail(String email) {
        try {

            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {

                User user = userOptional.get();
                int otp = otpGenerator();
                String htmlContent = "Hello " + user.getUsernameValue() + ",\n\n" +
                        "We received a request to reset your password. Enter the OTP below to reset it:\n" +
                        "OTP: " + otp + "\n\n" +
                        "If you did not request a password reset, please ignore this email.\n\n" +
                        "Thank you,\nYourAppName Team";

                MailStructure mailStructure = MailStructure.builder()
                        .to(email)
                        .message(htmlContent)
                        .subject("OTP for Forgot Password request")
                        .build();

                ForgotPassword forgotPassword = ForgotPassword.builder()
                        .otp(otp)
                        .expirationTime(new Date(System.currentTimeMillis() + 60 * 5 * 1000))
                        .user(user.getId())
                        .build();

                mailService.sendMail(mailStructure);
                forgotPasswordRepository.save(forgotPassword);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Void> verifyOtp(int otp, String email) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Optional<ForgotPassword> forgotPasswordOptional = forgotPasswordRepository.findByOtpAndUser(otp,
                        user.getId());

                if (forgotPasswordOptional.isPresent()) {
                    ForgotPassword forgotPassword = forgotPasswordOptional.get();

                    if (forgotPassword.getExpirationTime().before(Date.from(Instant.now()))) {
                        forgotPasswordRepository.delete(forgotPassword);
                        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
                    }
                    forgotPasswordRepository.delete(forgotPassword);
                    return new ResponseEntity<>(HttpStatus.OK);
                }
                return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Integer otpGenerator() {
        Random random = new Random();
        return random.nextInt(100_000, 999_999);
    }

    public ResponseEntity<Void> changePassword(String email, String password) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
