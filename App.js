import React, {Component} from "react";
import {View} from "react-native";
import {StyleSheet} from "react-native";
import CoinContainer from "./components/CoinContainer";

export default class App extends Component<{}> {
    render() {
        return (
            <View style={styles.container}>
                <CoinContainer/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        // backgroundColor: "#2f3f47",
        backgroundColor: "#2b9b6c"

        // backgroundColor: "#05ffa1"
    },
});
