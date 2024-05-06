import { Box, Container, CssBaseline, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { fetchData } from "../services/api";
import '../../css/index.css';
import { useEffect, useState } from "react";
import { formatDate } from "../services/utils";

const CancelledAuctionsReport = () => {
  const [cancelledAuctionsData, setCancelledAuctionsData] = useState({});

  useEffect(() => {
    fetchData("/cancelledAuctionReport").then((data) => setCancelledAuctionsData(data));
  }, []);

  if (!cancelledAuctionsData) {
    return <div></div>;
  }

  const reportHeaders = Object.keys(cancelledAuctionsData[0] || {});

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
          <Typography component="h1" variant="h4">
            Cancelled Auctions Details
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 5, marginBottom: 5 }}>
            {cancelledAuctionsData && Object.keys(cancelledAuctionsData).length !== 0 && <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {
                    reportHeaders.map((header) => (
                      <TableCell key={header} align="left" style={{ fontWeight: "bold" }}>{header}</TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  cancelledAuctionsData.map((row) => {
                    let keys = Object.keys(row);
                    return (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        {
                          keys.map((key) => {
                            let value = row[key];
                            if (key === "Cancelled Date") {
                              value = formatDate(value);
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

export default CancelledAuctionsReport;