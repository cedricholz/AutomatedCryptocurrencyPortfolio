const CryptoJS = require("crypto-js");
import axios from "react-native-axios";
import store from "react-native-simple-store";
import {decodeUTF8, encodeUTF8} from "./../Utils/UTF8Utils.js";
import {Alert} from "react-native";

export const bittrexAPI = (heldKeys,
                           exchangeBalances,
                           exchangeKeys,
                           coinCrossRoads) => {
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
                    bittrexBalances[symbol] = {cur: symbol, bal: balance};
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
                    [{text: "OK", onPress: () => console.log("OK Pressed")}]
                );
            }
            coinCrossRoads(heldKeys, exchangeBalances);
        });
};


export const binanceAPI = (heldKeys,
                           exchangeBalances,
                           exchangeKeys,
                           coinCrossRoads) => {
    console.log("BINANCE");
    const Configs = {
        endPointUrl: "https://www.binance.com/api/v3/account/",
        APIKey: exchangeKeys.key,
        secretKey: exchangeKeys.secret
    };

    let timeStamp = new Date().getTime();
    let recvWindow = "20000";

    let payload = `timestamp=${timeStamp}&recvWindow=${recvWindow}`;

    let sig = CryptoJS.HmacSHA256(
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
            let binanceBalances = {};

            const apiBalances = response.data.balances;
            for (let coin in apiBalances) {
                let symbol = apiBalances[coin].asset;
                const coinBalance = parseFloat(apiBalances[coin].free);
                if (coinBalance !== 0) {
                    if (symbol === "IOTA") {
                        binanceBalances["MIOTA"] = {cur: "MIOTA", bal: coinBalance};
                    } else {
                        binanceBalances[symbol] = {cur: symbol, bal: coinBalance};
                    }
                }
            }

            exchangeBalances.binance = binanceBalances;

            coinCrossRoads(heldKeys, exchangeBalances);
        })
        .catch(error => {
            console.log("BINANCE ERROR");
            console.log(error);
            if (error.response.data.msg === "API-key format invalid.") {
                store.delete("binance");

                Alert.alert(
                    "Error Retrieving Binance Data",
                    "API or Secret Key Invalid",
                    [{text: "OK", onPress: () => console.log("OK Pressed")}]
                );
            }
            coinCrossRoads(heldKeys, exchangeBalances);
        });
};
const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const base64 = input => {

    let str = input;
    let output = "";

    for (
        let block = 0, charCode, i = 0, map = chars;
        str.charAt(i | 0) || ((map = "="), i % 1);
        output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
        charCode = str.charCodeAt((i += 3 / 4));

        if (charCode > 0xff) {
            throw new Error(
                "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
            );
        }

        block = (block << 8) | charCode;
    }

    return output;
};


const decodeBase64 = input => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 === 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
         buffer = str.charAt(i++);

         ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
         bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
        buffer = chars.indexOf(buffer);
    }

    return output;
}


const kucoinAxiosRequest = (host, endpoint, exchangeKeys, page) => {
    const APIKey = exchangeKeys.key;
    const secretKey = exchangeKeys.secret;

    const queryString = `limit=20&page=${page}`
    const nonce = new Date().getTime();
    const stringForSign = `${endpoint}/${nonce}/${queryString}`;
    const signatureStr = base64(stringForSign).replace(/\&$/, stringForSign);

    const signatureResult = CryptoJS.HmacSHA256(
        signatureStr.replace(/\&$/, ""),
        secretKey
    ).toString();

    return axios({
        url: `${host}${endpoint}?${queryString}`,
        headers: {
            "Content-Type": "application/json",
            "KC-API-KEY": APIKey,
            "KC-API-NONCE": nonce,
            "KC-API-SIGNATURE": signatureResult
        }
    })
}

const updateKucoinData = (kucoinBalances, dataList) => {
    console.log(dataList)
    for (let i in dataList) {

        const coinBalance = parseFloat(dataList[i].balance);
        const symbol = dataList[i].coinType;

        if (coinBalance > 0) {
            kucoinBalances[symbol] = {cur: symbol, bal: coinBalance}
        }
    }
}


export const kucoinAPI = (heldKeys,
                          exchangeBalances,
                          exchangeKeys,
                          coinCrossRoads) => {
    console.log("KUCOIN");

    const APIKey = exchangeKeys.key;
    const secretKey = exchangeKeys.secret;

    const host = "https://api.kucoin.com";
    const endpoint = "/v1/account/balances";

    const queryString = "limit=20&page=1"

    const nonce = new Date().getTime();
    const stringForSign = `${endpoint}/${nonce}/${queryString}`;


    const signatureStr = base64(stringForSign).replace(/\&$/, stringForSign);

    const signatureResult = CryptoJS.HmacSHA256(
        signatureStr.replace(/\&$/, ""),
        secretKey
    ).toString();

    axios({
        url: `${host}${endpoint}?${queryString}`,
        headers: {
            "Content-Type": "application/json",
            "KC-API-KEY": APIKey,
            "KC-API-NONCE": nonce,
            "KC-API-SIGNATURE": signatureResult
        }
    })
        .then(response => {
            //console.log(response);
            if (response.data.data.msg == 'Invalid nonce') {
                Alert.alert(
                    "Kucoin Server Error",
                    "Unable to retrieve Kucoin coins, server may be overloaded",
                    [{text: "OK", onPress: () => console.log("OK Pressed")}]
                );
            }
            else {
                let kucoinBalances = {};
                console.log("FIRST TIME")
                updateKucoinData(kucoinBalances, response.data.data.datas);
                promises = []
                pageNos = response.data.data.pageNos;

                curPage = 2;
                while (curPage <= pageNos) {
                    promises.push(kucoinAxiosRequest(host, endpoint, exchangeKeys, curPage))
                    curPage += 1;
                }
                axios.all(promises)
                    .then(axios.spread(function (...args) {

                        for (let i in args) {
                            let dataList = args[i].data.data.datas;
                            updateKucoinData(kucoinBalances, dataList)
                        }

                        exchangeBalances.kucoin = kucoinBalances;
                        console.log(exchangeBalances);
                        coinCrossRoads(heldKeys, exchangeBalances);
                    })).catch(error => {
                    console.log(error)
                })
            }


        })
        .catch(error => {
            console.log("ERROR");
            console.log(error);
            if (error.response.data.msg === "Invalid API Key") {
                store.delete("kucoin");

                Alert.alert(
                    "Error Retrieving Kucoin Data",
                    "API or Secret Key Invalid",
                    [{text: "OK", onPress: () => console.log("OK Pressed")}]
                );
            }
            coinCrossRoads(heldKeys, exchangeBalances);
        });
};


export const cryptopiaAPI = (heldKeys,
                             exchangeBalances,
                             exchangeKeys,
                             coinCrossRoads) => {
    console.log("Cryptoptia");

    const APIKey = "cbf1eb63026b4f96b69babeb613c8fa1";
    const secretKey = "R0Ekvs0vkbXAX5THJ6CDIATMx553YBxOSUOOA17AT4A";

    const uri = 'https://www.cryptopia.co.nz/Api/GetBalance';

    const nonce = new Date().getTime().toString();
    //const nonce = '1515916243'

    const encodedURI = encodeURIComponent('https://www.cryptopia.co.nz/api/GetBalance').toLowerCase();

    const signature = `${APIKey}POST${encodedURI}${nonce}mZFLkyvTelC5g8XnyQrpOw==`;
    console.log("SIGNATURE");
    console.log(signature);

    const bufferedSecretKey = secretKey + "=".repeat(4 - secretKey.length % 4)

    const apiDecoded = decodeBase64(bufferedSecretKey);
    console.log("apiDecoded");
    console.log(apiDecoded);
    console.log(" ");

    console.log("signature");
    console.log(signature);
    console.log(" ");
    const signatureEncoded = encodeUTF8(signature);
    console.log("signatureEncoded");
    console.log(signatureEncoded);
    console.log(" ");

    const hmacsignature = base64(CryptoJS.HmacSHA256(apiDecoded, signature).toString());
    console.log("hmacsignature");
    console.log(hmacsignature);
    console.log(" ");

    const hmacDecoded = decodeUTF8(hmacsignature);
    console.log("hmacDecoded");
    console.log(hmacDecoded);
    console.log(" ");

    const header_val = `amx ${APIKey}:${hmacDecoded}:${nonce}`;
    console.log("header_val");
    console.log(header_val);
    console.log(" ");


    axios({
        url: "https://www.cryptopia.co.nz/api/GetBalance",
        method: "POST",
        headers: {
            Authorization: header_val,
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
        .then(response => {
            console.log(response);

            coinCrossRoads(heldKeys, exchangeBalances);
        })
        .catch(error => {
            console.log("ERROR");
            console.log(error);
            if (error.response.data.msg === "API-key format invalid.") {
                store.delete("kucoin");

                Alert.alert(
                    "Error Retrieving Kucoin Data",
                    "API or Secret Key Invalid",
                    [{text: "OK", onPress: () => console.log("OK Pressed")}]
                );
            }
            coinCrossRoads(heldKeys, exchangeBalances);
        });
};
