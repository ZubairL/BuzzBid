package com.BuzzBid.models.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RateItemRequest {
    private int itemID;
    private String reviews;
    private int numberOfStars;
}
