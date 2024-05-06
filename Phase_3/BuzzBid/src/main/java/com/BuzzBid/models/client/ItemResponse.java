package com.BuzzBid.models.client;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemResponse {
    private String itemName;
    private String description;
    private String itemCondition;
    private boolean returnable;
    private float startingBid;
    private float minimumSalePrice;
    private Float getItNowPrice;
    private String auctionEndTime;
    private String cancelledDate;
    private String cancelledReason;
    private String categoryName;
    private String listedByUser;

}


