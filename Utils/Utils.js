import store from "react-native-simple-store";

export const saveSecrets = (exchange, APIkey, secretKey, refreshCoins) => {
  const secrets = { key: APIkey, secret: secretKey };

  store
    .update(exchange, {
      exchangeName: exchange,
      key: APIkey,
      secret: secretKey
    })
    .then(res => {
      refreshCoins();
    });
};

export const saveAddedCoin = (currency, balance, refreshCoins) => {
  store.get("addedCoins").then(res => {
    if (res == null) {
      var coinData = {};
      coinData[currency] = { cur: currency, bal: balance };
      store
        .update("addedCoins", {
          coinData
        })
        .then(res => {
          refreshCoins();
        });
    } else {
      var retrievedData = res;
      var coinData = retrievedData.coinData;

      coinData[currency] = { cur: currency, bal: balance };

      store
        .update("addedCoins", {
          coinData
        })
        .then(res => {
          refreshCoins();
        });
    }
  });
};

export const deleteCoin = (currency, refreshCoins) => {
  store.get("addedCoins").then(res => {
    if (res != null) {
      var coinData = res.coinData;
      delete coinData[currency];

      store.delete("addedCoins").then(res => {
        store
          .update("addedCoins", {
            coinData
          })
          .then(res => {
            refreshCoins();
          });
      });
    }
  });
};
