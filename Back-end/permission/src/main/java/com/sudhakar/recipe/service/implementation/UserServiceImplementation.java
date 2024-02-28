package com.sudhakar.recipe.service.implementation;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
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

    @Override
    public ResponseEntity<User> createUser(User createUserRequest) {
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
            User savedUser = userRepository.save(createUserRequest);

            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
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
    public ResponseEntity<User> updateUser(String id, User updateUserRequest, MultipartFile imageFile) {
        try {
            validateImageFile(imageFile);
            Optional<User> existingUser = userRepository.findById(id);
            if (existingUser.isPresent()) {
                User requestUser = updateUserRequest;
                User user = existingUser.get();
                user.setUsernameValue(requestUser.getUsernameValue() != null ? requestUser.getUsernameValue() : user.getUsernameValue());
                user.setFirstName(
                        requestUser.getFirstName() != null ? requestUser.getFirstName() : user.getFirstName());
                user.setLastName(requestUser.getLastName() != null ? requestUser.getLastName() : user.getLastName());
                user.setEmail(requestUser.getEmail() != null ? requestUser.getEmail() : user.getEmail());
                user.setGender(requestUser.getGender() != null ? requestUser.getGender() : user.getGender());
                user.setPassword(requestUser.getPassword() != null ? requestUser.getPassword()
                        : passwordEncoder.encode(user.getPassword()));
                user.setUpdatedAt(new Date());
                user.setRole(updateUserRequest.getRole() != null
                        ? roleRepository.findByRoleName(updateUserRequest.getRole().getRoleName()).get()
                        : user.getRole());
                user.setContact(requestUser.getContact() != 0 ? requestUser.getContact() : user.getContact());
                user.setProfileImageUrl((imageFile == null || imageFile.isEmpty()) ? user.getProfileImageUrl()
                        : generateImageUrl(user.getId(), imageFile));
                User savedUser = userRepository.save(user);
                return new ResponseEntity<>(savedUser, HttpStatus.OK);
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

            String filePath = uploadDir + File.separator + newFileName;

            try (InputStream inputStream = imageFile.getInputStream()) {
                Files.copy(inputStream, Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);
            }
            return filePath;
        }
        return null;
    }

    @Override
    public ResponseEntity<List<User>> getAllUsers(Pageable pageable) {
        try {

            Page<User> userList = userRepository.findAll(pageable);

            List<User> users = userList.getContent();

            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<User> getProfile(String id) {
        try {
            User user = userRepository.findById(id).get();
            if (user == null) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(user, HttpStatus.OK);
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
}
