import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";


const CoinCard = ({
                      symbol,
                      name,
                      priceUSD,
                      percentChange24h,
                      percentChange7d,
                      percentChange1h,
                      balance,
                      heldValue,
                      addedCoinBalance,
                      onCardPressed,

                  }) => {

    _cardPressed = () => {
        onCardPressed(symbol, addedCoinBalance);
    };

    return (
        <TouchableOpacity onPress={_cardPressed}>
            <View style={container}>
                <View style={upperRow}>
                    <Text style={coinSymbol}>{symbol}</Text>
                    <Text style={seperator}>|</Text>
                    {balance > 0 && <Text style={bal}>{balance}</Text>}
                    <Text style={coinName}>{name}</Text>
                    <Text style={usd}>(${priceUSD})</Text>
                    {balance > 0 && (
                        <Text style={coinPrice}>
                            <Text style={moneySymbol}> $</Text>
                            {heldValue}
                        </Text>
                    )}
                </View>

                <View style={statisticsContainer}>
                    <Text style = {styles.timeText}>
                        1h:
                        <Text
                            style={
                                percentChange1h < 0 ? percentChangeMinus : percentChangePlus
                            }
                        >
                            {" "}
                            {percentChange1h} %{" "}
                        </Text>
                    </Text>

                    <Text style = {styles.timeText}>
                        24h:
                        <Text
                            style={
                                percentChange24h < 0 ? percentChangeMinus : percentChangePlus
                            }
                        >
                            {" "}
                            {percentChange24h} %{" "}
                        </Text>
                    </Text>

                    <Text style = {styles.timeText}>
                        7d:
                        <Text
                            style={
                                percentChange7d < 0 ? percentChangeMinus : percentChangePlus
                            }
                        >
                            {" "}
                            {percentChange7d} %{" "}
                        </Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        marginBottom: 10,
        borderBottomColor: "#e5e5e5",
        borderBottomWidth: 3,
        padding: 10
    },
    upperRow: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 15
    },
    timeText:{
        color:"#FFFFFF"
    },
    coinSymbol: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        // color: "#264653",
        fontWeight: "bold",
        color:"#b967ff"
    },
    coinName: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 0,
        color:"#FFFFFF"
    },
    bal: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 0,
        color:"#FFFFFF"
    },
    usd: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 0,
        // color: "#E9C46A",
        color:"#fffb96"
    },
    heldValue: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        color:"#FFFFFF"
    },
    seperator: {
        marginTop: 10,
        color:"#FFFFFF"
    },
    moneySymbol: {
        fontWeight: "bold"
    },
    coinPrice: {
        marginTop: 10,
        marginLeft: "auto",
        marginRight: 10,
        fontWeight: "bold",
        color:"#01cdfe",
    },
    statisticsContainer: {
        display: "flex",
        // borderTopColor: "#FAFAFA",
        // borderTopWidth: 2,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    percentChangePlus: {
        //color: "#009B77",
        // color: "#2A9D8F",
        color: "#05ffa1",
        fontWeight: "bold",
        marginLeft: 5
    },
    percentChangeMinus: {
        // color: "#9B2335",
        // color: "#D81E5B",
        color: "#EC25AD",
        fontWeight: "bold",
        marginLeft: 5
    }
});

const {
    container,
    image,
    moneySymbol,
    upperRow,
    coinSymbol,
    coinName,
    coinPrice,
    heldValue,
    bal,
    usd,
    statisticsContainer,
    seperator,
    percentChangePlus,
    percentChangeMinus
} = styles;

export default CoinCard;
