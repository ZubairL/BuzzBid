package com.BuzzBid.controllers;

import com.BuzzBid.dao.*;
import com.BuzzBid.models.client.*;
import com.BuzzBid.models.core.Bid;
import com.BuzzBid.models.core.Item;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/item")
public class ItemController {
    @Autowired
    private GetItem getItem;

    @Autowired
    private GetLatestBids getLatestBids;

    @Autowired
    private CancelItemAuction cancelItemAuction;

    @Autowired
    private PurchaseItem purchaseItem;

    @Autowired
    private EditDescription editDescription;
    
    @Autowired
    private BidItem bidItem;

    @Autowired
    private AddItem addItem;
    
    @Autowired
    private ModelMapper mapper;

    @Autowired
    private GetAuctionEndedItem auctionEndedItem;

    @Autowired
    private GetBidWinner bidWinner;

    @Autowired
    private GetItemRatings itemRatings;

    @Autowired
    private RateItem rateItem;

    @Autowired
    private DeleteRating deleteRating;
    @Autowired
    private GetSearchResults searchResults;

    @Autowired
    private EndAuction endAuction;

    @GetMapping("/{itemID}")
    public GetItemResponse getItemDescription(@PathVariable int itemID) {
        final Item item = verifyItemExists(itemID);
        return mapper.map(item, GetItemResponse.class);
    }

    @GetMapping("/{itemID}/latestBids")
    public GetLatestBidsResponse getLatestBids(@PathVariable int itemID) {
        verifyItemExists(itemID);
        final List<Bid> latestBids = getLatestBids.getLatestBids(itemID);
        final List<com.BuzzBid.models.client.Bid> clientBids = latestBids
                .stream()
                .map(bid -> mapper.map(bid, com.BuzzBid.models.client.Bid.class))
                .collect(Collectors.toList());
        return GetLatestBidsResponse
                .builder()
                .bids(clientBids)
                .build();
    }

    // TODO: Test, add verification that cancellation was not done already
    @PutMapping("/{itemID}/cancelAuction")
    @CrossOrigin
    public ResponseEntity<String> cancelAuction(@PathVariable int itemID, @RequestBody CancelItemAuctionRequest cancelItemAuctionRequest) {
        verifyItemExists(itemID);
        cancelItemAuction.cancelItemAuction(itemID, cancelItemAuctionRequest.getCancelledReason(), cancelItemAuctionRequest.getCancelledDate());
        bidItem.addCancelledBid(itemID, cancelItemAuctionRequest.getUsername(), cancelItemAuctionRequest.getCancelledDate());
        return new ResponseEntity<>("Auction has been successfully cancelled.",HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addItem(@RequestBody ItemResponse itemResponse) {
        try {
            addItem.addItem(itemResponse.getItemName(), itemResponse.getDescription(), itemResponse.getItemCondition(), itemResponse.isReturnable(), itemResponse.getStartingBid(), itemResponse.getMinimumSalePrice(), itemResponse.getGetItNowPrice(), itemResponse.getAuctionEndTime(), itemResponse.getCancelledDate(), itemResponse.getCancelledReason(), itemResponse.getCategoryName(), itemResponse.getListedByUser());
        } catch(Exception e) {
            if (e.getCause() instanceof ConstraintViolationException) {
                ConstraintViolationException constraintException =
                        (ConstraintViolationException) e.getCause();
                String constraintMsg = constraintException.getMessage();
                String message;
                if(constraintMsg.toUpperCase().contains("PRIMARY"))
                    message = "Unable to add item as item ID already exist";
                else if (constraintMsg.toUpperCase().contains("FOREIGN")) {
                    message = "Unable to find username to add item";
                }
                else if (constraintMsg.toUpperCase().contains("CHECK")) {
                    message = "Please ensure Minimum Sale Price is greater than or equal to " +
                            "Starting Bid and Get It Now Price is greater than or equal to Minimum Sale Price";
                }
                else
                    message = "Unable to add the item";
                return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                return new ResponseEntity<>("Unable add the item. Please try again later", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Item has been purchased successfully.",HttpStatus.OK);

    }
    
    @PutMapping("/{itemID}/editDescription")
    @CrossOrigin
    public ResponseEntity<String> editDescription(@PathVariable int itemID, @RequestBody EditDescriptionResponse editDescriptionResponse) {
        try{
            if((verifyItemExists(itemID))!=null)
                editDescription.editDescription(itemID, editDescriptionResponse.getDescription());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/{itemID}/purchase")
    public ResponseEntity<String> purchaseItem(@PathVariable int itemID, @RequestBody PurchaseItemRequest purchaseItemRequest) {
        try {
            if ((verifyItemExists(itemID)) != null) {
                purchaseItem.purchaseItem(itemID, purchaseItemRequest.getUsername(), purchaseItemRequest.getBidAmount(), purchaseItemRequest.getPurchaseDateTime());
                endAuction.endAuction(itemID, purchaseItemRequest.getPurchaseDateTime());
            }
        }catch (Exception e) {
                if (e.getCause() instanceof ConstraintViolationException) {
                    ConstraintViolationException constraintException =
                            (ConstraintViolationException) e.getCause();
                    String constraintMsg = constraintException.getMessage();
                    String message;
                    if(constraintMsg.toUpperCase().contains("PRIMARY"))
                        message = "Unable to purchase item as item is no longer available";
                    else if (constraintMsg.toUpperCase().contains("FOREIGN")) {
                        message = "Unable to find the item or username for purchase";
                    }
                    else
                        message = "Unable to purchase the item";
                    return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
                } else {
                    return new ResponseEntity<>("Unable to purchase the item. Please try again later", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            return new ResponseEntity<>("Item has been purchased successfully.",HttpStatus.OK);

        }

    // TODO: SQL Insert query needs to be reworked, have to check bid amount is greatest and do insert atomically
    // Can possibly use SQL stored procedure + @Query or @Transaction Spring annotation, or JDBC for doing transactions
    // Also check current time is before auction end time and bid is bigger than starting bid.
    @PostMapping("/{itemID}/bid")
    public ResponseEntity<String> bidItem(@PathVariable int itemID, @RequestBody BidRequest bidRequest) {
        try {
            if ((verifyItemExists(itemID)) != null)
                bidItem.bidItem(itemID, bidRequest.getUsername(), bidRequest.getBidAmount());
        } catch (Exception e) {
            if (e.getCause() instanceof ConstraintViolationException) {
                ConstraintViolationException constraintException =
                        (ConstraintViolationException) e.getCause();
                String constraintMsg = constraintException.getMessage();
                String message;
                if(constraintMsg.toUpperCase().contains("PRIMARY"))
                    message = "A bid has already been placed for the item with the amount. Please try a higher bid amount.";
                else if (constraintMsg.toUpperCase().contains("FOREIGN")) {
                    message = "Unable to find the item to bid";
                }
                else
                    message = "Unable to place your bid";
                return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                return new ResponseEntity<>("Unable to place your bid.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("A bid has been placed for this item successfully.",HttpStatus.OK);

    }

    private Item verifyItemExists(int itemID) {
        final Optional<Item> item = getItem.getItem(itemID);
        if (item.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item does not exist");
        }
        return item.get();
    }
    //Get the item details for items whose auction has ended
    //User clicks on itemID from View Auction Results page
    @GetMapping("/auctionended/{itemID}")
    public AuctionEndedItemResponse getAuctionEndedItem(@PathVariable int itemID)
    {
        return auctionEndedItem.getAuctionEndedItem(itemID);
    }
    //Get the item bid details for items whose auction has ended
    //User clicks on itemID from View Auction Results page

    @GetMapping("/auctionended/{itemID}/bidWinner")
    public List<BidWinner> getItemBidWinner(@PathVariable int itemID)
    {
        return bidWinner.getItemBidWinner(itemID);
    }

    @GetMapping("/auctionended/{itemID}/viewRatings")
    public List<ItemRatings> getItemRatings(@PathVariable int itemID)
    {
        Optional<Item> itemOptional = getItem.getItem(itemID);
        if (itemOptional.isPresent()) {
            Item item = itemOptional.get();
            return itemRatings.getItemRatings(item.getItemName());
        }

        return List.of();
    }

    //Rate item that was won by the user
    //user clicks on view ratings from item results page
    @PostMapping("/auctionended/{itemID}/viewRatings/rateItem")
    public ResponseEntity<String> rateItem(@PathVariable int itemID, @RequestBody RateItemRequest rateItemRequest) {

        try {
            rateItem.rateItem(itemID, rateItemRequest.getReviews(), rateItemRequest.getNumberOfStars());
        }catch(Exception e) {
            if (e.getCause() instanceof ConstraintViolationException) {
                ConstraintViolationException constraintException =
                        (ConstraintViolationException) e.getCause();
                String constraintMsg = constraintException.getMessage();
                String message;
                if(constraintMsg.toUpperCase().contains("PRIMARY"))
                    message = "Unable to add rating for the item as rating has already been provided.";
                else if (constraintMsg.toUpperCase().contains("FOREIGN")) {
                    message = "Unable to find the item to add a rating.";
                }
                else
                    message = "Unable to add rating for the item as rating has already been provided.";
                return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                return new ResponseEntity<>("Unable to add your rating for the item.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Your rating has been added.",HttpStatus.OK);
    }

    @PostMapping("/auctionended/{itemID}/viewRatings/deleteRating")
    public ResponseEntity<String> deleteRating(@PathVariable int itemID, @RequestBody DeleteRatingRequest deleteRatingRequest) {
       try {
           deleteRating.deleteRating(itemID);
       }catch(Exception e) {

               return new ResponseEntity<>("Unable remove rating for the item.", HttpStatus.INTERNAL_SERVER_ERROR);

       }
        return new ResponseEntity<>("Your rating has been removed.",HttpStatus.OK);
    }

    @PostMapping("/searchItem")
    public List<SearchResultsResponse> searchItem(@RequestBody SearchResultsRequest searchItem) {

        return searchResults.getSearchResults(searchItem.getKeyword(),searchItem.getCategoryName(),searchItem.getMinPrice(),searchItem.getMaxPrice(),
                searchItem.getCondition());
    }




}
