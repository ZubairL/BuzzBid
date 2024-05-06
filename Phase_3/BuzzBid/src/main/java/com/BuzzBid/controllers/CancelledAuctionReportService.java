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
public class CancelledAuctionReportService {
    @Autowired
    private JdbcTemplate cancelledAuctionReport;
    @GetMapping("/cancelledAuctionReport")
    public List<Map<String, Object>> generateReport() {
        String query="SELECT ItemID AS 'ID', " +
                "ListedByUser AS 'Listed by', " +
                "CONVERT_TZ(CancelledDate,'+00:00','-07:00') AS 'Cancelled Date', " +
                "CancelledReason AS 'Reason' " +
                "FROM Item where CancelledDate IS NOT NULL " +
                "ORDER BY ItemID DESC";
        return cancelledAuctionReport.queryForList(query);
    }
}
