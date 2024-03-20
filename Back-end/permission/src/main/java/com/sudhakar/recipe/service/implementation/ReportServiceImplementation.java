package com.sudhakar.recipe.service.implementation;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.dto.ReportBody;
import com.sudhakar.recipe.dto.ReportDto;
import com.sudhakar.recipe.entity.Comment;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.entity.Report;
import com.sudhakar.recipe.entity.Status;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.repository.CommentRepository;
import com.sudhakar.recipe.repository.RecipeRepository;
import com.sudhakar.recipe.repository.ReportRepository;
import com.sudhakar.recipe.repository.UserRepository;
import com.sudhakar.recipe.service.ReportService;

@Service
public class ReportServiceImplementation implements ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Override
    public ResponseEntity<Void> createCommentReport(String reporterId, ReportBody report) {
        try {
            Optional<Comment> commentOptional = commentRepository.findById(report.getReportedId());
            Optional<User> reporterUserOptional = userRepository.findById(reporterId);
            if(commentOptional.isPresent() && reporterUserOptional.isPresent()) {
                Report createReport = new Report();
                createReport.setReportText(report.getText());
                createReport.setComment(commentOptional.get());
                createReport.setReporterUser(reporterUserOptional.get());
                createReport.setReportedDate(new Date());
                createReport.setStatus(Status.PENDING);

                reportRepository.save(createReport);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Void> createUserReport(String reporterId, ReportBody report) {
        try {
            Optional<User> userOptional = userRepository.findById(report.getReportedId());
            Optional<User> reporterUserOptional = userRepository.findById(reporterId);
            if(userOptional.isPresent() && reporterUserOptional.isPresent()) {
                Report createReport = new Report();
                createReport.setReportText(report.getText());
                createReport.setUser(userOptional.get());
                createReport.setReporterUser(reporterUserOptional.get());
                createReport.setReportedDate(new Date());
                createReport.setStatus(Status.PENDING);

                reportRepository.save(createReport);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Void> createRecipeReport(String reporterId, ReportBody report) {
        try {
            Optional<Recipe> recipeOptional = recipeRepository.findById(report.getReportedId());
            Optional<User> reporterUserOptional = userRepository.findById(reporterId);
            if(recipeOptional.isPresent() && reporterUserOptional.isPresent()) {
                Report createReport = new Report();
                createReport.setReportText(report.getText());
                createReport.setRecipe(recipeOptional.get());
                createReport.setReporterUser(reporterUserOptional.get());
                createReport.setReportedDate(new Date());
                createReport.setStatus(Status.PENDING);

                reportRepository.save(createReport);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Void> updateStatusOfReport(String reportId, String status) {
        try{
            Optional<Report> reportOptional = reportRepository.findById(reportId);
            System.out.println(status);
            if(reportOptional.isPresent()) {
                Report report = reportOptional.get();
                if(status.equalsIgnoreCase("reject")) {
                    report.setStatus(Status.REJECT);
                } else if (status.equalsIgnoreCase("resolve")) {
                    report.setStatus(Status.RESOLVE);
                } else {
                    report.setStatus(Status.PENDING);
                }
                report = reportRepository.save(report);
                // System.out.println(report);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> deleteReport(String reportId) {
        try {
            Optional<Report> reportOptional = reportRepository.findById(reportId);
            if(reportOptional.isPresent()) {
                reportRepository.delete(reportOptional.get());
                return new ResponseEntity<>("Report deleted successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("Report does not exists", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Problem in deleting the report", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Page<ReportDto>> getAllRecipeReport(Pageable pageable) {
        try {
            Page<Report> reports =  reportRepository.findByRecipeIsNotNullOrderByReportedDateDesc(pageable);
            return new ResponseEntity<>(reports.map(this::convertToDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Page<ReportDto>> getAllCommentReport(Pageable pageable) {
        try {
            Page<Report> reports = reportRepository.findByCommentIsNotNullOrderByReportedDateDesc(pageable);
            return new ResponseEntity<>(reports.map(this::convertToDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Page<ReportDto>> getAllUserReport(Pageable pageable) {
        try {
            Page<Report> reports = reportRepository.findByUserIsNotNullOrderByReportedDateDesc(pageable);
            return new ResponseEntity<>(reports.map(this::convertToDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<ReportDto> getReportById(String id) {
        try {
            Optional<Report> reportOptional = reportRepository.findById(id);
            if(reportOptional.isPresent()) {
                return new ResponseEntity<>(convertToDto(reportOptional.get()), HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
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
        
        if(report.getComment() != null) {
            reportDto.setCommentId(report.getComment().getId());
            reportDto.setCommentText(report.getComment().getText());
            reportDto.setCommentUserId(report.getComment().getUser());
            User user = userRepository.findById(report.getComment().getUser()).get();
            reportDto.setCommentUsername(user.getUsernameValue());
            reportDto.setCommentUserProfileImage(user.getProfileImageUrl());
        }

        if(report.getRecipe() != null) {
            Recipe recipe = report.getRecipe();
            reportDto.setRecipeId(recipe.getId());
            reportDto.setRecipeTitle(recipe.getTitle());
            reportDto.setRecipeUserId(recipe.getUser().getId());
            reportDto.setRecipeUsername(recipe.getUser().getUsernameValue());
            reportDto.setRecipeUserProfileImage(recipe.getUser().getProfileImageUrl());
        }

        if(report.getUser() != null) {
            User user = report.getUser();
            reportDto.setReportedUserId(user.getId());
            reportDto.setReportedUserImage(user.getProfileImageUrl());
            reportDto.setReportedUsername(user.getUsernameValue());
        }

        return reportDto;
    }
}
