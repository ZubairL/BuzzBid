package com.BuzzBid.dao;

import com.BuzzBid.models.client.SearchResultsResponse;
import com.BuzzBid.models.core.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GetSearchResults extends JpaRepository<Item,Integer> {
    @Query(value= "SELECT " +
            "I.ItemID AS 'ItemID', " +
            "I.ItemName AS 'ItemName', " +
            "CASE " +
            "WHEN B.BidAmount IS NULL THEN coalesce(B.BidAmount,'-') " +
            "ELSE coalesce(B.BidAmount,'-') " +
            "END AS 'CurrentBid', " +
            "coalesce(B.Username,'-') AS 'HighestBidder', " +
            "coalesce(I.GetItNowPrice,'-') AS 'GetItNowPrice', " +
            "I.AuctionEndTime AS 'AuctionEnds' " +
            "FROM Item AS I " +
            "LEFT JOIN (Bid AS B " +
            "INNER JOIN (" +
            "SELECT ItemID, MAX(BidAmount) AS MaxBidValue " +
            "FROM Bid " +
            "GROUP BY ItemId " +
            ") AS MaxBids ON B.ItemID = MaxBids.ItemID) ON I.ItemID=B.ItemID " +
            " AND B.BidAmount =  MaxBids.MaxBidValue " +
            "WHERE " +
            "(I.ItemName LIKE :keyword OR I.Description LIKE :keyword) AND I.CategoryName LIKE :categoryName AND " +
            "I.ItemCondition+0 <= FIELD(:condition, 'New', 'Very Good', 'Good', 'Fair', 'Poor', '') AND " +
            "CASE WHEN B.BidAmount IS NULL THEN (I.StartingBid >= :minPrice AND I.StartingBid <= :maxPrice) " +
            "ELSE (coalesce(B.BidAmount,0) >= :minPrice AND coalesce(B.BidAmount,0) <= :maxPrice) END AND "+
            "I.CancelledDate IS NULL AND I.AuctionEndTime > utc_timestamp() ORDER BY I.AuctionEndTime ASC",nativeQuery = true)
    List<SearchResultsResponse> getSearchResults(@Param("keyword") String keyword,
                                                 @Param("categoryName") String categoryName,
                                                 @Param("minPrice") float minPrice,
                                                 @Param("maxPrice") float maxPrice,
                                                 @Param("condition") String condition);
}
