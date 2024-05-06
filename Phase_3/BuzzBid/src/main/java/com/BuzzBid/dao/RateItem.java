package com.BuzzBid.dao;

import com.BuzzBid.models.core.Rating;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RateItem extends JpaRepository<Rating, Integer> {
   @Modifying
   @Transactional
    @Query(
            nativeQuery = true,
            value="INSERT INTO Rating(ItemID, Reviews, DateAndTime, NumberOfStars)" +
                    "VALUES (:itemID, :reviews, utc_timestamp(), :numberOfStars)")
    void rateItem(@Param("itemID") int itemID, @Param("reviews") String reviews,
                  @Param("numberOfStars") int numberOfStars);
}