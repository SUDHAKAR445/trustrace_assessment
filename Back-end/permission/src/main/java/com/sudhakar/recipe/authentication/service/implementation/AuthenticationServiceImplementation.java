package com.sudhakar.recipe.authentication.service.implementation;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sudhakar.recipe.authentication.dto.AuthenticationRequest;
import com.sudhakar.recipe.authentication.dto.AuthenticationResponse;
import com.sudhakar.recipe.authentication.dto.RegisterRequest;
import com.sudhakar.recipe.authentication.service.AuthenticationService;
import com.sudhakar.recipe.authentication.service.JwtService;
import com.sudhakar.recipe.entity.ConfirmationToken;
import com.sudhakar.recipe.entity.MailStructure;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.repository.ConfirmationTokenRepository;
import com.sudhakar.recipe.repository.RoleRepository;
import com.sudhakar.recipe.repository.UserRepository;
import com.sudhakar.recipe.service.MailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImplementation implements AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final MailService mailService;

    @Value("${file.upload-dir-profile}")
    private String uploadDir;


    @Override
    public ResponseEntity<Void> register(RegisterRequest request) {
        User user = User.builder()
                .usernameValue(request.getUserName())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .gender(request.getGender())
                .role(roleRepository.findByRoleName("USER").get())
                .password(passwordEncoder.encode(request.getPassword()))
                .createdAt(new Date())
                .updatedAt(null)
                .deletedAt(null)
                .accountActivated(false)
                .build();
        User savedUser;

        try {
            if (userRepository.existsByUsernameValueOrEmail(user.getUsernameValue(), user.getEmail())) {
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            } else {
                if(user.getGender() == "MALE") {
                    user.setProfileImageUrl(uploadDir+"/"+"MALE.png");
                } else if(user.getGender() == "FEMALE"){
                    user.setProfileImageUrl(uploadDir+"/"+"FEMALE.png");
                } else {
                    user.setProfileImageUrl(uploadDir+"/"+"NONE.png");
                }
                savedUser = userRepository.save(user);

                ConfirmationToken confirmationToken = new ConfirmationToken(savedUser.getId());

                confirmationTokenRepository.save(confirmationToken);

                String mailText = "To confirm your account, please click here : "
                        + "http://localhost:4200/confirm-account?token=" + confirmationToken.getConfirmationToken();

                MailStructure mailStructure = MailStructure.builder()
                        .to(savedUser.getEmail())
                        .message(mailText)
                        .subject("Complete Registration")
                        .build();

                mailService.sendMail(mailStructure);
                return new ResponseEntity<>(HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    @Override
    public ResponseEntity<Void> confirmUserAccount(String confirmationToken) {
        try {
            Optional<ConfirmationToken> token = confirmationTokenRepository.findByConfirmationToken(confirmationToken);

            if(token.isPresent()) {
                ConfirmationToken confirmation = token.get();
                User user = userRepository.findById(confirmation.getUser()).get();
                user.setAccountActivated(true);
                userRepository.save(user);
                confirmationTokenRepository.delete(confirmation);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<AuthenticationResponse> authenticate(AuthenticationRequest request) {

        User userDetails = userRepository
                .findByUsernameValueOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail()).get();
        try {
            System.out.println("gyuijokjkhgfhjkl"+ userDetails.getAccountActivated());
            if (userDetails.getDeletedAt() == null && userDetails.getAccountActivated()) {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(userDetails.getId(), request.getPassword()));

                User user = userRepository
                        .findByUsernameValueOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                        .orElseThrow(() -> new UsernameNotFoundException("Username  found exception "));

                Map<String, Object> extraClaims = new HashMap<>();
                extraClaims.put("Authorities", user.getAuthorities());
                System.out.println(user.getAuthorities());
                String jwtToken = jwtService.generateToken(extraClaims, user);
                return new ResponseEntity<>(AuthenticationResponse.builder()
                        .token(jwtToken)
                        .build(), HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.LOCKED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
