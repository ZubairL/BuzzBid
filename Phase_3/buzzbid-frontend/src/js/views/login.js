import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { storeCookie } from "../services/utils";
import '../../css/index.css';
import { fetchData } from '../services/api';

const Login = () => {
  let navigate = useNavigate();

  function onClickRegister() {
    navigate("/register");
  }

  async function onClickLogin() {
    const userData = await fetchData(`/user/validate/${username}/${password}`);
    if (userData === 404) {
      window.alert("Invalid credentials. Please try again!");
    } else {
      storeCookie("username", username);
      navigate("/mainmenu");
    }
  }

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <div className="App App-header">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h1">
            BuzzBid
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(event) => {setUsername(event.target.value)}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(event) => {setPassword(event.target.value)}}
            />
            <Grid container justify='space-between' sx={{ mt: 3, mb: 2 }}>
                <Grid item xs={6}>
                    <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickLogin} disabled={!username || !password}>
                        Login
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickRegister}>
                        Register
                    </Button>
                </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
