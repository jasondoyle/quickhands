require('dotenv').config();
const Web3 = require('web3');
const Moralis = require('moralis/node');
const User = require('./User.js');
const { masterKey, appId, serverUrl } = process.env;
const { QUICKHANDS_CONTRACT_ADDRESS, HTTPS_PROVIDER_BSCMAINNET, WSS_PROVIDER_BSCMAINNET } = process.env;

class Mempool {
	web3;
	web3ws;
	users = [];

	constructor(users) {
		this.users = users;
		this.web3 = new Web3(new Web3.providers.HttpProvider(
			HTTPS_PROVIDER_BSCMAINNET
		));
		this.web3ws = new Web3(new Web3.providers.WebsocketProvider(
			WSS_PROVIDER_BSCMAINNET
		));
	}

	watchTransactions = () => {
		// only watching for scams using methods
		const approveMethodId = '0x095ea7b3';
		const transferMethodId = '0xa9059cbb';

		console.log('[+] Monitoring Active');
		this.users.forEach( (user) => {
			console.log('[+] User => ' + user.userAddr + '\n');
		});

		let subscription = this.web3ws.eth.subscribe('pendingTransactions', (err, res) => {
			if(err) {
				console.error(err);
			}
		});

		subscription.on('data', (txHash) => {
			setTimeout( async () => {
				try {					
					let tx = await this.web3.eth.getTransaction(txHash);

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

						// track tokens that have triggered so we don't duplicate the tx
						user.triggered.push(token);

						console.log('[!] SCAM ALERT [!]');
						console.log('hash => https://bscscan.com/tx/' + tx.hash);
						console.log('victim => ', from);
						console.log('token => ', token);
						/**
						console.log('gasPrice => ', tx.gasPrice);
						console.log('gasLimit => ', tx.gas);
						**/

						// execute transfer to users backup wallet
						user.rescueToken(
							tx.hash, // scammer tx that triggered rescue
							token, // token being stolen
							tx.gasPrice, // gas price of scammer 
							tx.gas // gas limit of scammer
						)
						subscription.unsubscribe();  // hack for demo since throttled
					})
				} catch (err) {
					console.error(err);
				}
			}, 500) // 1000 = 1 second
		});
	}
}

module.exports = Mempool