package com.BuzzBid.dao;

import com.BuzzBid.models.core.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface EndAuction extends JpaRepository<Item, Integer> {

    @Modifying
    @Transactional
    @Query(
            nativeQuery = true,
            value = "UPDATE Item SET AuctionEndTime = :auctionEndTime WHERE ItemID = :itemID"
    )
    void endAuction(@Param("itemID") int itemID, @Param("auctionEndTime") String auctionEndTime);
}
