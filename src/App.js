import React, { useState, useEffect } from 'react';
import logo from './images/quick_hands_logo.png';
import './App.css';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Auth from './Auth';
import Enroll from './Enroll';
import BottomNavigation from './BottomNavigation';
import { useMoralis } from 'react-moralis';

function App() {
  const { isAuthenticated } = useMoralis(false);

  return (
    <React.Fragment>
      <Container maxWidth='xl' sx={{ alignContent: 'center' }}>
        <Box >
          <div className="App">
            <div>
              <h1><img width='400px' src={logo} /></h1>
            </div>
            <Auth />
            {isAuthenticated && <Enroll />}
          </div>
        </Box>
        <BottomNavigation />
      </Container>
    </React.Fragment>
  );
}

export default App;