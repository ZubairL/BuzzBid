package com.BuzzBid.models.client;

public interface AuctionEndedItemResponse {

    public int getitemID();
    public String getitemName();
    public String getdescription();
    public String getcategoryName();
    public String getitemCondition();
    public boolean getreturnable();
    public Float getgetItNowPrice();
    public String getauctionEndTime();
}
