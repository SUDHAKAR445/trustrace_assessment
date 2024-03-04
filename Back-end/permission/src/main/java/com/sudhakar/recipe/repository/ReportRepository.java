package com.sudhakar.recipe.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.sudhakar.recipe.entity.Report;
import com.sudhakar.recipe.entity.Status;

@Repository
public interface ReportRepository extends MongoRepository<Report, String> {

    Page<Report> findByRecipeIsNotNullOrderByReportedDateDesc(Pageable pageable);

    Page<Report> findByCommentIsNotNull(Pageable pageable);

    Page<Report> findByUserIsNotNull(Pageable pageable);

    List<Report> findByStatus(Status status);

    Page<Report> findByCommentIsNotNullOrderByReportedDateDesc(Pageable pageable);

    Page<Report> findByUserIsNotNullOrderByReportedDateDesc(Pageable pageable);

    @Query("{ 'comment' : { $ne: null }, 'status' : ?0, 'reportedDate' : { $gte: ?1, $lte: ?2 } }")
    Page<Report> findByCommentIsNotNullAndStatusAndReportedDateBetweenOrderByReportedDateDesc(Status status, Date startDate, Date endDate, Pageable pageable);

    @Query("{ 'user' : { $ne: null }, 'status' : ?0, 'reportedDate' : { $gte: ?1, $lte: ?2 } }")
    Page<Report> findByUserIsNotNullAndStatusAndReportedDateBetweenOrderByReportedDateDesc(Status status, Date startDate, Date endDate, Pageable pageable);

    @Query("{ 'recipe' : { $ne: null }, 'status' : ?0, 'reportedDate' : { $gte: ?1, $lte: ?2 } }")
    Page<Report> findByRecipeIsNotNullAndStatusAndReportedDateBetweenOrderByReportedDateDesc(Status status, Date startDate, Date endDate, Pageable pageable);
}
