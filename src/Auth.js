import React, { useState, useEffect } from 'react';
import spinner from './images/spinner.svg';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import detectEthereumProvider from '@metamask/detect-provider';
import { useMoralis } from 'react-moralis';

function Auth() {
  const { authenticate, isAuthenticated, isAuthenticating, user, logout } = useMoralis();

  const handleLogin = async (event) => {

    // check if metamask installed
    const provider = await detectEthereumProvider();
    if (!provider) console.log('Please install MetaMask!');

    if (window.ethereum.networkVersion != 56) {
      console.log('Error: Switch metamask to BSC network (chain 56)');
      return;
    }

    if (!isAuthenticated) {
      await authenticate({signingMessage: "Metamask Login" })
        .then(function (user) {
          console.log("logged in user:", user.get("ethAddress"));
          document.getElementById('login').innerHTML = user.get("ethAddress");
        })
        .catch(function (error) {
          console.log(error);
        });
      }
  }

  const handleLogout = async () => {
    await logout();
    console.log("logged out");
    document.getElementById('login').innerHTML = "Metamask Login";
  }

  return(
    <Box sx={{ mb: 4 }}>
      <Button
        variant={!isAuthenticated?"contained":"outlined"}
        id="login"
        onClick={handleLogin}>{isAuthenticated?user.get("ethAddress"):"Metamask Login"}
      </Button>
      <Button
        variant="contained"
        onClick={handleLogout}
        disabled={isAuthenticating||!isAuthenticated}>
        Logout
      </Button>
      <p>
        {isAuthenticating ? <img src={spinner} /> : null}
      </p>
    </Box>    
  )
}

export default Auth;