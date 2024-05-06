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
public class TopRatedReportServices {
    @Autowired
    private JdbcTemplate topRatedReport;
    @GetMapping("/topRatedReport")
    public List<Map<String, Object>> generateReport() {
        String query="SELECT I.ItemName AS 'Item Name', ROUND(AVG(R.NumberOfStars),1) AS 'Average Rating',Count(R.ItemID) AS 'Rating Count' " +
                "FROM Item I INNER JOIN Rating R ON I.ItemID=R.ItemID " +
                "GROUP BY I.ItemName " +
                "ORDER BY ROUND(AVG(R.NumberOfStars),1) DESC, I.ItemName ASC " +
                "LIMIT 10";
        return topRatedReport.queryForList(query);
    }
}
