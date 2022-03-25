import Web3 from 'web3'; 
import { BN } from "web3-utils";
import { useMoralisWeb3Api } from "react-moralis";
import QuickHandsBuild from 'contracts/QuickHands.json';
import ERC20Build from 'contracts/ERC20.json';
export const QUICKHANDS_CONTRACT_ADDRESS = '0x2a628f42997D26864d78A31Bf94eF9A3543c5bBa';

let selectedAccount;
let QuickHandsContract;
let ERC20Contract;
let web3;
let provider;
let isInitialized = false;

export const init = async () => {
  provider = window.ethereum;

    if (typeof provider !== 'undefined') {
      //metamask is installed

      provider
        .request({method: 'eth_requestAccounts'})
        .then(accounts => {
          selectedAccount = accounts[0];
            console.log("Selected account is " + selectedAccount);
        })
        .catch(err => {
          console.log(err);
          return;
        });

        window.ethereum.on('accountsChanged', function(accounts) {
          selectedAccount = accounts[0];
          console.log("Selected account is " + selectedAccount);
        });
    }

    web3 = new Web3(provider);

    const networkId = await web3.eth.net.getId();

    QuickHandsContract = new web3.eth.Contract(
      QuickHandsBuild.abi,
      QUICKHANDS_CONTRACT_ADDRESS
    );
    console.log(QUICKHANDS_CONTRACT_ADDRESS);
    console.log(QuickHandsContract);

    ERC20Contract = new web3.eth.Contract(ERC20Build.abi);

    isInitialized = true;
}

export const weiToNum = (balance) => {
  return web3.utils.fromWei(balance, "ether" );
}

export const numberToHex = (number) => {
  return web3.utils.numberToHex(number);
}

export const enrollUser = async (backupWallet) => {
  if (!isInitialized) {
    await init();
  }

  return QuickHandsContract.methods
    .enrollUser(
      backupWallet
    )
    .send({from: selectedAccount})
    .then(console.log)
    .catch(console.error);
}

export const getAllowance = async (token) => {
  if (!isInitialized) {
    await init();
  }

  ERC20Contract.options.address = token; 

  return ERC20Contract.methods
    .allowance(
      selectedAccount,
      QUICKHANDS_CONTRACT_ADDRESS
    )
    .call({from: selectedAccount})
    .then(console.log)
    .catch(console.error);
}

export const revokeToken = async (token) => {
  if (!isInitialized) {
    await init();
  }

  let amount = 0;
  ERC20Contract.options.address = token; 

  return ERC20Contract.methods
    .approve(
      QUICKHANDS_CONTRACT_ADDRESS,
      amount
    )
    .send({from: selectedAccount})
    .then(console.log)
    .catch(console.error);
}

export const approveToken = async (token, amount) => {
  if (!isInitialized) {
    await init();
  }

  ERC20Contract.options.address = token; 

  return ERC20Contract.methods
    .approve(
      QUICKHANDS_CONTRACT_ADDRESS,
      amount
    )
    .send({from: selectedAccount})
    .then((tx) => function(tx) {
        console.log(tx);
        return true;
    })
    .catch(console.error);
}

export const enrollToken = async (token) => {
  if (!isInitialized) {
    await init();
  }     

  return QuickHandsContract.methods
    .enrollToken(
      token
    )
    .send({from: selectedAccount})
    .then(console.log)
    .catch(console.error);
}

export const getUserProfile = async () => {
  if (!isInitialized) {
    await init();
  }

  return QuickHandsContract.methods
    .getUserProfile()
    .call({from: selectedAccount})
    .catch(console.error);
}

export const tokenEnrolledInContract = async (token) => {
  if (!isInitialized) {
    await init();
  }

  let didMatch = false;
  let profile = await QuickHandsContract.methods
    .getUserProfile()
    .call({from: selectedAccount})
    .catch(console.error);  

  for (let i = 0; i < profile.enrolledTokens.length; i++) {
    if (profile.enrolledTokens[i].toLowerCase() == token) didMatch = true
  }

  return didMatch;
}

export const isEnrolled = async () => {
  if (!isInitialized) {
    await init();
  }

  return QuickHandsContract.methods
    .isEnrolled()
    .call({from: selectedAccount})
    .catch(console.error);
}

export const deleteUser = async () => {
  if (!isInitialized) {
    await init();
  }

  return QuickHandsContract.methods
    .deleteUser()
    .send({from: selectedAccount})
    .then(function(tx) {
      console.log(tx);
      window.location.reload(true);
    })
    .catch(console.error);
}

/**

export const getTokenLogo = async(token) => {
  const Web3Api = useMoralisWeb3Api();
  const options = {
    chain: 'bsc testnet',
    addresses: token
  };

  const tokenMetadata = await Web3Api.token.getTokenMetadata(options);
  console.log(tokenMetadata);
  //return tokenMetadata['logo'];
}

export const rescueToken = async () => {
  if (!isInitialized) {
    await init();
  }

  let amount = 100000;
  console.log(selectedAccount);

  return QuickHandsContract.methods
    .rescueToken(
      '0xDEADBEEF00000000000000000000000000000000',
      '0xd03c7803383c838cf290e262ffdb45a42de580cb',
      '0xe905cb4ecda1662498164552f4cb586def4a2440',
      amount
    )
    .send({from: selectedAccount})
    .then(console.log)
    .catch(console.error);
}
**/
