package com.BuzzBid.dao;
import java.util.Optional;

import com.BuzzBid.models.core.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GetItem extends JpaRepository<Item, Integer> {
    @Query(
            nativeQuery = true,
            value = "SELECT ItemID, ItemName, Description, CategoryName, ItemCondition, Returnable, MinimumSalePrice, StartingBid, GetItNowPrice, AuctionEndTime, CancelledDate, CancelledReason, ListedByUser FROM Item WHERE ItemID = :itemID")
    Optional<Item> getItem(@Param("itemID") int itemID);
}
