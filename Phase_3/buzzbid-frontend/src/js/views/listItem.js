import { Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, FormGroup, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchData, postData } from "../services/api";
import { useNavigate } from "react-router-dom";
import CurrencyTextField from '@lupus-ai/mui-currency-textfield';
import { calculateDaysAfterCurrentDate, getCookie, validateItemDates } from "../services/utils";

const ListMyItem = () => {
  let navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [minBidAmount, setMinBidAmount] = useState();
  const [minSalePrice, setMinSalePrice] = useState();
  const [auctionLength, setAuctionLength] = useState();
  const [getItNowPrice, setGetItNowPrice] = useState();
  const [returnable, setReturnable] = useState(false);
  const conditions = ["New", "Very Good", "Good", "Fair", "Poor"];
  const auctionLengths = [1, 3, 5, 7];

  useEffect(() => {
    fetchData("/categories").then((data) => setCategories(data));
  }, []);

  function onClickCancel() {
    navigate("/mainmenu");
  }

  async function onClickList() {
    const error = validateItemDates(minBidAmount, minSalePrice, getItNowPrice)
    if (error) {
      window.alert(error);
      return;
    }

    postData("/item/add", {
      itemName: itemName,
      description: description,
      itemCondition: condition,
      returnable: returnable,
      startingBid: minBidAmount,
      minimumSalePrice: minSalePrice,
      getItNowPrice: (getItNowPrice) ? getItNowPrice : null,
      auctionEndTime: calculateDaysAfterCurrentDate(auctionLength),
      cancelledDate: null,
      cancelledReason: null,
      categoryName: category,
      listedByUser: getCookie("username")
    }).then((data) => {
      window.alert("Item listed!");
      window.location.reload();
    });
  }

  return (
    <div className="App App-header">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h2">
            List Item
          </Typography>
          <Box component="form" noValidate>
            <TextField
              margin="normal"
              fullWidth
              id="itemName"
              label="Item Name"
              name="itemName"
              autoComplete="itemName"
              required
              autoFocus
              onChange={(event) => setItemName(event.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              multiline
              required
              rows={4}
              maxRows={4}
              onChange={(event) => setDescription(event.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              id="category"
              label="Category"
              name="category"
              autoComplete="category"
              required
              select
              onChange={(event) => setCategory(event.target.value)}
              sx={{ textAlign: "left" }}
            >
              {
                categories.map((category) => {
                  const categoryName = category.categoryName;
                  return (<MenuItem value={categoryName}>{categoryName}</MenuItem>);
                })
              }
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              name="condition"
              label="Condition"
              id="condition"
              autoComplete="condition"
              select
              required
              onChange={(event) => setCondition(event.target.value)}
              sx={{ textAlign: "left" }}
            >
              {
                conditions.map((condition) => {
                  return (<MenuItem value={condition}>{condition}</MenuItem>);
                })
              }
            </TextField>
            <CurrencyTextField
		          label="Start Auction Bidding At"
              variant="outlined"
              value={minBidAmount}
              currencySymbol="$"
              outputFormat="number"
              decimalCharacter="."
              digitGroupSeparator=","
              onChange={(event, value) => setMinBidAmount(value)}
              fullWidth
              style={{ marginTop:15 }}
              required
            />
            <CurrencyTextField
		          label="Minimum Sale Price"
              variant="outlined"
              value={minSalePrice}
              currencySymbol="$"
              outputFormat="number"
              decimalCharacter="."
              digitGroupSeparator=","
              onChange={(event, value) => setMinSalePrice(value)}
              fullWidth
              style={{ marginTop: 20 }}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              name="auctionLength"
              label="Auction Ends In (Days)"
              id="auctionLength"
              autoComplete="auctionLength"
              select
              required
              onChange={(event) => setAuctionLength(parseInt(event.target.value))}
              sx={{ textAlign: "left" }}
            >
              {
                auctionLengths.map((length) => {
                  return (<MenuItem value={length}>{length}</MenuItem>);
                })
              }
            </TextField>
            <CurrencyTextField
		          label="Get It Now Price"
              variant="outlined"
              value={getItNowPrice}
              currencySymbol="$"
              outputFormat="number"
              decimalCharacter="."
              digitGroupSeparator=","
              onChange={(event, value) => setGetItNowPrice(value)}
              fullWidth
              style={{ marginTop: 17 }}
            />
            <FormGroup>
              <FormControlLabel control={<Checkbox onChange={(event) => setReturnable(event.target.checked)}/>} label="Returns Accepted?" labelPlacement="start"/>
            </FormGroup>
            <Grid container justify='space-between' sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={6}>
                    <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickCancel} >
                        Cancel
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickList} disabled={!itemName || !description || !category || !condition || !minBidAmount || !minSalePrice || !auctionLength } >
                        List My Item
                    </Button>
                </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default ListMyItem;