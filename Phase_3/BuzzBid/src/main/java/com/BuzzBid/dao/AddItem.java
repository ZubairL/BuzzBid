package com.BuzzBid.dao;

import com.BuzzBid.models.core.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.BuzzBid.models.core.ItemCondition;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface AddItem extends JpaRepository<Item, Integer> {
    @Modifying
    @Transactional
    @Query(
            nativeQuery = true,
            value = "INSERT INTO Item (itemName, description, itemCondition, returnable, startingBid, minimumSalePrice, getItNowPrice, auctionEndTime, cancelledDate, cancelledReason, categoryName, listedByUser) " +
                    "VALUES (:itemName, :description, :itemCondition, :returnable, :startingBid, :minimumSalePrice, :getItNowPrice, :auctionEndTime, :cancelledDate, :cancelledReason, :categoryName, :listedByUser)"
    )
    void addItem(
            @Param("itemName") String itemName,
            @Param("description") String description,
            @Param("itemCondition") String itemCondition,
            @Param("returnable") boolean returnable,
            @Param("startingBid") double startingBid,
            @Param("minimumSalePrice") double minimumSalePrice,
            @Param("getItNowPrice") Float getItNowPrice,
            @Param("auctionEndTime") String auctionEndTime,
            @Param("cancelledDate") String cancelledDate,
            @Param("cancelledReason") String cancelledReason,
            @Param("categoryName") String categoryName,
            @Param("listedByUser") String listedByUser
    );
}
