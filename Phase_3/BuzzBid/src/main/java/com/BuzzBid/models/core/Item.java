package com.BuzzBid.models.core;

import com.BuzzBid.util.ItemConditionConverter;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "item")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ItemID")
    private int itemID;

    @Column(name = "ItemName")
    private String itemName;

    @Column(name = "Description")
    private String description;

    @Column(name = "ItemCondition")
    @Convert(converter = ItemConditionConverter.class)
    private ItemCondition itemCondition;

    @Column(name = "Returnable")
    private boolean returnable;

    @Column(name = "StartingBid")
    private float startingBid;

    @Column(name = "MinimumSalePrice")
    private float minimumSalePrice;

    @Column(name = "GetItNowPrice")
    private Float getItNowPrice;

    @Column(name = "AuctionEndTime")
    private String auctionEndTime;

    @Column(name = "CancelledDate")
    private String cancelledDate;

    @Column(name = "CancelledReason")
    private String cancelledReason;

    @Column(name = "CategoryName")
    private String categoryName;

    @Column(name = "ListedByUser")
    private String listedByUser;
}
