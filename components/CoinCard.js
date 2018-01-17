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
                    <Text style={coinName} >{name}</Text>
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


// const coinColor = "#395E66";
const coinColor = "#a1b5c4";
const myFont = "serif";
const percentSize = 14;
const letterSize = 14;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        marginBottom: 5,
        borderTopColor: "#e5e5e5",
        borderTopWidth: 2,
        padding: 10,
        // borderWidth: 1,
        borderColor:"#FFFFFF"
    },
    upperRow: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 15,

    },
    timeText:{
        //color:"#253145"
        color: `${coinColor}`,
        fontSize: letterSize,
    },
    coinSymbol: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        // color: "#264653",
        fontWeight: "bold",
        color:"#FFFFFF",
        // color:"#b967ff"
        // color:"#5D6D7E",
        // color: `${coinColor}`,
        fontSize: letterSize,

    },
    coinName: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 0,
        // color: `${coinColor}`,
        //fontWeight:"bold"
        // color:"#E5E7E9"
        color:"#FFFFFF",
        fontSize: letterSize,

    },
    bal: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 0,
        //color: `${coinColor}`,
        color:"#a1b5c4",
        fontSize: letterSize,
    },
    usd: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 0,
        // color: "#E9C46A",
        // color:"#fffb96"
        // color: `${coinColor}`,
        color:"#a1b5c4",
        fontSize: letterSize,


    },
    heldValue: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        // color: `${coinColor}`,
        // color:"#253145"
        fontSize: letterSize,

    },
    seperator: {
        marginTop: 10,
        color:"#FFFFFF",
        fontSize: letterSize,

    },
    moneySymbol: {
        fontWeight: "bold",
        fontSize: letterSize,
    },
    coinPrice: {
        marginTop: 10,
        marginLeft: "auto",
        marginRight: 10,
        fontWeight: "bold",
        // color:"#01cdfe",
        color:"#FFFFFF",
        fontSize: letterSize,

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
        // color: "#009B77",
        // color: "#2A9D8F",
        // color: "#05ffa1",
        // color:"#39ff14",
        // color:"#83f52c",
        color:"#44CF6C",

        fontSize: percentSize,




        // color:"#008080",
        fontWeight: "bold",
        marginLeft: 5,

    },
    percentChangeMinus: {
        // color: "#9B2335",
        // color: "#6e0dd0",
        // color: "#EC25AD",
        //
        // color: "#F03A47",
        color: "#cf4d44",
        //
        // color:"#3B3355",

        //color:"#873D48",

        fontWeight: "bold",
        marginLeft: 5,

        fontSize: percentSize,


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
