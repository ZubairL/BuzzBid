package com.BuzzBid.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class GetAuctionResultsController {
    @Autowired
    private JdbcTemplate auctionResults;
    @GetMapping("/auctionResults")
    public List<Map<String, Object>> getAuctionResults() {
        String query="WITH SaleDeterminant(ItemID,SaleAmount,Winner) AS (SELECT B.ItemID,B.BidAmount, B.Username FROM Bid B WHERE B.BidAmount =(SELECT Max(Bid.BidAmount) FROM Item INNER JOIN Bid ON " +
                "Item.ItemID=Bid.ItemID " +
                "WHERE Item.AuctionEndTime<utc_timestamp() AND Bid.ItemID=B.ItemID " +
                "Group BY Bid.ItemID) ) " +
                "SELECT I.ItemID AS 'ID', " +
                "I.ItemName AS 'Item Name', " +
                "CASE WHEN I.CancelledDate IS NULL AND S.SaleAmount>=I.MinimumSalePrice THEN S.SaleAmount " +
                "ELSE '-' " +
                "END AS 'Sale Price', " +
                "CASE WHEN I.CancelledDate IS NOT NULL THEN 'Cancelled' " +
                "WHEN I.CancelledDate IS NULL AND S.SaleAmount>=I.MinimumSalePrice THEN S.Winner " +
                "ELSE '-' " +
                "END AS 'Winner', " +
                "CASE WHEN I.CancelledDate IS NULL THEN CONVERT_TZ(I.AuctionEndTime,'+00:00','-07:00') " +
                "WHEN I.CancelledDate IS NOT NULL THEN CONVERT_TZ(I.CancelledDate,'+00:00','-07:00') " +
                "ELSE '-' " +
                "END AS AuctionEnded " +
                "FROM Item AS I LEFT JOIN SaleDeterminant AS S " +
                "ON I.ItemID=S.ItemID " +
                "WHERE I.AuctionEndTime<utc_timestamp() " +
                "ORDER BY AuctionEnded DESC";
        return auctionResults.queryForList(query);
    }

}
