import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    RefreshControl,
    Alert,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "react-native-axios";
import CoinCard from "./CoinCard";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import store from "react-native-simple-store";
import {saveAddedCoin, deleteCoin} from "./../Utils/Utils.js";
import {bittrexAPI, binanceAPI, kucoinAPI, cryptopiaAPI} from "./../Utils/ApiUtils.js";


const exchanges = ["bittrex", "binance", "kucoin", "cryptopia"];

class CoinContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            addedCoins: [{cur: "BTC", bal: 0}, {cur: "ETH", bal: 0}],
            portValue: 0,
            isLoading: true,
            editModalIsVisible: false,
            editSymbol: "",
            editBalance: 0,
            exchangeBalances: {},
            coinMarketCapDict: "",
            myCoins: {
                dict: {}
            },
            coinFunctions: {
                bittrex: bittrexAPI,
                binance: binanceAPI,
                kucoin: kucoinAPI,
                cryptopia: cryptopiaAPI
            }
        };
    }

    componentDidMount() {
        //this.state.coinFunctions['cryptopia']("", "","",this.coinCrossRoads)
        this.loadAddedCoins();
    }

    loadAddedCoins = () => {
        console.log("LOADING ADDED COINS");

        store.get("addedCoins").then(res => {
            let addedCoinList = [];
            if (res != null) {
                Object.keys(res.coinData).forEach(key => {
                    let coin = res.coinData[key];
                    addedCoinList.push(coin);

                    this.setState({
                        addedCoins: addedCoinList
                    });
                });
            }
            if (addedCoinList.length === 0) {
                addedCoinList = [{cur: "BTC", bal: 0}, {cur: "ETH", bal: 0}];
            }
            this.setState({
                addedCoins: addedCoinList
            });
            this.loadKeys();
        });
    };

    loadKeys = () => {
        console.log("LOADING KEYS");

        let heldKeys = {};
        let promises = [];
        for (let i in exchanges) {
            let exchangePromise = store.get(exchanges[i]);
            promises.push(exchangePromise);
        }
        Promise.all(promises).then(retrievedKeys => {
            for (let i in retrievedKeys) {
                let keyData = retrievedKeys[i];
                if (keyData != null) {
                    heldKeys[keyData.exchangeName] = keyData;
                }
            }
            this.getCoinMarketCapDict(heldKeys);
        });
    };

    getCoinMarketCapDict = heldKeys => {
        console.log("COINMARKETCAP");
        axios
            .get("https://api.coinmarketcap.com/v1/ticker/?limit=20")
            .then(response => {
                const coinDict = {};
                //Create Dictionary of Coin MarketCap Coins
                Object.keys(response.data).forEach(key => {
                    const symbol = response.data[key].symbol;

                    coinDict[symbol] = response.data[key];
                });
                this.setState({
                    coinMarketCapDict: coinDict
                });
                const exchangeBalances = {};

                this.coinCrossRoads(heldKeys, exchangeBalances);
            })
            .catch(error => {
                console.log(error);
                Alert.alert(
                    "Error Retrieving CoinMarketCap Data",
                    "Check your internet connection",
                    [{text: "OK", onPress: () => console.log("OK Pressed")}]
                );
                this.setState({
                    refreshing: false,
                    isloading: false
                });
            });
    };

    coinCrossRoads = (heldKeys, exchangeBalances) => {
        console.log("CROSSROADS");
        if (Object.keys(heldKeys).length > 0) {
            const exchangeKeys = heldKeys[Object.keys(heldKeys)[0]];
            const exchangeName = heldKeys[Object.keys(heldKeys)[0]].exchangeName;
            delete heldKeys[exchangeName];

            this.state.coinFunctions[exchangeKeys.exchangeName](
                heldKeys,
                exchangeBalances,
                exchangeKeys,
                this.coinCrossRoads
            );
        } else {
            this.updateCoinsWithCoinMarketCapData(exchangeBalances);
        }
    };

    addToHeldCoins = (coinDict,
                      heldCoins,
                      symbol,
                      originalData,
                      addedBalance) => {
        const coinData = coinDict[symbol];
        if (symbol in heldCoins.dict) {
            let newBal = originalData.bal;
            let oldBal = heldCoins.dict[symbol].bal;
            let totalNewBal = newBal + oldBal;

            let heldValue = coinData.price_usd * totalNewBal;

            heldCoins.dict[symbol].bal = totalNewBal;
            heldCoins.dict[symbol].heldValue = heldValue.toFixed(2);
        } else {
            heldCoins.dict[symbol] = originalData;
            heldCoins.dict[symbol].name = coinData.name;
            heldCoins.dict[symbol].priceUSD = coinData.price_usd;
            heldCoins.dict[symbol].percentChange1h = coinData.percent_change_1h;
            heldCoins.dict[symbol].percentChange7d = coinData.percent_change_7d;
            heldCoins.dict[symbol].percentChange24h = coinData.percent_change_24h;
            let heldValue = coinData.price_usd * heldCoins.dict[symbol].bal;
            heldCoins.dict[symbol].heldValue = heldValue.toFixed(2);
        }
        heldCoins.dict[symbol].addedBalance = addedBalance;
        return heldCoins;
    };

    updateCoinsWithCoinMarketCapData = exchangeBalances => {
        console.log("UPDATE DATA");
        const coinDict = this.state.coinMarketCapDict;
        const heldCoins = {dict: {}};


        Object.keys(exchangeBalances).forEach(exchange => {
            Object.keys(exchangeBalances[exchange]).forEach(symbol => {
                if (symbol in coinDict) {
                    this.addToHeldCoins(
                        coinDict,
                        heldCoins,
                        symbol,
                        exchangeBalances[exchange][symbol],
                        0
                    );
                } else {
                    delete heldCoins.dict[symbol];
                }
            });
        });

        const addedCoins = this.state.addedCoins;

        for (let i in addedCoins) {
            let symbol = addedCoins[i].cur;
            let balance = addedCoins[i].bal;

            this.addToHeldCoins(coinDict, heldCoins, symbol, addedCoins[i], balance);
        }

        this.calculateTotalValue(heldCoins);
    };

    calculateTotalValue = heldCoins => {
        let portfolioValue = 0;

        Object.keys(heldCoins.dict).forEach(key => {
            const pricePerCoin = heldCoins.dict[key].priceUSD;
            const coinBalance = heldCoins.dict[key].bal;

            portfolioValue += pricePerCoin * coinBalance;
        });

        portfolioValue = portfolioValue.toFixed(2);

        this.setState({
            myCoins: heldCoins,
            portValue: portfolioValue,
            refreshing: false,
            isLoading: false
        });
    };

    _cardPressed = (symbol, balance) => {
        console.log("CARD PRESSED");
        console.log(symbol);
        console.log(balance);

        this.setState({
            editModalIsVisible: true,
            editSymbol: symbol,
            editBalance: balance
        });
    };

    renderCoinCards() {
        const listCoins = [];
        Object.keys(this.state.myCoins.dict).forEach(key => {
            listCoins.push(this.state.myCoins.dict[key]);
        });

        listCoins.sort((a, b) => b.heldValue - a.heldValue);

        return listCoins.map(coin => (
            <CoinCard
                key={coin.cur}
                symbol={coin.cur}
                name={coin.name}
                balance={coin.bal}
                priceUSD={coin.priceUSD}
                percentChange24h={coin.percentChange24h}
                percentChange7d={coin.percentChange7d}
                percentChange1h={coin.percentChange1h}
                heldValue={coin.heldValue}
                addedCoinBalance={coin.addedBalance}
                onCardPressed={this._cardPressed}
            />
        ));
    }

    _addCoin = (coinName, amountToAdd) => {
        console.log(`ADDING ${amountToAdd} of ${coinName}`);
        saveAddedCoin(coinName, parseFloat(amountToAdd), this._onRefresh);
    };

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.loadAddedCoins();
    };

    _removeCoin = coinName => {
        console.log("REMOVE");
        console.log(coinName);

        deleteCoin(coinName, this._onRefresh);
    };

    _editCoin = (coinName, newBal) => {
        console.log("EDIT");
        console.log(coinName);
        console.log(newBal);
        this._addCoin(coinName, newBal);
    };

    _closeEditModal = () => {
        this.setState({
            editModalIsVisible: false
        });
    };

    render() {
        const {
            contentContainer,
            headerContainer,
            header,
            coinScroll
        } = styles;

        if (this.state.isLoading) {
            return (
                <View>
                    <Spinner
                        visible={this.state.isLoading}
                        textContent={"Loading"}
                        textStyle={{color: "#253145"}}
                        animation="fade"
                    />
                </View>
            );
        }

        return (
            <View style={contentContainer}>
                <View style={headerContainer}>
                    <Text style={header}>${this.state.portValue}</Text>
                </View>

                {this.state.editModalIsVisible && (
                    <EditModal
                        symbol={this.state.editSymbol}
                        amountBought={this.state.editBalance}
                        close={this._closeEditModal}
                        remove={this._removeCoin}
                        edit={this._editCoin}
                    />
                )}

                <AddModal
                    coinDict={this.state.coinMarketCapDict}
                    addCoin={this._addCoin}
                    refreshCoins={this._onRefresh}
                />
                <ScrollView
                    style={coinScroll}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >
                    {this.renderCoinCards()}
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    contentContainer: {
        // paddingBottom: 45,
        // paddingTop: 50
        flex: 1
    },
    headerContainer: {
        display: "flex",
        marginTop: 55,
        marginBottom: 75,
        alignItems: "center"
    },
    modalContainer: {
        display: "flex",
        marginRight: 30,
        marginLeft: 30
    },
    coinScroll: {
        flex: 1,
        marginTop: 5
    },
    modalChoice: {
        display: "flex",
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10
    },
    buttonContainer: {
        display: "flex",
        alignItems: "flex-end",
        marginRight: 20,
        flex: 1
    },
    header: {
        fontWeight: "bold",
        fontSize: 30
    }
};

export default CoinContainer;
