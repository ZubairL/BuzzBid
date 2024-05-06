package com.BuzzBid.dao;
import java.util.Optional;
import com.BuzzBid.models.core.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GetAdminUser extends JpaRepository<AdminUser, String> {
    @Query(
            nativeQuery = true,
            value = "SELECT Username, Position FROM AdminUser WHERE Username = :username")
            Optional<AdminUser> getAdminUser(@Param("username") String username);
}
