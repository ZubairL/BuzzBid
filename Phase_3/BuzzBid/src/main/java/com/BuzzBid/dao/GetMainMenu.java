package com.BuzzBid.dao;

import java.util.Optional;
import com.BuzzBid.models.core.User;
import com.BuzzBid.models.client.MainMenuResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GetMainMenu extends JpaRepository<User, String> {
    @Query(value ="SELECT U.FirstName, U.LastName, A.Position " +
            "FROM User U " +
            "LEFT JOIN AdminUser A ON U.Username = A.Username " +
            "WHERE U.Username = :Username", nativeQuery = true)
    Optional<MainMenuResponse> getMainMenu(@Param("Username") String Username);
}