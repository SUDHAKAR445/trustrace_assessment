package com.sudhakar.recipe.service.implementation;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
    public ResponseEntity<String> createReport(Report report) {
        try {

            if (report.getReportedUser() == null && report.getReportedRecipe() == null
                    && report.getReportedComment() == null) {
                return new ResponseEntity<>("Missing of data", HttpStatus.BAD_REQUEST);
            }

            Optional<User> user = userRepository.findById(report.getReporterUser().getId());
            report.setReporterUser(user.get());
            report.setReportedDate(new Date());

            if (report.getReportedRecipe() != null) {
                Optional<Recipe> recipe = recipeRepository.findById(report.getReportedRecipe().getId());
                if (recipe.isPresent()) {
                    report.setReportedRecipe(recipe.get());
                    reportRepository.save(report);
                    return new ResponseEntity<>("Recipe reported successfully", HttpStatus.OK);
                }
                return new ResponseEntity<>("Recipe does not exists", HttpStatus.BAD_REQUEST);
            }

            if (report.getReportedComment() != null) {
                Optional<Comment> comment = commentRepository.findById(report.getReportedComment().getId());
                if (comment.isPresent()) {
                    report.setReportedComment(comment.get());
                    reportRepository.save(report);
                    return new ResponseEntity<>("Comment reported successfully", HttpStatus.OK);
                }
                return new ResponseEntity<>("Comment does not exists", HttpStatus.BAD_REQUEST);
            }

            if (report.getReportedUser() != null) {
                Optional<User> reportedUser = userRepository.findById(report.getReportedUser().getId());
                if (reportedUser.isPresent()) {
                    report.setReportedUser(reportedUser.get());
                    reportRepository.save(report);
                    return new ResponseEntity<>("User reported successfully", HttpStatus.OK);
                }
                return new ResponseEntity<>("User does not exists", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("Missing of data for reporting", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Problem in reporting", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> updateStatusOfReport(String reportId, String status) {
        try{
            Optional<Report> reportOptional = reportRepository.findById(reportId);
            if(reportOptional.isPresent()) {
                Report report = reportOptional.get();
                if(status.toLowerCase().compareTo("reject") == 1) {
                    report.setStatus(Status.REJECT);
                } else {
                    report.setStatus(Status.RESOLVE);
                }
                reportRepository.save(report);
                return new ResponseEntity<>("Status updated successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("Report does not exists", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Problem in updating the status", HttpStatus.INTERNAL_SERVER_ERROR);
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
    public ResponseEntity<List<Report>> getAllReport(Pageable pageable) {
        try {
            Page<Report> reportList = reportRepository.findAll(PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()));
            List<Report> reports = reportList.getContent();
            if(!reports.isEmpty()) {
                return new ResponseEntity<>(reports, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // @Override
    // public ResponseEntity<List<Report>> getReportByUserIdOrRecipeIdOrCommentIdOrUsername(String input, Pageable pageable) {
    //     try{

    //     }
    // }
}
