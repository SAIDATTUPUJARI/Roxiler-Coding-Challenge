import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Container, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Rating,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        let url = 'http://localhost:5000/api/stores';
        if (searchQuery) {
          url = `http://localhost:5000/api/stores/search?query=${searchQuery}`;
        }
        const res = await axios.get(url);
        setStores(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStores();
  }, [searchQuery]);

  const handleRatingChange = async (storeId, newValue) => {
    try {
      await axios.post(`http://localhost:5000/api/stores/${storeId}/rate`, { rating: newValue });
      // Refresh the stores list to show updated ratings
      const res = await axios.get('http://localhost:5000/api/stores');
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Store Ratings
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Welcome, {user?.username}
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => navigate('/update-password')}
            sx={{ mr: 2 }}
          >
            Update Password
          </Button>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <TextField
            fullWidth
            label="Search stores by name or address"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Store Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Overall Rating</TableCell>
                  <TableCell>Your Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>{store.name}</TableCell>
                    <TableCell>{store.address}</TableCell>
                    <TableCell>
                      <Rating 
                        value={store.overall_rating || 0} 
                        precision={0.1} 
                        readOnly 
                      />
                      <Typography variant="body2">
                ({!isNaN(Number(store.overall_rating)) ? Number(store.overall_rating).toFixed(1) : 'N/A'})
              </Typography>

                    </TableCell>
                    <TableCell>
                      <Rating
                        value={store.user_rating || 0}
                        onChange={(event, newValue) => {
                          handleRatingChange(store.id, newValue);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
};

export default Stores;