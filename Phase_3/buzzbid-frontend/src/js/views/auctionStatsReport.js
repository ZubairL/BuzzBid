import { Box, Container, CssBaseline, Link, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { fetchData } from "../services/api";
import '../../css/index.css';
import { useEffect, useState } from "react";

const AuctionStatisticsReport = () => {
  const [auctionData, setAuctionData] = useState({});

  useEffect(() => {
    fetchData("/auctionStatisticsReport").then((data) => setAuctionData(data));
  }, []);

  if (!auctionData) {
    return <div></div>;
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
          <Typography component="h1" variant="h3">
            Auction Statistics
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 5, marginBottom: 5 }}>
            {auctionData && Object.keys(auctionData).length !== 0 && <Table aria-label="simple table">
              <TableBody>
                {
                  auctionData.map((row) => {
                    let key = Object.keys(row)[0];
                    let val = row[key];
                    return (
                    <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="left">{key}</TableCell>
                      <TableCell align="left">{val}</TableCell>
                    </TableRow>);
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

export default AuctionStatisticsReport;