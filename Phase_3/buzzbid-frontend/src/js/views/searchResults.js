import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../services/api";
import { Box, Container, CssBaseline, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { formatDate } from "../services/utils";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState([]);
  
  useEffect(() => {
    let { keyword, category, minPrice, maxPrice, conditionAtLeast } = location.state;

    if (!parseFloat(minPrice))
      minPrice = 0.0;
    
    if (!parseFloat(maxPrice))
      maxPrice = Number.MAX_SAFE_INTEGER;

    postData("/item/searchItem", {
      keyword: `%${keyword}%`,
      categoryName: `%${category}%`,
      minPrice: minPrice,
      maxPrice: maxPrice,
      condition: conditionAtLeast
    }).then((data) => {
      setSearchData(data[1]);
    });
  }, [location.state]);

  if (!searchData) {
    return <div></div>;
  }

  const columnOrder = ["itemID", "itemName", "currentBid", "highestBidder", "getItNowPrice", "auctionEnds"];

  function formatHeader(header) {
    const headerMap = {
      "itemID": "ID",
      "itemName": "Item Name",
      "currentBid": "Current Bid",
      "highestBidder": "Highest Bidder",
      "getItNowPrice": "Get It Now Price",
      "auctionEnds": "Auction Ends"
    }

    return headerMap[header];
  }

  function onClickLink(itemId) {
    navigate(`/itemForSale?id=${itemId}`, {
      state: location.state
    });
  }

  return (
    <div className="App App-header">
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h3">
            Search Results
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 5, marginBottom: 5 }}>
            {searchData && Object.keys(searchData).length !== 0 && <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {
                    columnOrder.map((header) => {
                      return (<TableCell key={header} align="left" style={{ fontWeight: "bold" }}>{formatHeader(header)}</TableCell>);
                    })
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  searchData.map((row) => {
                    return (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        {
                          columnOrder.map((key) => {
                            let value = row[key];
                            if (key === "auctionEnds") {
                              value = formatDate(value);
                            } else if (key === "itemName") {
                              const itemId = row["itemID"];
                              value = (<Link onClick={() => onClickLink(itemId)} component="button">{value}</Link>);
                            } else if ((key === "getItNowPrice" || key === "currentBid") && parseFloat(value)) {
                              value = (value) ? "$" + parseFloat(value).toFixed(2) : "-";
                            }
                            return <TableCell align="left">{value}</TableCell>
                          })
                        }
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>}
          </TableContainer>
          <Link href="/search" style={{ fontSize: 14 }}>&lt; Search</Link>
        </Box>
      </Container>
    </div>
  );

}

export default SearchResults;