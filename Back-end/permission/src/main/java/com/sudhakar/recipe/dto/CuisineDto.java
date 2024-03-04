package com.sudhakar.recipe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class CuisineDto {
    private String id;
    private String name;
    private int count;
}
