import Autocomplete from "react-native-autocomplete-input";
import React, {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

class CoinAutocomplete extends Component {
    constructor(props) {
        super(props);

        const coinDict = props.coinDict;
        const coinAry = [];
        Object.keys(coinDict).forEach(key => {
            coinAry.push(coinDict[key]);
        });

        this.state = {
            query: "",
            coinArray: coinAry,
            hasFocus: false
        };
    }

    findCoin(query) {
        if (query === "") {
            return [];
        }

        const coinDict = this.props.coinDict;

        const regex = new RegExp(`${query.trim()}`, "i");

        const coinArray = this.state.coinArray;
        const byName = coinArray.filter(coin => coin.name.search(regex) >= 0);
        const bySymbol = coinArray.filter(coin => coin.symbol.search(regex) >= 0);

        const addedLists = byName.concat(bySymbol);

        var duplicatesRemoved = [];
        addedLists.forEach(function (item) {
            if (duplicatesRemoved.indexOf(item) < 0) {
                duplicatesRemoved.push(item);
            }
        });

        return duplicatesRemoved;
    }

    render() {
        const {query} = this.state;
        const coins = this.findCoin(query);

        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
            <View style={styles.container}>
                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    data={coins.length === 1 && comp(query, coins[0].name) ? [] : coins}
                    defaultValue={query}
                    onChangeText={text => this.setState({query: text, hasFocus: true})}
                    renderItem={({symbol, name}) => (
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({query: `${symbol} | ${name}`, hasFocus: false});
                                this.props.getCoin(symbol);
                            }}
                        >
                            <Text style={styles.itemText}>
                                {symbol} | {name}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                <View style={styles.descriptionContainer}>
                    {this.state.hasFocus > 0 &&
                    this.state.query.length > 0 && (
                        <Text style={styles.infoText}>No Results Found</Text>
                    )}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        paddingTop: 15
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 1,
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 5
    },
    itemText: {
        fontSize: 15,
        margin: 10
    },
    descriptionContainer: {
        backgroundColor: "#FFFFFF",
        marginTop: 25
    },
    infoText: {
        textAlign: "center",
        paddingBottom: 105
    }
});

export default CoinAutocomplete;
