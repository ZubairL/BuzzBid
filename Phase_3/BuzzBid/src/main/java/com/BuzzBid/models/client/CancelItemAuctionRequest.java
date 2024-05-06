package com.BuzzBid.models.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CancelItemAuctionRequest {
    private String cancelledReason;
    private String cancelledDate;
    private String username;
}
