require('dotenv').config();
const Web3 = require('web3');
const EventEmitter = require('events');
const Moralis = require('moralis/node');
const User = require('./User.js');
const { masterKey, appId, serverUrl } = process.env;
const { QUICKHANDS_CONTRACT_ADDRESS, HTTPS_PROVIDER_BSCMAINNET, WSS_PROVIDER_BSCMAINNET } = process.env;

class Mempool extends EventEmitter {
    web3;
    web3ws;
    users = [];

    constructor(users) {
        super();
        this.users = users;
        this.web3 = new Web3(new Web3.providers.HttpProvider(
            HTTPS_PROVIDER_BSCMAINNET
        ));
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider(
            WSS_PROVIDER_BSCMAINNET
        ));
    }

    watchTransactions = () => {
        let txHashList = [];

        // only watching for scams using these methods
        const approveMethodId = '0x095ea7b3';
        const transferMethodId = '0xa9059cbb';

        console.log('[+] Monitoring Active');
        this.users.forEach( (user) => {
            console.log('[+] User => ' + user.userAddr);
        });

        let subscription = this.web3ws.eth.subscribe('pendingTransactions', (err, res) => {
            if(err) {
                console.error(err);
            }
        });

        const scanTx = (tx) => {
            if (!tx || !tx.to) return;

            let from = tx.from.toLowerCase();
            let token = tx.to.toLowerCase();
            let value = this.web3.utils.fromWei(tx.value, 'ether');
            let method = tx.input.slice(0, 10);
            console.log('tx hash ====> ' , tx.hash, '[', method, ']' );

            this.users.forEach( (user) => {
                // check if tx targets our user and one of their enrolled tokens
                if (from != user.userAddr) return
                if (!user.enrolledTokens.includes(token) || user.triggered.includes(token)) return
                if (method != approveMethodId && method != transferMethodId) return

                this.emit('scam', {
                    'user': user, // QH User object
                    'hash': tx.hash,
                    'victim': from,
                    'token': token,
                    'gasPrice': tx.gasPrice,
                    'gas': tx.gas
                });
                subscription.unsubscribe();  // hack for demo since throttled
            });
            return;
        }

        const fetchTx = (txHash) => {
            return this.web3.eth.getTransaction(txHash);
        }

        subscription.on('data', (txHash) => {
            txHashList.push(txHash);

            setTimeout( async function() {
                try {
                    const txPromises = txHashList.map(hash => fetchTx(hash));
                    const txResults = await Promise.all(txPromises);
                    const scanTxPromises = txResults.map(tx => scanTx(tx));
                    await Promise.all(scanTxPromises);
                } catch(err) {
                    console.error(err);
                }
                txHashList = []; 
            }, 500) // 1000 = 1 second
        });
    }
}

module.exports = Mempool