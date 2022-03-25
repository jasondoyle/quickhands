import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';
import { numberToHex, weiToNum } from './Web3Client';

function Events() {
    const { Moralis, user } = useMoralis();
    const Web3Api = useMoralisWeb3Api();
    const [events, setEvents] = useState();
    const [rows, setRows] = useState([]);

    useEffect(() => {   
        async function getRescueEvents() {
            const cloudRows = await Moralis.Cloud.run(
                'getRescueEvents',
                {'userAddr':user.get("ethAddress")}
            )
            setRows(cloudRows);
        }
        getRescueEvents();                                  
    });

    function NoRowsOverlay() {
      return (
        <Box sx={{display: 'flex-start', m: 15}} height="100%">
          No Events
        </Box>
      );
    }

    // to render image in field use `renderCell: ( params ) => <img src={params.value} />`

    const columns = [
        { field: 'id', headerName: '', width: 50 },
        { field: 'block_timestamp', headerName: 'Timestamp', width: 170, type: 'dateTime' },
        { 
            field: 'tokenSymbol', 
            headerName: 'Token',
            width: 70,
        },
        { 
            field: 'amount',
            headerName: 'Amount',
            width: 70,
            valueGetter: ({ value }) => value && weiToNum(value)

        },
        { 
            field: 'scamTxHash',
            headerName: 'Scammer Tx',
            width: 130,
            valueGetter: ({ value }) => value && numberToHex(value)

        },
        { field: 'transaction_hash', headerName: 'Front-run Tx', width: 130 },
        { field: 'result', headerName: 'Result', width: 100 }
    ];

    return(
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            height={20}
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            components={{ NoRowsOverlay }}
          />
        </div>
    )
}

export default Events;