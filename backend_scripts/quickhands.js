const User = require('./User.js');
const Mempool = require('./Mempool.js');

main = async () => {
    let users = [];

    let user = new User();
    let results = await user.getArmedUsers();
    console.log('Accounts initializing...');
    console.log(results);

    results.forEach( ethAddress => {
        let quickHandsUser = new User();

        quickHandsUser.init(ethAddress)
        .then(
            users.push(quickHandsUser)
        );
    })

    let mempool = new Mempool(users);
    mempool.watchTransactions();
}

main();