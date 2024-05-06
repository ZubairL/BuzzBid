import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchData, postData } from "../services/api";
import { Box, Button, Container, CssBaseline, Rating, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { formatDate, getCookie } from "../services/utils";
import '../../css/index.css';

const ViewRatings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemId, itemName, fromSearch } = location.state;
  const [ratingsData, setRatingsData] = useState([]);
  const [currentItemBidWinner, setCurrentItemBidWinner] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const currentUser = getCookie("username");

  useEffect(() => {
    fetchData(`/item/auctionended/${itemId}/viewRatings`).then((data) => {
      setRatingsData(data);
    });

    fetchData(`/item/auctionended/${itemId}/bidWinner`).then((data) => {
      setCurrentItemBidWinner(data);
    });
  }, [itemId]);

  async function onClickDelete(deleteRatingItemId) {
    postData(`/item/auctionended/${deleteRatingItemId}/viewRatings/deleteRating`, {
      itemID: parseInt(deleteRatingItemId)
    }).then((data) => {
      console.log(data);
      window.location.reload();
    })
  }

  async function onClickRate() {
    postData(`/item/auctionended/${itemId}/viewRatings/rateItem`, {
      itemID: parseInt(itemId),
      numberOfStars: parseInt(userRating),
      reviews: userReview
    }).then((data) => {
      console.log(data); 
      window.location.reload();
    })
  }

  function onClickClose() {
    if (fromSearch) {
      const { keyword, category, minPrice, maxPrice, conditionAtLeast } = location.state;
      navigate(`/itemForSale?id=${itemId}`, {
        state: {
          keyword,
          category,
          minPrice,
          maxPrice,
          conditionAtLeast
        }
      });
    } else {
      navigate(`/itemResults?id=${itemId}`);
    }
  }

  console.log(currentItemBidWinner);
  // Current user has to be the current item bid winner AND should not have already rated on the current item
  const canUserRate = currentItemBidWinner.length !== 0 && 
                        currentUser === currentItemBidWinner[0].winner &&
                        (ratingsData.length === 0 || (ratingsData.length !== 0 &&
                        !ratingsData.map((rating) => rating.itemId).includes(itemId)));

  console.log(canUserRate);

  return (
    <div className="App App-header">
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
          }}
        >
          <Typography component="h1" variant="h3">
            Item Ratings
          </Typography>
          <TableContainer sx={{ mt: 5, mb: 2, maxWidth: "70%" }}>
            <Table aria-label="simple table">
              <TableBody>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left" sx={{ border: "none" }}>Item ID</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold", border: "none" }}>{itemId}</TableCell>
                </TableRow>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left" sx={{ border: "none" }}>Item Name</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold", border: "none" }}>{itemName}</TableCell>
                </TableRow>
                {ratingsData.length !== 0 && <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left" sx={{ border: "none" }}>Average Star Rating</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold", border: "none" }}>{ratingsData[0].averageRating}</TableCell>
                </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          {
            ratingsData.length !== 0 && ratingsData.map((rating) => {
              return (
                <Box 
                  border={1} 
                  sx={{
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                  }}
                >
                  <TableContainer sx={{ mt: 1, mb: 1, maxWidth: "70%" }}>
                    <Table aria-label="simple table" size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell align="left" sx={{ border: "none" }}>Rated By:</TableCell>
                          <TableCell align="left" sx={{ fontWeight: "bold", border: "none" }}>{rating.winner}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left" sx={{ border: "none" }}>Date:</TableCell>
                          <TableCell align="left" sx={{ fontWeight: "bold", border: "none" }}>{formatDate(rating.date)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left" sx={{ border: "none" }}>Rating:</TableCell>
                          <TableCell align="left" sx={{ fontWeight: "bold", border: "none" }}>{
                            <Rating name="read-only" value={rating.numberOfStars} readOnly />
                          }</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Typography component="p" align="left" sx={{ paddingX: 2, mb: 2, fontSize: 14 }}>
                    {rating.reviews}
                  </Typography>
                  {
                    (fromSearch && getCookie("isAdmin") === "true") && 
                    <Button type="button" variant='contained' sx={{ width: '20%', mb: 2, ml: 2 }} onClick={() => onClickDelete(rating.itemId)}>Delete Rating</Button>
                  }
                  {
                    ((!fromSearch && currentUser === rating.winner)) &&
                    <Button type="button" variant='contained' sx={{ width: '25%', mb: 2, ml: 2 }} onClick={() => onClickDelete(rating.itemId)}>Delete My Rating</Button>
                  }
                </Box>
              );
            })
          }
          {
            !fromSearch && canUserRate && 
            <Box
              border={1} 
              sx={{
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
              }}
            >
              <TableContainer sx={{ mt: 1, mb: -2, maxWidth: "57%" }}>
                <Table aria-label="simple table" size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell align="left" sx={{ border: "none" }}>My Rating:</TableCell>
                      <TableCell align="left" sx={{ fontWeight: "bold", border: "none" }}>{
                        <Rating name="read-only" value={userRating} onChange={(event, newValue) => setUserRating(newValue)} />
                      }</TableCell>
                    </TableRow>
                    <TableRow>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <TextField
                sx={{ mb: 2, maxWidth: '97%', ml: 1.5, mt: 3 }}
                margin="normal"
                fullWidth
                id="review"
                label="Comments"
                name="review"
                autoComplete="review"
                multiline
                rows={4}
                maxRows={4}
                onChange={(event) => setUserReview(event.target.value)}
              />
              <Button type="button" variant='contained' sx={{ width: '20%', mb: 2, ml: 2 }} onClick={onClickRate}>Rate This Item</Button>
            </Box>
          }
        <Button type="button" variant='contained' sx={{ width: '20%', mb: 2, ml: 2 }} onClick={onClickClose}>Close</Button>
        </Box>
      </Container>
    </div>
  );
}

export default ViewRatings;