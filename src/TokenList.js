import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import spinner from './images/spinner.svg';
import Box from '@mui/material/Box';
import { useMoralisWeb3Api, useMoralis } from 'react-moralis';
import { allowance, getUserProfile, QUICKHANDS_CONTRACT_ADDRESS } from './Web3Client';
import Token from './Token';

function TokenList() {
    const [loading, setLoading] = useState(false);
    const [tokenData, setTokenData] = useState([]);
    const [userProfile, setUserProfile] = useState(false);
    const [fetched, setFetched] = useState();
    const Web3Api = useMoralisWeb3Api();
    const { user, isAuthenticated } = useMoralis();

    useEffect(() => {
        async function saveUserProfile() {
            let profile = await getUserProfile();
            setUserProfile(profile);
        }
        saveUserProfile();
    }, []);

    useEffect(() => {
        function tokenIsEnrolled(tokenAddress) {
            for (let i = 0; i<userProfile.enrolledTokens.length; i++) {
                let enrolledToken = userProfile.enrolledTokens[i].toLowerCase()
                if (enrolledToken == tokenAddress) return true;
            }
        }

        async function fetchUserTokenData() {
            // get user token balances
            const tokenData = await Web3Api.account.getTokenBalances({
                chain: "bsc",                                    
                address: user.get("ethAddress") 
            });

            for (let i=0; i<tokenData.length; i++) {
                let token = tokenData[i];

                // check which tokens already have allowances
                const amount = await Web3Api.token.getTokenAllowance({
                    chain: "bsc",                                   
                    owner_address: user.get("ethAddress"),
                    spender_address: QUICKHANDS_CONTRACT_ADDRESS,
                    address: tokenData[i].token_address
                });
                token['allowance'] = amount['allowance'];
                token['tokenEnrolled'] = false;

                // function to check if token is enrolled
                if (tokenIsEnrolled(token.token_address)) {
                    token['tokenEnrolled'] = true;
                }
            }

            let tokenList = tokenData.map(token => {
                return <Token
                        key={token.token_address}
                        thumbnail={token.thumbnail}
                        logo={token.logo}
                        symbol={token.symbol}
                        name={token.name}
                        address={token.token_address}
                        balance={token.balance}
                        decimals={token.decimals}
                        allowance={token.allowance}
                        tokenEnrolled={token.tokenEnrolled}
                        />;
            })
            setTokenData(tokenList);
            setLoading(false);
        }
        if (userProfile.length > 0) {
            setLoading(true);
            fetchUserTokenData();
        }
        
        // unsubscribe web3api / causing mount errors

    }, [userProfile]);

    return(
        <div>
            <Box sx={{ minHeight: 400, mx:2, my: 2 }}>
            {
                (loading)
                ?   
                    <Box><img src={spinner} /></Box>
                :
                    <List sx={{ width: '100%' }}>
                         {tokenData}
                    </List>
            }
            </Box>
        </div>      
    )
}

export default TokenList;