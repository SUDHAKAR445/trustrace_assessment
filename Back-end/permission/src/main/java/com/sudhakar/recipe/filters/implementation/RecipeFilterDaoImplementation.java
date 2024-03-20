package com.sudhakar.recipe.filters.implementation;

import java.util.Date;
import java.util.HashSet;
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

import com.sudhakar.recipe.dto.RecipeDto;
import com.sudhakar.recipe.entity.Category;
import com.sudhakar.recipe.entity.Cuisine;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.filters.RecipeFilterDao;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecipeFilterDaoImplementation implements RecipeFilterDao {

    private final MongoTemplate mongoTemplate;

    @Override
    public ResponseEntity<Page<RecipeDto>> searchRecipeWithCriteria(String searchText, String cuisineName,
            String categoryName, Date startDate, Date endDate, Pageable pageable) {
        try {
            Query query = new Query();

            if (StringUtils.hasText(searchText)) {
                Criteria textCriteria = new Criteria().orOperator(
                        // Criteria.where("user.usernameValue").regex(searchText, "i"),
                        Criteria.where("title").regex(searchText, "i"));

                query.addCriteria(textCriteria);

            }

            query.addCriteria(Criteria.where("deletedAt").is(null));
            
            if (StringUtils.hasText(cuisineName)) {
                Cuisine cuisine = findCuisineByName(cuisineName);
                if (cuisine != null) {
                    query.addCriteria(Criteria.where("cuisine").is(cuisine));
                }
            }

            if (StringUtils.hasText(categoryName)) {
                Category category = findCategoryByName(categoryName);
                if (category != null) {
                    query.addCriteria(Criteria.where("category").is(category));
                }
            }

            if (startDate != null && endDate != null) {
                System.out.println();
                
                Criteria dateCriteria = Criteria.where("dateCreated").gte(startDate).lte(endDate);
                query.addCriteria(dateCriteria);
            }

            long count = mongoTemplate.count(query, User.class);
            List<Recipe> recipes = mongoTemplate.find(query.with(pageable).with(Sort.by(Sort.Direction.ASC, "dateCreated")), Recipe.class);

            Page<Recipe> recipesList = new PageImpl<>(recipes, pageable, count);

            return new ResponseEntity<>(recipesList.map(this::convertDto), HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Cuisine findCuisineByName(String cuisineName) {
        Query cuisineQuery = new Query(Criteria.where("name").is(cuisineName));
        return mongoTemplate.findOne(cuisineQuery, Cuisine.class);
    }

    private Category findCategoryByName(String categoryName) {
        Query categoryQuery = new Query(Criteria.where("name").is(categoryName));
        return mongoTemplate.findOne(categoryQuery, Category.class);
    }

    private RecipeDto convertDto(Recipe recipe) {
        RecipeDto recipeDto = new RecipeDto();
        recipeDto.setRecipeId(recipe.getId());
        recipeDto.setTitle(recipe.getTitle());
        recipeDto.setDateCreated(recipe.getDateCreated());
        recipeDto.setDeletedAt(recipe.getDeletedAt());
        recipeDto.setCategory(recipe.getCategory().getName());
        recipeDto.setCuisine(recipe.getCuisine().getName());
        recipeDto.setUserId(recipe.getUser().getId());
        recipeDto.setUsername(recipe.getUser().getUsernameValue());
        recipeDto.setProfileImageUrl(recipe.getUser().getProfileImageUrl());
        recipeDto.setDescription(recipe.getDescription());
        recipeDto.setRecipeImageUrl(recipe.getPhoto());
        recipeDto.setVideo(recipe.getVideo());
        recipeDto.setLikes(recipe.getLikes() == null ? new HashSet<>() : recipe.getLikes());

        return recipeDto;
    }
}
