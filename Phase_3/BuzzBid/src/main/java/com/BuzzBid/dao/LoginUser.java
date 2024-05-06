package com.BuzzBid.dao;

import com.BuzzBid.models.client.LoginResponse;
import com.BuzzBid.models.core.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginUser extends JpaRepository<User, String> {

    @Query(value ="SELECT Username, Password FROM User WHERE Username=:Username AND Password=:Password",
            nativeQuery = true)
    Optional<LoginResponse> getLoginDetails(@Param("Username") String Username, @Param("Password") String password);
}
