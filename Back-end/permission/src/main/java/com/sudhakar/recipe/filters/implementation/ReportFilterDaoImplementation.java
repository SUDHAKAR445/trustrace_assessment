package com.sudhakar.recipe.filters.implementation;

import java.util.Calendar;
import java.util.Date;
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

import com.sudhakar.recipe.dto.ReportDto;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.entity.Report;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.filters.ReportFilterDao;
import com.sudhakar.recipe.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ReportFilterDaoImplementation implements ReportFilterDao {

    private final MongoTemplate mongoTemplate;
    private final UserRepository userRepository;

    public ResponseEntity<Page<ReportDto>> getAllCommentReportWithStatus(String searchText, String status, Date startDate, Date endDate,
            Pageable pageable) {

        try {
            Query query = new Query();

            query.addCriteria(Criteria.where("comment").ne(null));

            if (StringUtils.hasText(status)) {
                query.addCriteria(Criteria.where("status").regex(status, "i"));
            }

            if (StringUtils.hasText(searchText)) {
                query.addCriteria(Criteria.where("reportText").regex(searchText, "i"));
            }

            if (startDate != null && endDate != null) {
                System.out.println();

                Criteria dateCriteria = Criteria.where("reportedDate").gte(startDate).lte(endDate);
                query.addCriteria(dateCriteria);
            }

            long count = mongoTemplate.count(query, Report.class);
            List<Report> reports = mongoTemplate.find(query.with(pageable).with(Sort.by(Sort.Direction.ASC, "reportedDate")), Report.class);
            Page<Report> reportsList = new PageImpl<>(reports, pageable, count);

            return new ResponseEntity<>(reportsList.map(this::convertToDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Page<ReportDto>> getAllUserReportWithStatus(String searchText, String status, Date startDate, Date endDate,
            Pageable pageable) {

        try {
            Query query = new Query();

            query.addCriteria(Criteria.where("user").ne(null));

            if (StringUtils.hasText(status)) {
                query.addCriteria(Criteria.where("status").regex(status, "i"));
            }

            if (StringUtils.hasText(searchText)) {
                query.addCriteria(Criteria.where("reportText").regex(searchText, "i"));
            }

            if (startDate != null && endDate != null) {
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(endDate);
                calendar.add(Calendar.DAY_OF_MONTH, 1);
                endDate = calendar.getTime();
                Criteria dateCriteria = Criteria.where("reportedDate").gte(startDate).lte(endDate);
                query.addCriteria(dateCriteria);
            }

            long count = mongoTemplate.count(query, Report.class);
            List<Report> reports = mongoTemplate.find(query.with(pageable).with(Sort.by(Sort.Direction.ASC, "reportedDate")), Report.class);
            Page<Report> reportsList = new PageImpl<>(reports, pageable, count);

            return new ResponseEntity<>(reportsList.map(this::convertToDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Page<ReportDto>> getAllRecipeReportWithStatus(String searchText, String status, Date startDate, Date endDate,
            Pageable pageable) {

        try {
            Query query = new Query();

            query.addCriteria(Criteria.where("recipe").ne(null));

            if (StringUtils.hasText(status)) {
                query.addCriteria(Criteria.where("status").regex(status, "i"));
            }

            if (StringUtils.hasText(searchText)) {
                query.addCriteria(Criteria.where("reportText").regex(searchText, "i"));
            }

            if (startDate != null && endDate != null) {
                Criteria dateCriteria = Criteria.where("reportedDate").gte(startDate).lte(endDate);
                query.addCriteria(dateCriteria);
            }

            long count = mongoTemplate.count(query, Report.class);
            List<Report> reports = mongoTemplate.find(query.with(pageable).with(Sort.by(Sort.Direction.ASC, "reportedDate")), Report.class);
            Page<Report> reportsList = new PageImpl<>(reports, pageable, count);

            return new ResponseEntity<>(reportsList.map(this::convertToDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private ReportDto convertToDto(Report report) {

        ReportDto reportDto = new ReportDto();
        reportDto.setId(report.getId());
        reportDto.setReportText(report.getReportText());
        reportDto.setReportedDate(report.getReportedDate());
        reportDto.setStatus(report.getStatus());
        reportDto.setReporterUserId(report.getReporterUser().getId());
        reportDto.setReporterUsername(report.getReporterUser().getUsernameValue());
        reportDto.setReporterUserImage(report.getReporterUser().getProfileImageUrl());

        if (report.getComment() != null) {
            reportDto.setCommentId(report.getComment().getId());
            reportDto.setCommentText(report.getComment().getText());
            reportDto.setCommentUserId(report.getComment().getUser());
            User user = userRepository.findById(report.getComment().getUser()).get();
            reportDto.setCommentUsername(user.getUsernameValue());
            reportDto.setCommentUserProfileImage(user.getProfileImageUrl());
        }

        if (report.getRecipe() != null) {
            Recipe recipe = report.getRecipe();
            reportDto.setRecipeId(recipe.getId());
            reportDto.setRecipeTitle(recipe.getTitle());
            reportDto.setRecipeUserId(recipe.getUser().getId());
            reportDto.setRecipeUsername(recipe.getUser().getUsernameValue());
            reportDto.setRecipeUserProfileImage(recipe.getUser().getProfileImageUrl());
        }

        if (report.getUser() != null) {
            User user = report.getUser();
            reportDto.setReportedUserId(user.getId());
            reportDto.setReportedUserImage(user.getProfileImageUrl());
            reportDto.setReportedUsername(user.getUsernameValue());
        }

        return reportDto;
    }
}
