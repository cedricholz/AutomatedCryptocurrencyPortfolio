import store from "react-native-simple-store";

export const saveSecrets = (exchange, APIkey, secretKey, refreshCoins) => {
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
            let coinData = {};
            coinData[currency] = {cur: currency, bal: balance};
            store
                .update("addedCoins", {
                    coinData
                })
                .then(res => {
                    refreshCoins();
                });
        } else {
            let retrievedData = res;
            let coinData = retrievedData.coinData;

            coinData[currency] = {cur: currency, bal: balance};

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
            let coinData = res.coinData;
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
