package com.BuzzBid.dao;
import java.util.List;

import com.BuzzBid.models.core.Bid;
import com.BuzzBid.models.core.BidId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GetLatestBids extends JpaRepository<Bid, BidId> {
    @Query(
            nativeQuery = true,
            value = "SELECT B.ItemID, B.BidAmount, B.DateAndTime, B.Username FROM Bid B INNER JOIN Item I ON B.ItemID = I.ItemID WHERE I.ItemID = :itemID ORDER BY B.DateAndTime DESC LIMIT 4")
    List<Bid> getLatestBids(@Param("itemID") int itemID);
}
