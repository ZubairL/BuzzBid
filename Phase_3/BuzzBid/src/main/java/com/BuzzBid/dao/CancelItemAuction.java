package com.BuzzBid.dao;

import com.BuzzBid.models.core.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
@Repository
public interface CancelItemAuction extends JpaRepository<Item, Integer> {
    @Query(
            nativeQuery = true,
            value = "UPDATE Item SET CancelledReason = :cancelledReason, CancelledDate = :cancelledDate, AuctionEndTime = :cancelledDate WHERE ItemID = :itemID")
    @Modifying
    @Transactional
    void cancelItemAuction(@Param("itemID") int itemID, @Param("cancelledReason") String cancelledReason, @Param("cancelledDate") String cancelledDate);
}
