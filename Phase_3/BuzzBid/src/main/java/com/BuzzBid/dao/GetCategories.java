package com.BuzzBid.dao;

import com.BuzzBid.models.core.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GetCategories extends JpaRepository<Category, String>  {

    @Query(
            nativeQuery = true,
            value = "SELECT CategoryName FROM Category")
    List<Category> getCategories();
}
