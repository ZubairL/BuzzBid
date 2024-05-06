package com.BuzzBid.dao;

import com.BuzzBid.models.client.AuctionEndedItemResponse;
import com.BuzzBid.models.core.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GetAuctionEndedItem extends JpaRepository<Item, Integer>
{
    @Query(value="SELECT I.ItemID AS 'ItemID', " +
            "I.ItemName AS 'ItemName', " +
            "I.Description AS 'Description', " +
            "I.CategoryName AS 'CategoryName', " +
            "I.ItemCondition AS 'ItemCondition', " +
            "I.Returnable AS 'Returnable', " +
            "I.GetItNowPrice AS 'GetItNowPrice', " +
            "I.AuctionEndTime AS 'AuctionEndTime' " +
            "FROM Item I " +
            "WHERE I.ItemID=:itemID", nativeQuery = true)
    AuctionEndedItemResponse getAuctionEndedItem(@Param("itemID") int itemID);
}
