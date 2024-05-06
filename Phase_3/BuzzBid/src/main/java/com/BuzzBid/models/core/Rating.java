package com.BuzzBid.models.core;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Rating")
public class Rating {
    @Id
    @Column(name = "ItemID")
    private int itemID;

    @Column(name = "Reviews")
    private String reviews;

    @Column(name = "DateAndTime")
    private String dateAndTime;

    @Column(name = "NumberOfStars")
    private int numberOfStars;
}