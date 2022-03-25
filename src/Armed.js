import React, { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import { useMoralis } from 'react-moralis';

function Armed() {
	const { user } = useMoralis();
	const [armed, setArmed] = useState();							

	useEffect(() => {	
		setArmed(user.get('isArmed'));									
	});

	const handleChangeArmed = async () => {  
		let current = user.get('isArmed');
		user.set('isArmed', !current); 
		user.save();					// set armed state in moralis db
		setArmed(!current);				// and in react state
	}

	return(
		<div style={{'marginBottom': '30px', 'marginTop': '10px', 'fontSize': '20px'}}>
    		Protection Armed
			<Switch 
				checked={(armed)?true:false}
				onChange={handleChangeArmed}
			/>
		</div>	
	)
}

export default Armed;