import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { getCookie, storeCookie } from '../services/utils';
import '../../css/index.css';
import { Link } from '@mui/material';
import List from '@mui/material/List';
import { useEffect, useState } from 'react';
import { fetchData } from '../services/api';

const MainMenu = () => {
  const [currentUser, ] = useState(getCookie("username"));
  const [firstName, setFirstName ] = useState("");
  const [lastName, setLastName] = useState("");
  const [adminPos, setAdminPos] = useState("");

  useEffect(() => {
    fetchData(`/user/${currentUser}/mainMenu`).then((data) => {
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setAdminPos(data.position);
    });
  }, [currentUser]);

  const isAdmin = adminPos !== null;
  storeCookie("isAdmin", isAdmin);

  if (!firstName || !lastName) {
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
          <Typography component="h1" variant="h2">
            Main Menu
          </Typography>
          <Typography component="h1" variant="h5" sx={{ marginTop: 4, }}>
            {`Welcome, ${firstName} ${lastName}!`}
          </Typography>
          {isAdmin && <Typography component="h1" variant="h5">
            {`Administrative Position: ${adminPos}`}
          </Typography>}
          <Grid container sx={{ mt: 3 }}>
            <Grid item xs={isAdmin? 6: 12}>
              <Typography component="h1" variant="h6">
                Auction Options
              </Typography>
              <div style={{ textAlign: "center" }}>
                <List>
                  <li><Link href="/search" sx={{ fontSize: 18 }}>Search for Items</Link></li>
                  <li><Link href="/listItem" sx={{ fontSize: 18 }}>List Item</Link></li>
                  <li><Link href="/auctionResults" sx={{ fontSize: 18 }}>View Auction Results</Link></li>
                </List>
              </div>
            </Grid>
            {isAdmin && <Grid item xs={6}>
              <Typography component="h1" variant="h6">
                Reports
              </Typography>
              <div style={{ textAlign: "center" }}>
                <List>
                  <li><Link href="/reports/category" sx={{ fontSize: 18 }}>Category Report</Link></li>
                  <li><Link href="/reports/user" sx={{ fontSize: 18 }}>User Report</Link></li>
                  <li><Link href="/reports/topRatedItems" sx={{ fontSize: 18 }}>Top Rated Items</Link></li>
                  <li><Link href="/reports/auctionStats" sx={{ fontSize: 18 }}>Auction Statistics</Link></li>
                  <li><Link href="/reports/cancelledAuctions" sx={{ fontSize: 18 }}>Cancelled Auction Details</Link></li>
                </List>
              </div>
            </Grid>}
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default MainMenu;