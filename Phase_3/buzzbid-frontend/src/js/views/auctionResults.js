import '../../css/index.css';
import { useEffect, useState } from "react";
import { fetchData } from '../services/api';
import { Box, Container, CssBaseline, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { formatDate } from '../services/utils';

const AuctionResults = () => {
  const [auctionResults, setAuctionResults] = useState([]);
  useEffect(() => {
    fetchData("/auctionResults").then((data) => setAuctionResults(data));
  }, []);

  if (!auctionResults) {
    return <div></div>;
  }

  const reportHeaders = Object.keys(auctionResults[0] || {});

  return (
    <div className="App App-header">
      <Container component="main" maxWidth="md">
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
            Auction Results
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 5, marginBottom: 5 }}>
            {auctionResults && Object.keys(auctionResults).length !== 0 && <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {
                    reportHeaders.map((header) => {
                      header = (header === "AuctionEnded") ? "Auction Ended" : header;
                      return (<TableCell key={header} align="left" style={{ fontWeight: "bold" }}>{header}</TableCell>);
                    })
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  auctionResults.map((row) => {
                    let keys = Object.keys(row);
                    return (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        {
                          keys.map((key) => {
                            let value = row[key];
                            if (key === "AuctionEnded") {
                              value = formatDate(value);
                            } else if (key === "Item Name") {
                              const itemId = row["ID"];
                              value = (<Link href={`/itemResults?id=${itemId}`}>{value}</Link>);
                            } else if (key === "Sale Price" && value !== "-") {
                              value = "$" + parseFloat(value).toFixed(2);
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
          <Link href="/mainmenu" style={{ fontSize: 14 }}>&lt; Main Menu</Link>
        </Box>
      </Container>
    </div>
  );
}

export default AuctionResults;