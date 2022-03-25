Moralis.Cloud.define("armedState", async (request) => {
    const userAddr = request.params.userAddr
    const query = new Parse.Query('User');
    query.equalTo('ethAddress', userAddr);
    query.select('isArmed');
    const results = await query.find({ useMasterKey: true });
    return results[0].get('isArmed');
});

Moralis.Cloud.define("getUsers", async (request) => {
    const query = new Parse.Query('User');
    query.select('ethAddress');
    const results = await query.find({ useMasterKey: true });
    return results;
});

Moralis.Cloud.define("getArmedUsers", async (request) => {
    const query = new Parse.Query('User');
    query.equalTo('isArmed', true);
    const results = await query.find({ useMasterKey: true });
    let addresses = [];
    for (let i=0; i<results.length; i++) {
      addresses.push(results[i].get('ethAddress'));
    }
    return addresses;
});

Moralis.Cloud.define("getRescueEvents", async (request) => {
    // function that requests token metadata and returns just token logo to include in events dataset
    async function getTokenLogoAndSymbol(token) {
    let chain = 'bsc';
    let url = 
          'https://deep-index.moralis.io/api/v2/erc20/metadata' +
          '?chain=' + chain + 
          '&addresses=' + token;
      
    return Moralis.Cloud.httpRequest({
        url: url,
        headers: {
         'accept': 'application/json',
         'X-API-Key': 'X-API-KEY'
        }
      }).then( function(httpResponse) {
        let logo = httpResponse.data[0].logo;
        let symbol = httpResponse.data[0].symbol;
        return { logo, symbol };
      }, function(httpResponse) {
          logger.info("error");
          logger.info(httpResponse);
      })
    }

    const userAddr = request.params.userAddr
    let dataSet = [];
    const query = new Parse.Query('RescueEvents');
    query.equalTo('victimWallet', userAddr);
    const results = await query.find();
    for (let i = 0; i < results.length; i++) {
      let row = {};
      const {logo=null, symbol=null} = await getTokenLogoAndSymbol(results[i].get('token')); // use token address to fetch logo from moralis api
      let keys = ['block_timestamp','amount','scamTxHash','transaction_hash'];
      row['id'] = i+1; // create row id
      row['result'] = 'Success'; // if event fired then front-run was successful
      row['tokenLogo'] = logo;
      row['tokenSymbol'] = symbol;
      for (let k = 0; k < keys.length; k++) {
          row[keys[k]] = results[i].get(keys[k]);
      }
      dataSet.push( row );
    }
    return dataSet;
});

Moralis.Cloud.define("getGasConfig", async (request) => {
    const userAddr = request.params.userAddr
    const query = new Parse.Query('User');
    query.equalTo('ethAddress', userAddr);
    const results = await query.find({ useMasterKey: true });
    let pricePercent = results[0].get('gasPricePercent');
    let limitPercent = results[0].get('gasLimitPercent');
    return { pricePercent, limitPercent };
});