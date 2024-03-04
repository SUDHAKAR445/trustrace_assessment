package com.sudhakar.recipe.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reports")
public class Report {

    @Id
    private String id;

    @Field(name = "report_text")
    private String reportText;

    @Field(name = "reported_date")
    private Date reportedDate;

    @Field(name = "report_status")
    private Status status;

    @DBRef
    @Field(name = "reporter_user_ref")
    private User reporterUser;

    @DBRef
    @Field(name = "reported_comment_ref")
    private Comment comment;

    @DBRef
    @Field(name = "reported_recipe_ref")
    private Recipe recipe;

    @DBRef
    @Field(name = "reported_user_ref")
    private User user;

}
