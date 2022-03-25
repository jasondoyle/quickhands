import React, { useState, useEffect } from 'react';
//import List from '@mui/material/List';
import spinner from './images/spinnerSm.svg';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
//import Paper from '@mui/material/Paper';
//import { DataGrid } from '@mui/x-data-grid';
import { useMoralis } from 'react-moralis';
//import { numberToHex, weiToNum } from './Web3Client';
import { getUserProfile, deleteUser } from './Web3Client';

function Settings() {
	const { user, Moralis } = useMoralis();
	const [gasPricePercent, setGasPricePercent] = useState(200);
	const [gasLimitPercent, setGasLimitPercent] = useState(120);
	const [gasPriceLoader, setGasPriceLoader] = useState(false); 
	const [gasLimitLoader, setGasLimitLoader] = useState(false);

	useEffect(() => {
		async function getGasConfig() {
			setGasPriceLoader(true);
			setGasLimitLoader(true);
			const {pricePercent = 200, limitPercent = 120} = await Moralis.Cloud.run(
				'getGasConfig',
				{'userAddr': user.get('ethAddress')} 
			);
			setGasPricePercent(pricePercent);
			setGasLimitPercent(limitPercent);
			setGasPriceLoader(false);
			setGasLimitLoader(false);	
		}
		getGasConfig();									
	}, []);

	// for slider config
	const marks = [
		{
			value: 10,
			label: '10%',
		},
		{
			value: 100,
			label: '100%',
		},
		{
			value: 200,
			label: '200%',
		},
		{
			value: 300,
			label: '300%',
		},
	];

	function handleGetUserProfile() {
		getUserProfile()
		.then((tx) => {
			console.log(tx);
		})
		.catch((err) => {
			console.log(err);
		});
	}

	function handleDeleteUser(e) {
		e.preventDefault();
		deleteUser()
		.then((tx) => {
			console.log(tx);
		})
		.catch((err) => {
			console.log(err);
		});
	}

	// set state values for sliders
	function handleChangeGasPrice(event, value) {
		setGasPricePercent(value);			
	}

	function handleChangeGasLimit(event, value) {
		setGasLimitPercent(value);							
	}

	// show loader and commit to backend 
	async function handleCommitGasPrice(event, value) {
		setGasPriceLoader(true);					
		user.set('gasPricePercent', value); 
		user.save();						
		setTimeout( async () => {
			setGasPriceLoader(false);
		}, 2000) // 1000 = 1 second
	}

	async function handleCommitGasLimit(event, value) {
		setGasLimitLoader(true);			
		user.set('gasLimitPercent', value); 
		user.save();						
		setTimeout( async () => {
			setGasLimitLoader(false);
		}, 2000)
	}

	return(
	    <div style={{ width: '100%', background: '#F7F7F7'}}>
		    	<Box sx={{ display: 'flex-start', minHeight: 115, p:1, m:4, mb: 1 }}>
		    		{
			    		(gasPriceLoader) ? <img src={spinner} /> :
			    		<div>
							<Typography id="input-slider" gutterBottom>
								<b>Gas Price</b>< br/>
								(% of scammer Tx)
							</Typography>
							<Slider
								value={gasPricePercent}
								onChange={handleChangeGasPrice}
								onChangeCommitted={handleCommitGasPrice} // extra time to commit to backend
								step={10}
								marks={marks}
								min={10}
								max={300}
								valueLabelDisplay="auto"
							/>
						</div>
					}
				</Box>
		    	<Box sx={{ display: 'flex-start', minHeight: 115, p:1, m:4, my: 1 }}>
		    		{
			    		(gasLimitLoader) ? <img src={spinner} /> :
			    		<div>
							<Typography id="input-slider" gutterBottom>
								<b>Gas Limit</b>< br/>
								(% of scammer Tx)
							</Typography>
							<Slider
								value={gasLimitPercent}
								onChange={handleChangeGasLimit}
								onChangeCommitted={handleCommitGasLimit} // extra time to commit to backend
								step={10}
								marks={marks}
								min={10}
								max={300}
								valueLabelDisplay="auto"
							/>
						</div>
					}
				</Box>
	    	<Button 
	    		sx={{ fontSize: 12, my: 3 }} 
	    		style={{ height: 40 }}
	    		variant='contained'
	    		onClick={handleGetUserProfile}>
	    		Log Profile to Console
	    	</Button>
			<Button 
				onClick={(e) => handleDeleteUser(e)}>
				Unenroll
			</Button>
	    </div>
	)
}

export default Settings;