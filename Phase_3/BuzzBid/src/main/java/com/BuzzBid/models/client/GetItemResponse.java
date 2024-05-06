package com.BuzzBid.models.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetItemResponse {
    private int itemID;
    private String itemName;
    private String description;
    private String categoryName;
    private String itemCondition;
    private boolean returnable;
    private float getItNowPrice;
    private String auctionEndTime;
    private String cancelledDate;
    private String cancelledReason;
    private String listedByUser;
    private float startingBid;
}
