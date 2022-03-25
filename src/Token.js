import React, { useState, useEffect, useRef } from 'react';
import spinnerSm from './images/spinnerSm.svg';
import Button from '@mui/material/Button';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ImageIcon from '@mui/icons-material/Image';
import { getTokenLogos } from './tokenLogos';
import { getAllowance, approveToken, enrollToken, revokeToken, tokenEnrolledInContract } from './Web3Client';
import { ethers } from "ethers";

function Token(props) {
    const [loading, setLoading] = useState(false);
    const [allowance, setAllowance] = useState(props.allowance);
    const [tokenEnrolled, setTokenEnrolled] = useState(props.tokenEnrolled);
    let amountInput = React.createRef();
    let balance = ethers.utils.formatUnits(props.balance, props.decimals);
    let localLogos = getTokenLogos();
    let logo = props.logo?props.logo:localLogos[props.symbol];

    // FIX THIS - buggy as hell 
    // fix return values of each function as most return undefined and mess up the button state
    async function handleProtectToken(token) {
        let approved = false;
        let didEnroll = false;
        let allowance = 0;
        let amount = '0xfffffffffffffffffffffffffffffff'+
                     'fffffffffffffffffffffffffffffffff'; 

        setLoading(true);

        // first ensure token is approved for max spending
        approved = await approveToken(token, amount);

        if (approved) { // then get allowance and enroll token to qh contract
            allowance = await getAllowance(token);                                  // BUG returns undefined
            setAllowance(allowance); 

            if (await tokenEnrolledInContract(token)) {
                setTokenEnrolled(true);
            } else {
                didEnroll = await enrollToken(token);                               // BUG returns undefined
                if (didEnroll) setTokenEnrolled(true);
            }
        }
        setLoading(false);
    }

    async function handleRevokeToken(token) { // consider a delete token method from smart contract
        setLoading(true);
        await revokeToken(token, 0); // set allowance to 0
        console.log('get allowance => ', await getAllowance(token));                // BUG returns undefined
        setAllowance(await getAllowance(token));
        setLoading(false);
    }

    return(
        <div title={allowance}>
            <ListItem alt={allowance} sx={{mt: 2}}>
                <ListItemAvatar sx={{ ml: 2 }}>
                    <Avatar sx={{ width: 28, height: 28 }}>
                        {
                            (logo)
                            ? (
                                <img
                                    src={logo}
                                    width="28"
                                    height="28"
                                 />
                            ) : (
                                <Avatar>T</Avatar>
                            )
                        }
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={props.symbol} secondary={balance} />
                {
                    (loading) ? <img style={{paddingRight: '50px'}} src={spinnerSm} /> :
                    (allowance == 0 || !tokenEnrolled)
                    ? (
                        <span>
                            <Button sx={{ fontSize: 12, mr: 3 }} variant="contained" color="error"
                                onClick={() => 
                                    handleProtectToken
                                    (
                                        props.address,
                                    )}>
                                Protect
                            </Button>
                        </span>
                    ) : (
                        <span>
                            <Button sx={{ fontSize: 12, mr: 1 }} variant="outlined"
                                onClick={() => 
                                    handleRevokeToken
                                    (
                                        props.address,
                                    )}>
                                Revoke
                            </Button> <VerifiedUserOutlinedIcon sx={{ fontSize: 20 }}/>
                        </span>
                    )
                }
            </ListItem>
        </div>      
    )
}

export default Token;