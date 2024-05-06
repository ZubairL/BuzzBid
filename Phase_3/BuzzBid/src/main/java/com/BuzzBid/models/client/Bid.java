package com.BuzzBid.models.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Bid {
    private float bidAmount;
    @JsonProperty("timeOfBid")
    private String dateAndTime;
    private String username;
}
