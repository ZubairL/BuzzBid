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
public interface BidItem extends JpaRepository<Bid, BidId> {
    @Query(
            nativeQuery = true,
            value = "INSERT INTO Bid (ItemID, Username, BidAmount, DateAndTime) VALUES (:itemID, :username, :bidAmount, utc_timestamp())")
    @Modifying
    @Transactional
    void bidItem(@Param("itemID") int itemID, @Param("username") String username, @Param("bidAmount") float bidAmount);

    @Query(
            nativeQuery = true,
            value = "INSERT INTO Bid (ItemID, Username, BidAmount, DateAndTime) VALUES (:itemID, :username, -1, :dateAndTime)")
    @Modifying
    @Transactional
    void addCancelledBid(@Param("itemID") int itemID, @Param("username") String username, @Param("dateAndTime") String dateAndTime);
}
