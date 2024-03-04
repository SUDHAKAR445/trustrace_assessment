package com.sudhakar.recipe.filters;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.dto.RecipeDto;

public interface RecipeFilterDao {

    ResponseEntity<Page<RecipeDto>> searchRecipeWithCriteria(String searchText, String cuisineName,
            String categoryName, Date startDate, Date endDate, Pageable pageable);
}
