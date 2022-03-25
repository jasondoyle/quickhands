import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import SourceIcon from '@mui/icons-material/Source';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 3 }}>
		<BottomNavigation showLabels>
		    <BottomNavigationAction
		    	label="Twitter"
		    	icon={<TwitterIcon />}
		    	href="https://twitter.com/_jasondoyle"
		    	target="_blank" />
		    <BottomNavigationAction
		    	sx={{ mx: 5 }}
		    	label="Source Code"
		    	icon={<GitHubIcon />}
		    	href="https://github.com/jasondoyle"
		    	target="_blank" />
		    <BottomNavigationAction 
		    	label="BSC Contract"
		    	icon={<SourceIcon />}
		    	href="https://bscscan.com/address/0x2a628f42997D26864d78A31Bf94eF9A3543c5bBa"
		    	target="_blank" />
	    </BottomNavigation>
    </Box>
  );
}