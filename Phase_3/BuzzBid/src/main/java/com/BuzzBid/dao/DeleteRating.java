package com.BuzzBid.dao;

import com.BuzzBid.models.core.AdminUser;
import com.BuzzBid.models.core.Rating;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeleteRating extends JpaRepository<Rating, Integer> {
  @Modifying
  @Transactional
  @Query(value = "DELETE FROM Rating " +
            "WHERE ItemID=:ItemID", nativeQuery = true)
    void deleteRating(@Param("ItemID") int ItemID);
}