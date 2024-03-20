package com.sudhakar.recipe.service.implementation;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.sudhakar.recipe.dto.UserResponseDto;
import com.sudhakar.recipe.entity.Role;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.repository.RoleRepository;
import com.sudhakar.recipe.repository.UserRepository;
import com.sudhakar.recipe.service.UserService;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${file.upload-dir-profile}")
    private String uploadDir;

    @Value("${file.upload-dir}")
    private String path;

    @Override
    public ResponseEntity<UserResponseDto> createUser(User createUserRequest) {
        try {
            Optional<User> existingUser = userRepository.findByUsernameValueOrEmail(
                    createUserRequest.getUsernameValue(), createUserRequest.getEmail());
            if (existingUser.isPresent()) {
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }

            Role role = roleRepository.findByRoleName(createUserRequest.getRole().getRoleName()).get();
            createUserRequest.setPassword(passwordEncoder.encode(createUserRequest.getPassword()));
            createUserRequest.setRole(role);
            createUserRequest.setCreatedAt(new Date());
            createUserRequest.setAccountActivated(true);
            if (createUserRequest.getGender().equals("MALE")) {
                createUserRequest.setProfileImageUrl(uploadDir + "/" + "MALE.png");
            } else if (createUserRequest.getGender().equals("FEMALE")) {
                createUserRequest.setProfileImageUrl(uploadDir + "/" + "FEMALE.png");
            } else {
                createUserRequest.setProfileImageUrl(uploadDir + "/" + "NONE.png");
            }
            User savedUser = userRepository.save(createUserRequest);
            return new ResponseEntity<>(convertToUserDto(savedUser), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Void> deleteUser(String id) {
        try {
            Optional<User> existingUser = userRepository.findById(id);
            if (existingUser.isPresent()) {
                User user = existingUser.get();
                if (user.getDeletedAt() == null) {
                    user.setDeletedAt(new Date());
                    userRepository.save(user);
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } else {
                    user.setDeletedAt(null);
                    userRepository.save(user);
                    return new ResponseEntity<>(HttpStatus.OK);
                }
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<UserResponseDto> updateUser(String id, UserResponseDto updateUserRequest,
            MultipartFile imageFile) {
        try {
            validateImageFile(imageFile);

            Optional<User> existingUser = userRepository.findById(id);
            if (existingUser.isPresent()) {

                UserResponseDto requestUser = updateUserRequest;
                User user = existingUser.get();
                user.setFirstName(
                        requestUser.getFirstName() != null ? requestUser.getFirstName() : user.getFirstName());
                user.setLastName(requestUser.getLastName() != null ? requestUser.getLastName() : user.getLastName());
                user.setGender(requestUser.getGender() != null ? requestUser.getGender() : user.getGender());
                user.setUpdatedAt(new Date());
                user.setRole(requestUser.getRole() != null
                        ? roleRepository.findByRoleName(requestUser.getRole()).get()
                        : user.getRole());
                user.setContact(requestUser.getContact() != 0 ? requestUser.getContact() : user.getContact());

                user.setProfileImageUrl((imageFile == null || imageFile.isEmpty()) ? user.getProfileImageUrl()
                        : generateImageUrl(user.getId(), imageFile));

                user.setPassword(requestUser.getPassword() != null ? passwordEncoder.encode(requestUser.getPassword())
                        : user.getPassword());
                User savedUser = userRepository.save(user);
                return new ResponseEntity<>(convertToUserDto(savedUser), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void validateImageFile(MultipartFile imageFile) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileExtension = FilenameUtils.getExtension(imageFile.getOriginalFilename());
            if (!Arrays.asList("jpg", "jpeg", "png").contains(fileExtension.toLowerCase())) {
                throw new IllegalArgumentException("Invalid image file type");
            }
        }
    }

    private String generateImageUrl(String recipeId, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());
            String fileExtension = FilenameUtils.getExtension(fileName);
            String newFileName = recipeId + "." + fileExtension;

            String filePath = uploadDir + "/" + newFileName;

            String fileStorePath = path + "/profile" + "/" + newFileName;

            try (InputStream inputStream = imageFile.getInputStream()) {
                Files.copy(inputStream, Paths.get(fileStorePath), StandardCopyOption.REPLACE_EXISTING);
            }
            return filePath;
        }
        return null;
    }

    @Override
    public ResponseEntity<Page<UserResponseDto>> getAllUsers(Pageable pageable) {
        try {

            Page<UserResponseDto> userList = userRepository.findAll(pageable).map(this::convertToUserDto);

            return new ResponseEntity<>(userList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<UserResponseDto> getProfile(String id) {
        try {
            User user = userRepository.findById(id).get();
            if (user == null) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(convertToUserDto(user), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // public ResponseEntity<List<Recipe>> getAllRecipeByFollowingList(String
    // userId, Pageable pageable) {
    // try {
    // Optional<User> userOptional = userRepository.findById(userId);
    // if (userOptional.isPresent()) {
    // User user = userOptional.get();
    // List<Follow> followingUserList = followRepository.findByFollowingUser(user);
    // List<User> followingList =
    // followingUserList.stream().map(Follow::getFollowerUser)
    // .collect(Collectors.toList());

    // }
    // return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    // } catch (Exception e) {
    // return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    // }
    // }

    public UserResponseDto convertToUserDto(User user) {
        UserResponseDto userDto = new UserResponseDto();
        userDto.setId(user.getId());
        userDto.setUsernameValue(user.getUsernameValue());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setGender(user.getGender());
        userDto.setEmail(user.getEmail());
        userDto.setContact(user.getContact());
        userDto.setRole(user.getRole().getRoleName());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setUpdatedAt(user.getUpdatedAt());
        userDto.setDeletedAt(user.getDeletedAt());
        userDto.setWallet(user.getWallet());
        userDto.setProfileImageUrl(user.getProfileImageUrl());

        return userDto;
    }

    @Override
    public ResponseEntity<Boolean> checkUsername(String username) {
        try {
            boolean isUsernameAvailable = !userRepository.existsByUsernameValue(username);
            return ResponseEntity.ok(isUsernameAvailable);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Boolean> checkEmail(String email) {
        try {
            boolean isEmailAvailable = !userRepository.existsByEmail(email);
            return ResponseEntity.ok(isEmailAvailable);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
