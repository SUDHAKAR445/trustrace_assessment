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
@Document(collection = "cuisines")
public class Cuisine {

    @Id
    private String id;

    @Field(name = "name")
    private String name;

    public Cuisine(String cuisine) {
        this.name = cuisine;
    }
}
