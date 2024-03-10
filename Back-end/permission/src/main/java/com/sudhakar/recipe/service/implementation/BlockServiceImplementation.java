package com.sudhakar.recipe.service.implementation;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.entity.Block;
import com.sudhakar.recipe.entity.Follow;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.repository.BlockRepository;
import com.sudhakar.recipe.repository.FollowRepository;
import com.sudhakar.recipe.repository.UserRepository;
import com.sudhakar.recipe.service.BlockService;

@Service
public class BlockServiceImplementation implements BlockService {

    @Autowired
    private BlockRepository blockRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;

    @Override
    public ResponseEntity<Void> blockUser(String blockingUserId, String blockedUserId) {
        try {
            Optional<User> existingBlockingUserOptional = userRepository.findById(blockingUserId);
            Optional<User> existingBlockedUserOptional = userRepository.findById(blockedUserId);

            if (existingBlockingUserOptional.isPresent() && existingBlockedUserOptional.isPresent()) {
                User blockingUser = existingBlockingUserOptional.get();
                User blockedUser = existingBlockedUserOptional.get();

                unFollow(blockedUser, blockingUser);

                Optional<Block> existingBlockOptional = blockRepository.findByBlockingUserAndBlockedUser(blockingUser,
                        blockedUser);

                if (existingBlockOptional.isPresent()) {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                } else {
                    blockRepository.save(new Block(blockingUser, blockedUser));
                    return new ResponseEntity<>(HttpStatus.OK);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<User>> getAllBlockedUserByUser(String userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                List<Block> blockedUserList = blockRepository.findByBlockingUser(user);
                List<User> blockList = blockedUserList.stream().map(Block::getBlockedUser).collect(Collectors.toList());
                return new ResponseEntity<>(blockList, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Void> unblockUser(String blockingUserId, String blockedUserId) {
        try {
            Optional<User> existingBlockingUserOptional = userRepository.findById(blockingUserId);
            Optional<User> existingBlockedUserOptional = userRepository.findById(blockedUserId);

            if (existingBlockingUserOptional.isPresent() && existingBlockedUserOptional.isPresent()) {
                Optional<Block> blockOptional = blockRepository.findByBlockingUserAndBlockedUser(
                        existingBlockingUserOptional.get(), existingBlockedUserOptional.get());

                if (blockOptional.isPresent()) {
                    blockRepository.delete(blockOptional.get());
                    return new ResponseEntity<>(HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void unFollow(User blockingUser, User blockedUser) {
        Optional<Follow> followOptional = followRepository.findByFollowerUserAndFollowingUser(blockingUser, blockedUser);

        if(followOptional.isPresent()) {
            followRepository.delete(followOptional.get());
        }

        followOptional = followRepository.findByFollowerUserAndFollowingUser(blockedUser, blockingUser);

        if (followOptional.isPresent()) {
            followRepository.delete(followOptional.get());
        }
    }
}
