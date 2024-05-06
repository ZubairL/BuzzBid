import { useEffect, useState } from "react";
import { fetchData, postData } from "../services/api";
import { Box, Button, Checkbox, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { calculateDaysAfterCurrentDate, formatDate, getCookie } from "../services/utils";
import CurrencyTextField from "@lupus-ai/mui-currency-textfield/dist/CurrencyTextField";
import { useLocation, useNavigate } from "react-router-dom";

const ItemForSale = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState({});
  const [latestBids, setLatestBids] = useState({});
  const [userBid, setUserBid] = useState();
  const bidHistoryHeaders = ["Bid Amount", "Time of Bid", "Username"];
  const isCurrentUserSeller = Object.keys(itemData).length !== 0 && itemData.listedByUser === getCookie("username");

  useEffect(() => {
    const queryString = window.location.search;
    const clickedItemId = (new URLSearchParams(queryString)).get("id");

    fetchData(`/item/${clickedItemId}`).then((data) => setItemData(data));

    fetchData(`/item/${clickedItemId}/latestBids`).then((data) => setLatestBids(data));
  }, []);

  const keyDisplayNameMap = {
    itemID: "Item ID",
    itemName: "Item Name",
    description: "Description",
    categoryName: "Category",
    itemCondition: "Condition",
    returnable: "Returnable?",
    getItNowPrice: "Get It Now Price",
    auctionEndTime: "Auction Ends"
  }

  function formatVal(key, val) {
    switch(key) {
      case "returnable":
        return (<Checkbox checked={val} readOnly sx={{ ml: -1.5 }}></Checkbox>)
      case "getItNowPrice":
        return (<Box sx={{display: 'flex', flexDirection: 'row'}}>
          <Typography sx={{ fontSize: 14, fontWeight: "bold", mt: 1 }}>
            {parseFloat(val) ? `$${parseFloat(val).toFixed(2)}` : val}
          </Typography>
          {!isCurrentUserSeller && <Button type="button" variant='contained' sx={{ width: '40%', ml: 5 }} onClick={onClickGetItNow}>
            Get It Now!
          </Button>}
        </Box>);
      case "description": {
        if (isCurrentUserSeller) {
          return (<Box sx={{display: 'flex', flexDirection: 'row'}}>
            <Typography sx={{ fontSize: 14, fontWeight: "bold", mt: 1 }}>{val}</Typography>
            <Button type="button" variant='contained' sx={{ maxWidth: 50, ml: 3, maxHeight: 50 }} onClick={onClickEdit}>
              Edit
            </Button>
          </Box>);
        } else {
          return val;
        }
      }
      case "timeOfBid":
      case "auctionEndTime":
        return formatDate(val);
      case "bidAmount":
        return parseFloat(val) ? `$${parseFloat(val).toFixed(2)}` : val;
      default:
        return val;
    }
  }

  function calculateMinBidAmount() {
    if (Object.keys(latestBids).length !== 0 && latestBids.bids.length !== 0) {
      return latestBids.bids[0].bidAmount + 1
    } else if (Object.keys(itemData).length !== 0) {
      return itemData.startingBid;
    }
  }

  function onClickClose() {
    navigate("/searchResults", {
      state: location.state
    });
  }

  async function onClickCancel() {
    const cancelledReason = prompt("Cancellation Reason:");

    if (cancelledReason && Object.keys(itemData).length !== 0) {
      postData(`/item/${itemData.itemID}/cancelAuction`, {
        cancelledReason: cancelledReason,
        cancelledDate: calculateDaysAfterCurrentDate(0),
        username: getCookie("username")
      }, "PUT").then((data) => {
        navigate("/searchResults", {
          state: location.state
        });
      });
    }
  }

  async function onClickEdit() {
    const newDescription = prompt("New Description:");

    if (newDescription && Object.keys(itemData).length !== 0) {
      postData(`/item/${itemData.itemID}/editDescription`, {
        description: newDescription
      }, "PUT").then((data) => {
        window.location.reload();
      });
    }
  }

  async function onClickGetItNow() {
    postData(`/item/${itemData.itemID}/purchase`, {
      username: getCookie("username"),
      bidAmount: itemData.getItNowPrice,
      purchaseDateTime: calculateDaysAfterCurrentDate(0)
    }).then((data) => {
      window.alert("Item bought!");
      navigate("/searchResults", {
        state: location.state
      });
    })
  }

  async function onClickBid() {
    if (userBid < calculateMinBidAmount()) {
      window.alert("Bid cannot be less than minimum bid amount");
      return;
    }

    if (itemData.getItNowPrice && userBid >= itemData.getItNowPrice) {
      window.alert("Bid cannot be greated than get it now price.");
      return;
    }

    postData(`/item/${itemData.itemID}/bid`, {
      username: getCookie("username"),
      bidAmount: userBid
    }).then((data) => window.location.reload());
  }

  function onClickViewRatings() {
    navigate("/viewRatings", {
      state: {
        itemId: itemData.itemID,
        itemName: itemData.itemName,
        fromSearch: true,
        keyword: location.state.keyword,
        category: location.state.category,
        minPrice: location.state.minPrice,
        maxPrice: location.state.maxPrice,
        conditionAtLeast: location.state.conditionAtLeast
      }
    });
  }

  return (
    <div className="App App-header">
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h2">
            Item For Sale
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 1, mb: 2 }}>
            {itemData.itemID && <Table aria-label="simple table">
              <TableBody>
                {
                  Object.keys(keyDisplayNameMap).map((key) => {
                    let val = itemData[key];
                    if (key === "getItNowPrice" && !val) {
                      return <div></div>;
                    }
                    return (
                    <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="left" sx={{ width: '25%' }}>{keyDisplayNameMap[key]}</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 'bold' }}>{formatVal(key, val)}</TableCell>
                    </TableRow>);
                  })
                }
              </TableBody>
            </Table>}
          </TableContainer>
          <Typography component="h1" variant="h6">
            Bid History
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 1, mb: 2 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {
                    bidHistoryHeaders.map((header) => {
                      return (<TableCell key={header} align="left" style={{ fontWeight: "bold" }}>{header}</TableCell>)
                    })
                  }
                </TableRow>
              </TableHead>
              {Object.keys(latestBids).length !== 0 && latestBids.bids.length !== 0 && <TableBody>
                {
                  latestBids.bids.map((bid) => {
                    return (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="left">{formatVal("bidAmount", bid["bidAmount"])}</TableCell>
                        <TableCell align="left">{formatVal("timeOfBid", bid["timeOfBid"])}</TableCell>
                        <TableCell align="left">{formatVal("username", bid["username"])}</TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>}
            </Table>
          </TableContainer>
          <TableContainer sx={{ mt: 1, mb: 2 }}>
            <Table aria-label="simple table">
              <TableBody>
                <TableRow key="userBid" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left" sx={{ width: '25%' }}>
                    Your Bid ({`Minimum bid: $${parseFloat(calculateMinBidAmount()).toFixed(2)}`})
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold', width: '40%' }}>
                    <CurrencyTextField
                      label=""
                      variant="outlined"
                      value={userBid}
                      currencySymbol="$"
                      outputFormat="string"
                      decimalCharacter="."
                      digitGroupSeparator=","
                      onChange={(event, value) => setUserBid(value)}
                      disabled={isCurrentUserSeller}
                    />
                  </TableCell>
                  {getCookie("isAdmin") === "true" && <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                    <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickCancel}>
                      Cancel Item
                    </Button>
                  </TableCell>}
                </TableRow>
                </TableBody>
            </Table>
          </TableContainer>
          <Grid container justify='space-between' sx={{ mb: 2 }}>
            <Grid item xs={(isCurrentUserSeller) ? 6 : 4}>
              <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickClose} >
                Close
              </Button>
            </Grid>
            <Grid item xs={(isCurrentUserSeller) ? 6 : 4}>
              <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickViewRatings}>
                View Ratings
              </Button>
            </Grid>
            {!isCurrentUserSeller && <Grid item xs={(isCurrentUserSeller) ? 6 : 4}>
              <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickBid} disabled={!userBid}>
                Bid On Item
              </Button>
            </Grid>}
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default ItemForSale;