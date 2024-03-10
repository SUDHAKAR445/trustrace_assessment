package com.sudhakar.recipe.filters;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.sudhakar.recipe.dto.ReportDto;

public interface ReportFilterDao {

        ResponseEntity<Page<ReportDto>> getAllRecipeReportWithStatus(String searchText, String status, Date startDate,
                        Date endDate,
                        Pageable pageable);

        ResponseEntity<Page<ReportDto>> getAllCommentReportWithStatus(String searchText, String status, Date startDate,
                        Date endDate,
                        Pageable pageable);

        ResponseEntity<Page<ReportDto>> getAllUserReportWithStatus(String searchText, String status, Date startDate,
                        Date endDate,
                        Pageable pageable);
}
