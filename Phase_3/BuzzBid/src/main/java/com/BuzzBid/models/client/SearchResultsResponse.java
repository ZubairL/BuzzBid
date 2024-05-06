package com.BuzzBid.models.client;

public interface SearchResultsResponse {
    public Integer getitemID();
    public String getitemName();
    public String getcurrentBid();
    public String gethighestBidder();
    public String getgetItNowPrice();
    public String getauctionEnds();

}
