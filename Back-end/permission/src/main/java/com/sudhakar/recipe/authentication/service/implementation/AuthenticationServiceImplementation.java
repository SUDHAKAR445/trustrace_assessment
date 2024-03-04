package com.sudhakar.recipe.authentication.service.implementation;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.authentication.dto.AuthenticationRequest;
import com.sudhakar.recipe.authentication.dto.AuthenticationResponse;
import com.sudhakar.recipe.authentication.dto.RegisterRequest;
import com.sudhakar.recipe.authentication.service.AuthenticationService;
import com.sudhakar.recipe.authentication.service.JwtService;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.repository.RoleRepository;
import com.sudhakar.recipe.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImplementation implements AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public ResponseEntity<AuthenticationResponse> register(RegisterRequest request) {
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
                .build();
        User savedUser;

        try {
            if (userRepository.existsByUsernameValueOrEmail(user.getUsernameValue(), user.getEmail())) {
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            } else {
                savedUser = userRepository.save(user);
                
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("Authorities", savedUser.getAuthorities());
        System.out.println(user.getAuthorities());
        String jwtToken = jwtService.generateToken(extraClaims, savedUser);
        
        return new ResponseEntity<>(AuthenticationResponse.builder()
                .token(jwtToken)
                .build(), HttpStatus.OK);
    }


    @Override
    public ResponseEntity<AuthenticationResponse> authenticate(AuthenticationRequest request) {

        User userDetails = userRepository
                .findByUsernameValueOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail()).get();
        try {
            if (userDetails.getDeletedAt() == null) {
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
