package com.sudhakar.recipe.filters.implementation;

import java.util.List;

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

import com.sudhakar.recipe.dto.UserResponseDto;
import com.sudhakar.recipe.entity.Role;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.filters.UserFilterDao;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserFilterDaoImplementation implements UserFilterDao {

    private final MongoTemplate mongoTemplate;

    public ResponseEntity<Page<UserResponseDto>> searchUsersWithCriteria(String searchText, String roleName,
            String gender, Pageable pageable) {

        try {

            Query query = new Query();

            if (StringUtils.hasText(searchText)) {

                Criteria textCriteria = new Criteria().orOperator(
                        Criteria.where("usernameValue").regex(searchText, "i"),
                        Criteria.where("email").regex(searchText, "i"),
                        Criteria.where("firstName").regex(searchText, "i"),
                        Criteria.where("lastName").regex(searchText, "i"));

                query.addCriteria(textCriteria);
            }

            if (StringUtils.hasText(roleName)) {
                Role role = findRoleByName(roleName);
                if (role != null) {
                    query.addCriteria(Criteria.where("role").is(role));
                }
            }

            if (StringUtils.hasText(gender)) {
                query.addCriteria(Criteria.where("gender").is(gender));
            }

            long count = mongoTemplate.count(query, User.class);
            List<User> users = mongoTemplate.find(query.with(pageable).with(Sort.by(Sort.Direction.ASC, "createdAt")), User.class);

            Page<User> usersList = new PageImpl<>(users, pageable, count);

            return new ResponseEntity<>(usersList.map(this::convertToUserDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Role findRoleByName(String roleName) {
        Query roleQuery = new Query(Criteria.where("roleName").is(roleName));
        return mongoTemplate.findOne(roleQuery, Role.class);
    }

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
}
