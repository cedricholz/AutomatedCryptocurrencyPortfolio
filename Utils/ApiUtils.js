const CryptoJS = require("crypto-js");
import axios from "react-native-axios";
import store from "react-native-simple-store";

import { Alert } from "react-native";

export const bittrexAPI = (
  heldKeys,
  exchangeBalances,
  exchangeKeys,
  coinCrossRoads
) => {
  console.log("BITTREX");

  const APIKey = exchangeKeys.key;
  const secretKey = exchangeKeys.secret;
  const nonce = new Date().getTime();
  const uri = `https://bittrex.com/api/v1.1/account/getbalances?apikey=${APIKey}&nonce=${nonce}`;
  const sig = CryptoJS.HmacSHA512(uri.replace(/\&$/, ""), secretKey).toString();

  axios({
    url: uri,
    headers: {
      apisign: sig
    }
  })
    .then(response => {
      const allCoins = response.data.result;

      const bittrexBalances = {};

      Object.keys(allCoins).forEach(key => {
        const balance = parseFloat(allCoins[key].Balance);

        if (balance !== 0) {
          const symbol = allCoins[key].Currency;
          bittrexBalances[symbol] = { cur: symbol, bal: balance };
        }
      });

      exchangeBalances.bittrex = bittrexBalances;

      coinCrossRoads(heldKeys, exchangeBalances);
    })
    .catch(error => {
      console.log("BITTREX ERROR");
      console.log(error);

      if (
        error
          .toString()
          .includes(
            "TypeError: Requested keys of a value that is not an object."
          )
      ) {
        store.delete("bittrex");

        Alert.alert(
          "Error Retrieving Bittrex Data",
          "API or Secret Key Invalid",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
      coinCrossRoads(heldKeys, exchangeBalances);
    });
};

export const binanceAPI = (
  heldKeys,
  exchangeBalances,
  exchangeKeys,
  coinCrossRoads
) => {
  console.log("BINANCE");
  const Configs = {
    endPointUrl: "https://www.binance.com/api/v3/account/",
    APIKey: exchangeKeys.key,
    secretKey: exchangeKeys.secret
  };

  var timeStamp = new Date().getTime();
  var recvWindow = "6000000";

  var payload = `timestamp=${timeStamp}&recvWindow=${recvWindow}`;

  var sig = CryptoJS.HmacSHA256(
    payload.replace(/\&$/, ""),
    Configs.secretKey
  ).toString();

  axios({
    url: `https://api.binance.com/api/v3/account?${payload}&signature=${sig}`,
    headers: {
      "x-mbx-apikey": Configs.APIKey
    }
  })
    .then(response => {
      var binanceBalances = {};

      const apiBalances = response.data.balances;
      for (let coin in apiBalances) {
        var symbol = apiBalances[coin].asset;
        var coinBalance = parseFloat(apiBalances[coin].free);
        if (coinBalance !== 0) {
          if (symbol == "IOTA") {
            binanceBalances["MIOTA"] = { cur: "MIOTA", bal: coinBalance };
          } else {
            binanceBalances[symbol] = { cur: symbol, bal: coinBalance };
          }
        }
      }

      exchangeBalances.binance = binanceBalances;

      coinCrossRoads(heldKeys, exchangeBalances);
    })
    .catch(error => {
      console.log("ERROR");
      console.log(error);
      if (error.response.data.msg == "API-key format invalid.") {
        store.delete("binance");

        Alert.alert(
          "Error Retrieving Binance Data",
          "API or Secret Key Invalid",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
      coinCrossRoads(heldKeys, exchangeBalances);
    });
};

export const kucoinAPI = (
  heldKeys,
  exchangeBalances,
  exchangeKeys,
  coinCrossRoads
) => {
  console.log("Kucoin");

  const host = "https://api.kucoin.com"
  const endpoint = "/v1/account/balance"


  APIKey = "5a5997a9379b472b2f02bb6a"
  secretKey = "032031a1-5ae1-47a7-9f02-fa9dd9e418aa"
  // APIKey: exchangeKeys.key,
  // secretKey: exchangeKeys.secret
  queryString = ""
  const nonce = new Date().getTime();

  stringForSign = `${endpoint}/${nonce}/${queryString}`

  var sig = CryptoJS.HmacSHA256(
    stringForSign.replace(/\&$/, ""),
    secretKey
  ).toString();

  axios({
    url: `https://api.binance.com/api/v3/account?${queryString}`,
    headers: {
      "KC-API-KEY": APIKey,
      "KC-API-NONCE" : nonce,
      "KC-API-SIGNATURE": sig
    }
  })
    .then(response => {
      console.log(response);

      coinCrossRoads(heldKeys, exchangeBalances);
    })
    .catch(error => {
      console.log("ERROR");
      console.log(error);
      if (error.response.data.msg == "API-key format invalid.") {
        store.delete("kucoin");

        Alert.alert(
          "Error Retrieving Kucoin Data",
          "API or Secret Key Invalid",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
      coinCrossRoads(heldKeys, exchangeBalances);
    });
};
