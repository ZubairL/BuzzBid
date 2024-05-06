package com.BuzzBid.models.core;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@IdClass(BidId.class)
public class Bid {
    @Id
    @Column(name = "ItemID")
    private int itemId;

    @Id
    @Column(name = "BidAmount")
    private float bidAmount;

    @Column(name = "DateAndTime")
    private String dateAndTime;

    @Column(name = "Username")
    private String username;
}
