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


export const addCommas = (num) => {
    num = num.toFixed(2).toString();
    let returnString = num.substring(num.length - 3);

    count = 1;
    for (let i = num.length - 4; i >= 0; i--) {
        returnString = num.charAt(i) + returnString;
        if (count % 3 == 0 && i != 0) {
            returnString = "," + returnString
        }
        count += 1;
    }
    return returnString;
}


export const getPortfoliotValue = (num, digits) => {
    if (num < 100000) {
        //let toFixed = num.toFixed(digits).toString();

        return addCommas(num);
    }
    var si = [
        {value: 1, symbol: ""},
        {value: 1E3, symbol: "K"},
        {value: 1E6, symbol: "M"},
        {value: 1E9, symbol: "B"},
        {value: 1E12, symbol: "T"},
        {value: 1E15, symbol: "P"},
        {value: 1E18, symbol: "E"}
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}
