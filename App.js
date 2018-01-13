import React, { Component } from "react";
import { View, Text } from "react-native";
import axios from "react-native-axios";
// import { StyleSheet } from "react-native";
import CoinContainer from "./components/CoinContainer";

export default class App extends Component<{}> {
  render() {
    return (
      <View style={{flex:1}}>
        <CoinContainer />
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F5FCFF"
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: "center",
//     margin: 10
//   },
//   instructions: {
//     textAlign: "center",
//     color: "#333333",
//     marginBottom: 5
//   },
//   contentContainer: {
//     paddingVertical: 20
//   }
// });
