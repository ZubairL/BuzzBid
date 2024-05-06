package com.BuzzBid.models.client;


public interface ItemRatings {
    public int getitemId();
    public String getitemName();
    public float getaverageRating();
    public String getreviews();
    public int getnumberOfStars();
    public String getwinner();
    public String getDate();
}