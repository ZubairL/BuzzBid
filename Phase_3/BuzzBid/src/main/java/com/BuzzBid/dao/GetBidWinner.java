package com.BuzzBid.dao;

import com.BuzzBid.models.client.BidWinner;
import com.BuzzBid.models.core.Bid;
import com.BuzzBid.models.core.BidId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GetBidWinner extends JpaRepository<Bid, BidId> {
    @Query(value="WITH SaleDeterminant(ItemID,SaleAmount,Winner) AS (SELECT B.ItemID,B.BidAmount, B.Username FROM Bid B " +
            "WHERE B.ItemID=:itemID ORDER BY B.BidAmount DESC LIMIT 1) " +
            "SELECT CASE WHEN B.BidAmount = -1 THEN 'Cancelled' ELSE B.BidAmount END AS 'BidAmount', " +
            "B.DateAndTime AS 'TimeofBid', " +
            "CASE " +
            "WHEN B.BidAmount = -1 then 'Administrator' " +
            "ELSE B.Username " +
            "END AS 'Username', " +
            "CASE " +
            "WHEN I.CancelledDate IS NULL AND S.SaleAmount>=I.MinimumSalePrice then S.Winner " +
            "WHEN I.CancelledDate IS NULL AND S.SaleAmount<I.MinimumSalePrice then 'No Winner' " +
            "WHEN I.CancelledDate IS NOT NULL then 'Administrator' " +
            "END AS 'Winner' " +
            "FROM Bid B " +
            "INNER JOIN Item I ON B.ItemID=I.ItemID " +
            "INNER JOIN SaleDeterminant S ON I.ItemID=S.ItemID " +
            "WHERE I.ItemID=:itemID " +
            "ORDER BY B.DateAndTime DESC LIMIT 4", nativeQuery = true)
    List<BidWinner> getItemBidWinner(@Param("itemID") int itemID);
}
