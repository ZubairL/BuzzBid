import { Box, Container, CssBaseline, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { fetchData } from "../services/api";
import '../../css/index.css';
import { useEffect, useState } from "react";

const TopRatedReport = () => {
  const [topRatedData, setTopRatedData] = useState({});

  useEffect(() => {
    fetchData("/topRatedReport").then((data) => setTopRatedData(data));
  }, []);

  if (!topRatedData) {
    return <div></div>;
  }

  const reportHeaders = Object.keys(topRatedData[0] || {});

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
            Top Rated Items
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 5, marginBottom: 5 }}>
            {topRatedData && Object.keys(topRatedData).length !== 0 && <Table aria-label="simple table">
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
                  topRatedData.map((row) => {
                    const values = Object.values(row);
                    return (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        {
                          values.map((value) => (
                            <TableCell align="left">{value}</TableCell>
                          ))
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

export default TopRatedReport;