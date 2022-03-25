import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import spinner from './images/spinner.svg';
import { isEnrolled, enrollUser } from './Web3Client';
import { useMoralisWeb3Api, useMoralis } from 'react-moralis';
import Armed from './Armed';
import MenuTabs from './MenuTabs';

function Enroll() {
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState(false);                        
    let walletInput = React.createRef();
    const Web3Api = useMoralisWeb3Api();
    const { user } = useMoralis();

    useEffect(() => {
    async function getEnrolledStatus() {
        const resp = await isEnrolled();
        setEnrolled(resp);
    }
    getEnrolledStatus();
    }, []);

    // Add error when backup wallet is same as hot wallet
    function handleEnroll(wallet, e) { 
        e.preventDefault();
        setLoading(true);
        enrollUser(wallet)
        .then((tx) => {
            console.log(tx);
            setLoading(false);
            setEnrolled(true);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }

    return(
        <div>
            {
                (loading) ? <img src={spinner} /> :
                (!enrolled) ?
                (
                    <form>
                        <label
                            title="Where your tokens are sent when a is scam detected">
                            Backup Wallet Address:
                        </label>
                        <input
                            ref={walletInput}
                            type="text"
                            size="47"
                            title="Where your tokens are sent when a is scam detected"
                            placeholder="0x..."/>
                        <br /><br />
                        <Button 
                            variant="contained"
                            onClick={ (e) => handleEnroll(walletInput.current.value, e) }>
                            Enroll User
                        </Button>
                    </form>
                ) : (
                    <span>
                        <Armed />
                        <MenuTabs />
                    </span>
                )
            }
        </div>      
    )
}

export default Enroll;