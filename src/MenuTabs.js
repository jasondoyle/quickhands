import * as React from 'react';
import TokenList from './TokenList';
import Events from './Events';
import Settings from './Settings';
import Paper from '@mui/material/Paper';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

function MenuTabs(props) {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ margin: 'auto', width: '50%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', margin: 'auto' }}>
          <TabList onChange={handleChange}>
            <Tab label="Tokens" value="1" />
            <Tab label="Settings" value="2" />
            <Tab label="Events" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ ml: '20%' }}>
          <Paper sx={{ width: '75%', overflow: 'hidden', bgcolor: '#F7F7F7'}}>
            <TokenList />
          </Paper>
        </TabPanel>
        <TabPanel value="2">
          <Paper sx={{ width: '100%', overflow: 'hidden', minHeight: 400, bgcolor: '#F7F7F7' }}>
            <Settings />
          </Paper>
        </TabPanel>
        <TabPanel value="3">
          <Paper sx={{ width: '100%', overflow: 'hidden', minHeight: 400, bgcolor: '#F7F7F7'}}>
            <Events />
          </Paper>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default MenuTabs;