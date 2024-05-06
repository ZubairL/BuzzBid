import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Grid, MenuItem } from '@mui/material';
import '../../css/index.css';
import { fetchData } from '../services/api';
import { useNavigate } from 'react-router-dom';
import CurrencyTextField from '@lupus-ai/mui-currency-textfield';

const SearchForm = () => {
  let navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData("/categories").then((data) => {
      data.push({"categoryName": ""});
      setCategories(data);
    });
  }, []);

  function onClickCancel() {
    navigate("/mainmenu");
  }
  
  function onClickSearch() {
    navigate("/searchResults", {
      state: {
        keyword,
        category,
        minPrice,
        maxPrice,
        conditionAtLeast
      }
    });
  }

  const conditions = ["New", "Very Good", "Good", "Fair", "Poor", ""];

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [conditionAtLeast, setConditionAtLeast] = useState('');

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
            Item Search
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="keyword"
              label="Keyword"
              name="keyword"
              autoComplete="keyword"
              autoFocus
              onChange={(event) => {setKeyword(event.target.value)}}
            />
            <TextField
              margin="normal"
              fullWidth
              id="category"
              label="Category"
              name="category"
              autoComplete="category"
              select
              onChange={(event) => {setCategory(event.target.value)}}
              sx={{ textAlign: "left" }}
            >
              {
                categories.map((category) => {
                  const categoryName = category.categoryName;
                  const categoryValue = (categoryName) ? categoryName : "None";
                  return (<MenuItem value={categoryName}>{categoryValue}</MenuItem>);
                })
              }
            </TextField>
            <CurrencyTextField
		          label="Minimum Price"
              variant="outlined"
              value={minPrice}
              currencySymbol="$"
              outputFormat="string"
              decimalCharacter="."
              digitGroupSeparator=","
              onChange={(event, value) => setMinPrice(value)}
              fullWidth
              style={{ marginTop: 17 }}
            />
            <CurrencyTextField
		          label="Maximum Price"
              variant="outlined"
              value={maxPrice}
              currencySymbol="$"
              outputFormat="string"
              decimalCharacter="."
              digitGroupSeparator=","
              onChange={(event, value) => setMaxPrice(value)}
              fullWidth
              style={{ marginTop: 17 }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="conditionAtLeast"
              label="Condition At Least"
              id="conditionAtLeast"
              autoComplete="conditionAtLeast"
              select
              onChange={(event) => {setConditionAtLeast(event.target.value)}}
              sx={{ textAlign: "left" }}
            >
              {
                conditions.map((condition) => {
                  const conditionValue = (condition) ? condition : "None";
                  return (<MenuItem value={condition}>{conditionValue}</MenuItem>);
                })
              }
            </TextField>
            <Grid container justify='space-between' sx={{ mt: 3, mb: 2 }}>
                <Grid item xs={6}>
                    <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickCancel} >
                        Cancel
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button type="button" variant='contained' sx={{ width: '90%' }} onClick={onClickSearch} >
                        Search
                    </Button>
                </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default SearchForm;