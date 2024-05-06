package com.BuzzBid.models.core;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "adminuser")
public class AdminUser {
    @Id
    @Column(name = "Username")
    private String username;

    @Column(name = "Position")
    private String position;
}
