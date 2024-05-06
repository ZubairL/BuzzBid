import { useEffect, useState } from "react";
import { fetchData } from "../services/api";
import '../../css/index.css';
import { Box, Button, Checkbox, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../services/utils";

const ItemResults = () => {
  let navigate = useNavigate();
  const [itemData, setItemData] = useState({
    itemId: null,
    itemName: "",
    description: "",
    category: "",
    condition: "",
    returnable: false,
    getItNowPrice: null,
    auctionEnded: ""
  });
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const queryString = window.location.search;
    const clickedItemId = (new URLSearchParams(queryString)).get("id");
    
    fetchData(`/item/auctionended/${clickedItemId}`).then((data) => {
      setItemData({
        itemId: data.itemID,
        itemName: data.itemName,
        description: data.description,
        category: data.categoryName,
        condition: data.itemCondition,
        returnable: data.returnable,
        getItNowPrice: data.getItNowPrice,
        auctionEnded: data.auctionEndTime
      });
    });

    fetchData(`/item/auctionended/${clickedItemId}/bidWinner`).then((data) => {
      setBids(data);
    });
  }, []);

  function onClickBack() {
    navigate("/auctionResults");
  }


  function onClickViewRatings() {
    navigate("/viewRatings", {
      state: {
        itemId: itemData.itemId,
        itemName: itemData.itemName,
        fromSearch: false
      }
    });
  }

  if (!itemData) {
    return <div></div>;
  }

  const keyDisplayNameMap = {
    itemId: "Item ID",
    itemName: "Item Name",
    description: "Description",
    category: "Category",
    condition: "Condition",
    returnable: "Returnable?",
    getItNowPrice: "Get It Now Price",
    auctionEnded: "Auction Ended"
  }

  function formatVal(key, val) {
    switch(key) {
      case "returnable":
        return (<Checkbox checked={val} readOnly sx={{ ml: -1.5 }}></Checkbox>)
      case "bidAmount":
      case "getItNowPrice":
        return parseFloat(val) ? `$${parseFloat(val).toFixed(2)}` : val;
      case "timeOfBid":
      case "auctionEnded":
        return formatDate(val);
      default:
        return val;
    }
  }

  const bidHistoryHeaders = ["Bid Amount", "Time of Bid", "Username"];

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
            Item Results
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 1, mb: 2 }}>
            {itemData.itemId && <Table aria-label="simple table">
              <TableBody>
                {
                  Object.keys(itemData).map((key) => {
                    let val = itemData[key];
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
              {bids && <TableBody>
                {
                  bids.map((bid) => {
                    let bgColor = "";
                    if (bid.bidAmount === "Cancelled") {
                      bgColor = "red";
                    } else if (bid.winner === bid.username && bid.bidAmount === bids[0].bidAmount) {
                      bgColor = "green";
                    } else if (bids[0].winner === "No Winner" && bid.username === bids[0].username && bid.bidAmount === bids[0].bidAmount) {
                      bgColor = "yellow";
                    }

                    return (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: bgColor }}>
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
          <Grid container justify='space-between' sx={{ mt: 3, mb: 2 }}>
              <Grid item xs={6}>
                  <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickBack} >
                      Back
                  </Button>
              </Grid>
              <Grid item xs={6}>
                  <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickViewRatings}>
                      View Ratings
                  </Button>
              </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default ItemResults;