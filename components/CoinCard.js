import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";



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
          <Text>
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

          <Text>
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

          <Text>
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
  coinSymbol: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    // color: "#264653",
    fontWeight: "bold"
  },
  coinName: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 0
  },
  bal: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 0
  },
  usd: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 0
    // color: "#E9C46A"
  },
  heldValue: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5
  },
  seperator: {
    marginTop: 10
  },
  coinPrice: {
    marginTop: 10,
    marginLeft: "auto",
    marginRight: 10,
    fontWeight: "bold"
  },
  moneySymbol: {
    fontWeight: "bold"
  },
  statisticsContainer: {
    display: "flex",
    borderTopColor: "#FAFAFA",
    borderTopWidth: 2,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  percentChangePlus: {
    //color: "#009B77",
    color: "#2A9D8F",
    fontWeight: "bold",
    marginLeft: 5
  },
  percentChangeMinus: {
    // color: "#9B2335",
    color: "#D81E5B",
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
