package com.BuzzBid.dao;

import com.BuzzBid.models.core.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RegisterUser extends JpaRepository<User,String> {
    @Modifying
    @Transactional
    @Query(value="INSERT INTO User (Username, Password, FirstName, LastName)" +
            "VALUES (:username, :password, :firstName, :lastName)", nativeQuery = true)
    void registerUser(@Param("username") String username,
                      @Param("password") String password,
                      @Param("firstName") String firstName,
                      @Param("lastName") String lastName);

}
