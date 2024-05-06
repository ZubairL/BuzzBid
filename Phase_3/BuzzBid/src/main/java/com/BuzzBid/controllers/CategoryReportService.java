package com.BuzzBid.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@Service
public class CategoryReportService {
    @Autowired
    private JdbcTemplate categoryReport;
    @GetMapping("/categoryReport")
    public List<Map<String, Object>> generateReport() {
        String query="SELECT I.CategoryName AS 'Category'," +
                           "COUNT(I.ItemID) AS 'Total Items'," +
                          "MIN(I.GetItNowPrice) AS 'Min Price'," +
                           "MAX(I.GetItNowPrice) AS 'Max Price'," +
                          "AVG(I.GetItNowPrice) AS 'Average Price' " +
                           "FROM Item I " + "WHERE I.CancelledDate IS NULL " +
                           "GROUP BY I.CategoryName " +
                           "ORDER BY I.CategoryName ASC";
        return categoryReport.queryForList(query);
    }

}
