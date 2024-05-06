package com.BuzzBid.dao;

import com.BuzzBid.models.core.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface EditDescription extends JpaRepository<Item, Integer> {
    @Modifying
    @Transactional
    @Query(
            nativeQuery = true,
            value = "UPDATE Item SET Description = :description WHERE ItemID = :itemID")
    void editDescription(@Param("itemID") int itemID, @Param("description") String description);
}


