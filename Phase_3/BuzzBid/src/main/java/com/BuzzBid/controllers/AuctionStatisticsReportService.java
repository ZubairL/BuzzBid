package com.BuzzBid.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@Service
public class AuctionStatisticsReportService {
    @Autowired
    private JdbcTemplate auctionReport;
    @GetMapping("/auctionStatisticsReport")
    public List<Map<String, Object>> generateReport() {
        List<Map<String,Object>> results=new ArrayList<>();

        String auctionActive="SELECT COUNT(ItemID) AS 'Auctions Active' " +
                "FROM Item " +
                "WHERE AuctionEndTime> utc_timestamp() AND " +
                "CancelledDate IS NULL";
        for(Map<String, Object> map:auctionReport.queryForList(auctionActive))
            results.add(map);
        String auctionFinished="SELECT COUNT(ItemID) AS 'Auctions Finished' " +
                "FROM Item " +
                "WHERE AuctionEndTime<=utc_timestamp() AND " +
                "CancelledDate IS NULL";
        for(Map<String, Object> map:auctionReport.queryForList(auctionFinished))
            results.add(map);
        String auctionWon="WITH Won_Items(Username,ItemID) AS " +
                "(SELECT B.Username,B.ItemID " +
                "FROM Bid B " +
                "WHERE B.BidAmount =(SELECT Max(Bid.BidAmount) " +
                "FROM Bid INNER JOIN Item ON " +
                "Bid.ItemID=Item.ItemID " +
                "WHERE Item.AuctionEndTime<utc_timestamp() AND Bid.ItemID=B.ItemID AND Item.CancelledDate IS NULL AND Bid.BidAmount>=Item.MinimumSalePrice " +
                "Group BY Bid.ItemID)) " +
                "SELECT COUNT(ItemID) AS 'Auctions Won' FROM Won_Items";
        for(Map<String, Object> map:auctionReport.queryForList(auctionWon))
            results.add(map);
        String auctionCancelled="SELECT COUNT(ItemID) AS 'Auctions Canceled' " +
                "FROM Item " +
                "WHERE CancelledDate IS NOT NULL";
        for(Map<String, Object> map:auctionReport.queryForList(auctionCancelled))
            results.add(map);
        String itemsRated="SELECT COUNT(ItemID) AS 'Items Rated' " +
                "FROM Rating;";
        for(Map<String, Object> map:auctionReport.queryForList(itemsRated))
            results.add(map);
        String itemsNotRated="WITH Won_Items(Username,ItemID) AS " +
                "(SELECT B.Username,B.ItemID " +
                "FROM Bid B " +
                "WHERE B.BidAmount =(SELECT Max(Bid.BidAmount) FROM Bid " +
                "INNER JOIN Item ON " +
                "Bid.ItemID=Item.ItemID " +
                "WHERE Item.AuctionEndTime<utc_timestamp() " +
                "AND Bid.ItemID=B.ItemID AND Item.CancelledDate IS NULL AND Bid.BidAmount>=Item.MinimumSalePrice " +
                "Group BY Bid.ItemID)) " +
                "SELECT COUNT(I.ItemID) AS 'Items Not Rated' " +
                "FROM Item I INNER JOIN Won_Items W " +
                "ON I.ItemID=W.ItemID " +
                "WHERE I.ItemID NOT IN " +
                "(SELECT R.ItemID " +
                "FROM Rating R)";
        for(Map<String, Object> map:auctionReport.queryForList(itemsNotRated))
            results.add(map);

        return results;

    }
}
