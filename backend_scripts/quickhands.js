const User = require('./User.js');
const Mempool = require('./Mempool.js');

main = async () => {
    let users = [];
    let user = new User();

    // get list of enrolled users in armed state
    let results = await user.getArmedUsers();
    console.log(`Accounts initializing...\n${results}`);

    // create array of users 
    results.forEach( ethAddress => {
        let quickHandsUser = new User();

        quickHandsUser.init(ethAddress)
        .then(
            users.push(quickHandsUser)
        );
    })

    // send users to Mempool for active monitoring 
    const mempool = new Mempool(users);
    mempool.watchTransactions();

    // on scam event, call rescueToken from smart contract
    mempool.on('scam', (scamTx) => {
        // track triggered tokens to avoid dup txs
        scamTx.user.triggered.push(scamTx.token);

        const logItem =  `
            [!] SCAM ALERT [!]
            hash => https://bscscan.com/tx/${scamTx.hash}
            victim => ${scamTx.victim}
            token => ${scamTx.token}
        `;
        console.log(logItem);

        // execute transfer to users backup wallet
        scamTx.user.rescueToken(
            scamTx.hash, 
            scamTx.token, 
            scamTx.gasPrice, // gas price of scammer 
            scamTx.gas // gas limit of scammer
        )
    })
}

main();