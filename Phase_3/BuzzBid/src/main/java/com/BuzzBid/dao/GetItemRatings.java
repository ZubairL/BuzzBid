package com.BuzzBid.dao;

import java.util.List;

import com.BuzzBid.models.client.ItemRatings;
import com.BuzzBid.models.core.Rating;
import com.BuzzBid.models.core.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GetItemRatings extends JpaRepository<Rating, Integer>{
    @Query(value = "WITH SaleDeterminant(ItemID, SaleAmount, Winner) AS (SELECT B.ItemID, B.BidAmount, B.Username " +
            "FROM Bid B WHERE B.BidAmount = (SELECT Max(Bid.BidAmount) " +
            "FROM Item " +
            "INNER JOIN Bid ON Item.ItemID=Bid.ItemID " +
            "WHERE Item.AuctionEndTime<utc_timestamp() AND Bid.ItemID=B.ItemID " +
            "AND Bid.BidAmount >= Item.MinimumSalePrice " +
            "GROUP BY Bid.ItemID)) " +
            "SELECT I.ItemID AS 'ItemID', " +
            "I.ItemName AS 'ItemName', " +
            "AvgRating AS 'AverageRating', " +
            "R.DateAndTime AS 'Date', R.Reviews, R.NumberOfStars, SaleDeterminant.Winner " +
            "FROM Item I " +
            "INNER JOIN SaleDeterminant ON SaleDeterminant.ItemID = I.ItemID " +
            "INNER JOIN Rating R ON R.ItemID = I.ItemID " +
            "INNER JOIN " +
            "(SELECT ItemName, ROUND(AVG(NumberOfStars), 1) AS AvgRating " +
            "FROM Item I " +
            "INNER JOIN Rating R ON R.ItemID = I.ItemID " +
            "GROUP BY ItemName) AS AvgRatings ON AvgRatings.ItemName = I.ItemName " +
            "WHERE I.ItemName = :ItemName " +
            "ORDER BY R.DateAndTime DESC", nativeQuery = true)
   List<ItemRatings> getItemRatings(@Param("ItemName") String ItemName);
}
