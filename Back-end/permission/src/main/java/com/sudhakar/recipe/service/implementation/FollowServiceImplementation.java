package com.sudhakar.recipe.service.implementation;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.entity.Follow;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.repository.FollowRepository;
import com.sudhakar.recipe.repository.UserRepository;
import com.sudhakar.recipe.service.FollowService;

@Service
public class FollowServiceImplementation implements FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ResponseEntity<Void> followRequest(String followerUser, String followingUser) {
        try {
            Optional<User> existingFollowerUser = userRepository.findById(followerUser);
            Optional<User> existingFollowingUser = userRepository.findById(followingUser);

            if (existingFollowerUser.isPresent() && existingFollowingUser.isPresent()) {
                Follow newFollow = new Follow(existingFollowerUser.get(), existingFollowingUser.get());
                followRepository.save(newFollow);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Void> unFollowRequest(String followerUser, String followingUser) {
        try {
            Optional<User> existingFollowerUser = userRepository.findById(followerUser);
            Optional<User> existingFollowingUser = userRepository.findById(followingUser);

            if (existingFollowerUser.isPresent() && existingFollowingUser.isPresent()) {
                Optional<Follow> followOptional = followRepository.findByFollowerUserAndFollowingUser(
                        existingFollowerUser.get(), existingFollowingUser.get());

                if (followOptional.isPresent()) {
                    followRepository.delete(followOptional.get());
                    return new ResponseEntity<>(HttpStatus.OK);
                }
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<User>> getAllFollowingByUser(String userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                List<Follow> followingUserList = followRepository.findByFollowingUser(user);
                List<User> followingList = followingUserList.stream().map(Follow::getFollowerUser)
                        .collect(Collectors.toList());
                return new ResponseEntity<>(followingList, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<User>> getAllFollowersByUser(String userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if(userOptional.isPresent()) {
                User user = userOptional.get();
                List<Follow> followerUserList = followRepository.findByFollowerUser(user);
                List<User> followerList = followerUserList.stream().map(Follow::getFollowerUser)
                        .collect(Collectors.toList());
                return new ResponseEntity<>(followerList, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
