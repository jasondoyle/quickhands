require('dotenv').config();
const Web3 = require('web3');
const Moralis = require('moralis/node');
const { PUBLIC_KEY_0, PRIVATE_KEY_0, HTTPS_PROVIDER_BSCMAINNET, QUICKHANDS_CONTRACT_ADDRESS } = process.env;
const { masterKey, appId, serverUrl } = process.env;
const QuickHandsBuild = require('../truffle/build/contracts/QuickHands.json');

class User{
    web3;
    quickHandsContractAddr = QUICKHANDS_CONTRACT_ADDRESS;
    quickHandsContract;
    userAddr;
    enrolledTokens = [];
    gasPricePercent; 
    gasLimitPercent; 
    triggered = [];
    

    init = async(wallet) => {
        this.web3 = new Web3(new Web3.providers.HttpProvider
        (
            HTTPS_PROVIDER_BSCMAINNET
        ));
        this.quickHandsContract = new this.web3.eth.Contract
        (
            QuickHandsBuild.abi,
            QUICKHANDS_CONTRACT_ADDRESS
        );
        this.userAddr = wallet.toLowerCase();

        await this.getEnrolledTokens();
        await this.getUserConfiguredGas();

        return this;
    }

    getArmedUsers = async () => {
        await Moralis.start({ serverUrl, appId, masterKey });
        let results = await Moralis.Cloud.run('getArmedUsers'); 
        return results;
    }

    getEnrolledTokens = async () => { 
        let profile = await this.quickHandsContract.methods.getUserProfileByAddress(
            this.userAddr
        )
        .call({from: PUBLIC_KEY_0})
        .catch(console.error);

        if (!profile) return;

        profile.enrolledTokens.forEach( (token) => {
            this.enrolledTokens.push(token.toLowerCase());
        });
        if (this.enrolledTokens.length == 0) {
            console.log('[-] No enrolled tokens for user ' + this.userAddr);
        }
    }

    // gasPrice defaults to 200% of scammer tx and gasLimit to 120%
    getUserConfiguredGas = async () => { 
        await Moralis.start({ serverUrl, appId, masterKey });
        const { pricePercent = 200 , limitPercent = 120 } = await Moralis.Cloud.run(
            'getGasConfig', 
            {'userAddr': this.userAddr}
        );  

        this.gasPricePercent = pricePercent;
        this.gasLimitPercent = limitPercent;
    }

    getTokenBalance = async (token) => {
        let balance;
        let minABI = [
            // balanceOf
            {
             "constant":true,
             "inputs":[{"name":"_owner","type":"address"}],
             "name":"balanceOf",
             "outputs":[{"name":"balance","type":"uint256"}],
             "type":"function"
            }
        ];
        let tokenContract = new this.web3.eth.Contract(minABI, token);
        balance = await tokenContract.methods.balanceOf(this.userAddr).call();

        return balance;
    }

    sendTx = async (signedTx) => { 
        console.log('[!] Attempting to front-run...');
        this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('transactionHash', function(hash) {
            console.log('Tx Hash ==> ' + hash + '\n')
        })
        .on('receipt', function(receipt) {
            console.log('[+] Tokens successfully sent to victim\'s backup wallet\n');
            console.log('####- Tx Receipt -####');
            console.log(receipt);
            return; 
        })
        .on('error', function(error, receipt) {
            console.log('[-] Front running tx failed');
            if (error) {
                console.log(error);
                console.log(receipt);
            }
            return;
        });
    }

    rescueToken = async (scamTxHash, token, gasPrice, gasLimit) => {  
        // apply user gas price adjustment as percent of scammer tx 
        gasPrice *= ( this.gasPricePercent / 100 );
        gasLimit *= ( this.gasLimitPercent / 100 );
        /**
        console.log('front-run gas price => ', gasPrice);
        console.log('front-run gas limit => ', gasLimit);
        console.log('user configured gas percent => ', this.gasPricePercent);
        console.log('user configured gas limit => ', this.gasLimitPercent);
        **/

        // transfer entire token balance to backup wallet
        let amount = await this.getTokenBalance(token);  

        let data = this.quickHandsContract.methods.rescueToken(
            scamTxHash,
            token,
            this.userAddr,
            amount
        ).encodeABI();

        const tx = {
            'to': this.quickHandsContractAddr, 
            'gasPrice': gasPrice,
            'gas': Math.round(gasLimit), 
            'data': data
        };
        const signedTx = await this.web3.eth.accounts.signTransaction(tx, PRIVATE_KEY_0);

        return this.sendTx(signedTx);
    }
}

module.exports = User