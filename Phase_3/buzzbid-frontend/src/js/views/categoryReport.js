import { Box, Container, CssBaseline, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { fetchData } from "../services/api";
import '../../css/index.css';
import { useEffect, useState } from "react";

const CategoryReport = () => {
  const [categoryData, setCategoryData] = useState({});

  useEffect(() => {
    fetchData("/categoryReport").then((data) => setCategoryData(data));
  }, []);

  if (!categoryData) {
    return <div></div>;
  }

  const reportHeaders = Object.keys(categoryData[0] || {});

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
            Category Report
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 5, marginBottom: 5 }}>
            {categoryData && Object.keys(categoryData).length !== 0 && <Table aria-label="simple table">
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
                  categoryData.map((row) => {
                    const keys = Object.keys(row);
                    return (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        {
                          keys.map((key) => {
                            let value = row[key];

                            if (["Min Price", "Max Price", "Average Price"].includes(key)) {
                              value = (parseFloat(value)) ? `$${parseFloat(value).toFixed(2)}` : "-";
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

export default CategoryReport;