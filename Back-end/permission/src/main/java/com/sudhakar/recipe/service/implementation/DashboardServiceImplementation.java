package com.sudhakar.recipe.service.implementation;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sudhakar.recipe.entity.Booking;
import com.sudhakar.recipe.entity.Status;
import com.sudhakar.recipe.repository.BookingRepository;
import com.sudhakar.recipe.repository.CategoryRepository;
import com.sudhakar.recipe.repository.CuisineRepository;
import com.sudhakar.recipe.repository.RecipeRepository;
import com.sudhakar.recipe.repository.ReportRepository;
import com.sudhakar.recipe.repository.UserRepository;
import com.sudhakar.recipe.service.DashboardService;

@Service
public class DashboardServiceImplementation implements DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private CuisineRepository cuisineRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReportRepository reportRepository;

    private int getAllUsersCount() {
        return userRepository.findAll().size();
    }

    private int getAllActiveUsersCount() {
        return userRepository.findByDeletedAtIsNull().size();
    }

    private int getAllBookingCount() {
        return bookingRepository.findAll().size();
    }

    private int getAllSuccessTransaction() {
        return bookingRepository.findByPaymentIdIsNotNull().size();
    }

    private int getTotalAmount() {
        List<Booking> bookings = bookingRepository.findAll();
        int total = 0;
        for (Booking booking : bookings) {
            total += (int) booking.getAmount();
        }
        return total;
    }

    private int getSuccessAmount() {
        List<Booking> bookings = bookingRepository.findByPaymentIdIsNotNull();
        int total = 0;
        for (Booking booking : bookings) {
            total += (int) booking.getAmount();
        }
        return total;
    }

    private int getRecipeCount() {
        return recipeRepository.findAll().size();
    }

    private int getCuisineCount() {
        return cuisineRepository.findAll().size();
    }

    private int getCategoryCount() {
        return categoryRepository.findAll().size();
    }

    private int getReportCount() {
        return reportRepository.findAll().size();
    }

    private int getReportStatusCount(Status status) {
        return reportRepository.findByStatus(status).size();
    }

    @Override
    public ResponseEntity<Map<String, Integer>> adminDashboardContent() {
        try {

            Map<String, Integer> adminMap = new LinkedHashMap<>();
            adminMap.put("Total Users", getAllUsersCount());
            adminMap.put("Active Account", getAllActiveUsersCount());
            adminMap.put("Deactivated Account", getAllUsersCount() - getAllActiveUsersCount());
            adminMap.put("Total Booking", getAllBookingCount());
            adminMap.put("Successful Booking", getAllSuccessTransaction());
            adminMap.put("Failed Booking", getAllBookingCount() - getAllSuccessTransaction());
            adminMap.put("Total Booking Amount", getTotalAmount());
            adminMap.put("Success Booking Amount", getSuccessAmount());
            adminMap.put("Failed Booking Amount", getTotalAmount() - getSuccessAmount());
            adminMap.put("Your Total Commission", getSuccessAmount() / 10);
            adminMap.put("Total Recipe Posted", getRecipeCount());

            adminMap.put("Total Cuisine", getCuisineCount());
            adminMap.put("Total Category", getCategoryCount());
            adminMap.put("Total Report", getReportCount());

            adminMap.put("Total Pending Report", getReportStatusCount(Status.PENDING));
            adminMap.put("Total Resolve Report", getReportStatusCount(Status.RESOLVE));
            adminMap.put("Total Reject Report", getReportStatusCount(Status.REJECT));

            return new ResponseEntity<>(adminMap, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Map<String, Integer>> moderatorDashboardContent() {
        try {
            Map<String, Integer> moderatorMap = new LinkedHashMap<>();
            moderatorMap.put("Total Report", getReportCount());

            moderatorMap.put("Total Pending Report", getReportStatusCount(Status.PENDING));
            moderatorMap.put("Total Resolve Report", getReportStatusCount(Status.RESOLVE));
            moderatorMap.put("Total Reject Report", getReportStatusCount(Status.REJECT));
            return new ResponseEntity<>(moderatorMap, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
