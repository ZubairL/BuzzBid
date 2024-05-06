import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { storeCookie } from '../services/utils';
import '../../css/index.css';
import { postData } from '../services/api';

const Register = () => {
  let navigate = useNavigate();

  function onClickCancel() {
    navigate("/");
  }

  async function onClickRegister() {
    if (password !== confirmPassword) {
      window.alert("Passwords do not match!");
      return;
    }

    const body = {
      username,
      password,
      firstName,
      lastName
    };
    const [response, ] = await postData(`/user/registration/${username}`, body);
    if (response === 200) {
      storeCookie("username", username);
      navigate("/mainmenu");
    } else {
      window.alert("Username already exists!");
    }
  }

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

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
          <Typography component="h1" variant="h2">
            Register User
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="firstName"
              autoFocus
              onChange={(event) => {setFirstName(event.target.value)}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lastName"
              onChange={(event) => {setLastName(event.target.value)}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
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
              autoComplete="password"
              onChange={(event) => {setPassword(event.target.value)}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="confirmPassword"
              onChange={(event) => {setConfirmPassword(event.target.value)}}
            />
            <Grid container justify='space-between' sx={{ mt: 3, mb: 2 }}>
                <Grid item xs={6}>
                    <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickCancel}>
                        Cancel
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button type="button" variant='contained' sx={{ width: '90%' }} disabled={!username || !password || !firstName || !lastName} onClick={onClickRegister}>
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

export default Register;
