package com.BuzzBid.models.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultsRequest {
    private String keyword;
    private String categoryName;
    private float minPrice;
    private float maxPrice;
    private String condition;

}
