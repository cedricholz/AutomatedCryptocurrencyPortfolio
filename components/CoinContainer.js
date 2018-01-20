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
import {saveAddedCoin, deleteCoin, getPortfolioValue, formatPrice, getFormattedCoinPrice} from "./../Utils/Utils.js";
import {bittrexAPI, binanceAPI, kucoinAPI, cryptopiaAPI} from "./../Utils/ApiUtils.js";


// const exchanges = ["bittrex", "binance", "kucoin", "cryptopia"];
const exchanges = ["bittrex", "binance", "kucoin"];


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
            percentChange1h: 0,
            percentChange24h: 0,
            percentChange7d: 0,
            myCoins: {
                dict: {}
            },
            coinFunctions: {
                bittrex: bittrexAPI,
                binance: binanceAPI,
                kucoin: kucoinAPI,
                cryptopia: cryptopiaAPI
            },

        };
    }

    componentDidMount() {
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
            .get("https://api.coinmarketcap.com/v1/ticker/?limit=1000")
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

            let heldValue = parseFloat(coinData.price_usd) * totalNewBal;

            heldCoins.dict[symbol].bal = totalNewBal;
            heldCoins.dict[symbol].heldValue = heldValue;
        } else {
            heldCoins.dict[symbol] = originalData;
            heldCoins.dict[symbol].name = coinData.name;
            heldCoins.dict[symbol].priceUSD = parseFloat(coinData.price_usd);
            heldCoins.dict[symbol].percentChange1h = coinData.percent_change_1h;
            heldCoins.dict[symbol].percentChange7d = coinData.percent_change_7d;
            heldCoins.dict[symbol].percentChange24h = coinData.percent_change_24h;
            let heldValue = parseFloat(coinData.price_usd) * heldCoins.dict[symbol].bal;
            heldCoins.dict[symbol].heldValue = heldValue;
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

        this.calculateTotalPercentchange(heldCoins, portfolioValue);

        portfolioValue = getPortfolioValue(portfolioValue, 2);


        this.setState({
            myCoins: heldCoins,
            portValue: portfolioValue,
            refreshing: false,
            isLoading: false
        });


    };

    calculateTotalPercentchange = (heldCoins, portfolioValue) => {
        let prev1hTotal = 0;
        let prev24hTotal = 0;
        let prev7dTotal = 0;


        Object.keys(heldCoins.dict).forEach(key => {
            const change1h = parseFloat(heldCoins.dict[key].percentChange1h);
            const change24h = parseFloat(heldCoins.dict[key].percentChange24h);
            const change7d = parseFloat(heldCoins.dict[key].percentChange7d);

            const priceUSD = heldCoins.dict[key].priceUSD;

            const coinBalance = heldCoins.dict[key].bal;

            const prevVal1h = this.getPrevPrice(priceUSD, change1h) * coinBalance;

            const prevVal24h = this.getPrevPrice(priceUSD, change24h) * coinBalance;

            const prevVal7d = this.getPrevPrice(priceUSD, change7d) * coinBalance;

            prev1hTotal += prevVal1h;
            prev24hTotal += prevVal24h;
            prev7dTotal += prevVal7d;


        });

        this.setState({
            percentChange1h: this.getPercentChange(prev1hTotal, portfolioValue),
            percentChange24h: this.getPercentChange(prev24hTotal, portfolioValue),
            percentChange7d: this.getPercentChange(prev7dTotal, portfolioValue)
        });


    };

    getPercentChange = (prevPrice, newPrice) => {
        if (prevPrice > 0) {
            if (newPrice > prevPrice) {
                return 100 * (newPrice - prevPrice) / prevPrice;
            }
            else {
                return -100 * (prevPrice - newPrice) / prevPrice;
            }
        }
        return 0;
    };


    getPrevPrice = (newPrice, percentChange) => {
        if (percentChange === 0) {
            return newPrice;
        }
        if (percentChange < 0) {
            return newPrice * -1 / (-1 * percentChange / 100 - 1);
        }
        return newPrice / (percentChange / 100 + 1)
    }

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
                priceUSD={formatPrice(coin.priceUSD)}
                percentChange24h={coin.percentChange24h}
                percentChange7d={coin.percentChange7d}
                percentChange1h={coin.percentChange1h}
                heldValue={formatPrice(coin.heldValue)}
                addedCoinBalance={coin.addedBalance}
                onCardPressed={this._cardPressed}
            />
        ));
    }

    _addCoin = (coinName, amountToAdd) => {
        saveAddedCoin(coinName, parseFloat(amountToAdd), this._onRefresh);
    };

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.loadAddedCoins();
    };

    _removeCoin = coinName => {

        deleteCoin(coinName, this._onRefresh);
    };

    _editCoin = (coinName, newBal) => {

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
                        textStyle={{color: "#a1b5c4"}}
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

                <View style={styles.statisticsContainer}>
                    <Text style={styles.timeText}>
                        1h:
                        <Text
                            style={
                                this.state.percentChange1h < 0 ? styles.percentChangeMinus : styles.percentChangePlus
                            }
                        >
                            {" "}
                            {this.state.percentChange1h.toFixed(2)} %{" "}
                        </Text>
                    </Text>

                    <Text style={styles.timeText}>
                        24h:
                        <Text
                            style={
                                this.state.percentChange24h < 0 ? styles.percentChangeMinus : styles.percentChangePlus
                            }
                        >
                            {" "}
                            {this.state.percentChange24h.toFixed(2)} %{" "}
                        </Text>
                    </Text>

                    <Text style={styles.timeText}>
                        7d:
                        <Text
                            style={
                                this.state.percentChange7d < 0 ? styles.percentChangeMinus : styles.percentChangePlus
                            }
                        >
                            {" "}
                            {this.state.percentChange7d.toFixed(2)} %{" "}
                        </Text>
                    </Text>

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

                <View style={styles.modalButton}>
                    <AddModal
                        coinDict={this.state.coinMarketCapDict}
                        addCoin={this._addCoin}
                        refreshCoins={this._onRefresh}
                    />
                </View>
            </View>
        );
    }
}

const coinColor = "#a1b5c4";
const percentSize = 18;

const styles = {
    contentContainer: {
        flex: 1,
    },
    modalButton: {
        position: 'absolute',

        width: 410,
        height: 390,
        top: 590,
    },
    headerContainer: {
        marginTop: 30,
        marginLeft: 15,
    },
    modalContainer: {
        display: "flex",
        marginRight: 30,
        marginLeft: 30
    },
    statisticsContainer: {
        display: "flex",
        padding: 10,
        paddingBottom: 30,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    coinScroll: {
        flex: 1,
        marginTop: 15,
    },
    modalChoice: {
        display: "flex",
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10
    },
    timeText: {
        color: `${coinColor}`,
        fontSize: percentSize,
    },
    buttonContainer: {
        display: "flex",
        alignItems: "flex-end",
        marginRight: 20,
        flex: 1
    },
    header: {
        display: 'flex',
        fontWeight: "bold",
        fontSize: 30,
        color: "#FFFFFF"
    },
    percentChangePlus: {
        color: "#44CF6C",

        fontSize: percentSize,

        fontWeight: "bold",
        marginLeft: 5,

    },
    percentChangeMinus: {

        color: "#cf4d44",

        fontWeight: "bold",
        marginLeft: 5,

        fontSize: percentSize,


    }
};

export default CoinContainer;
