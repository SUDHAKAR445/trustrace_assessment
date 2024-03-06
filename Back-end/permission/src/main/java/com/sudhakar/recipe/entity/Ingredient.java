package com.sudhakar.recipe.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "ingredients")
public class  Ingredient {

    @Id
    private String id;

    @Field(name = "name")
    private String name;

    @Field(name = "quantity")
    private double quantity;

    @Field(name = "unit_of_measurement")
    private String unitOfMeasurement;
}
