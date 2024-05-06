package com.BuzzBid.dao;

import com.BuzzBid.models.core.Bid;
import com.BuzzBid.models.core.BidId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface PurchaseItem extends JpaRepository<Bid, BidId> {
    @Modifying
    @Transactional
    @Query(
            nativeQuery = true,
            value = "INSERT INTO Bid (ItemID, Username, BidAmount, DateAndTime) VALUES (:itemID, :username, :getItNowPrice, :purchaseDateTime)")
    void purchaseItem(@Param("itemID") int itemID, @Param("username") String username, @Param("getItNowPrice") float getItNowPrice, @Param("purchaseDateTime") String purchaseDateTime);
}
