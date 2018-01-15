import React from "react";

import {
    View,
    Text,
    Button,
    TextInput,
} from "react-native";
import {saveSecrets} from "./../Utils/Utils.js";

class ExchangeButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            apiKey: "",
            secretKey: ""
        };
    }

    _openTextField = () => {
        this.props.whichExchange(this.props.exchangeName);
    };

    _saveKeys = () => {
        const {apiKey, secretKey} = this.state;
        if (apiKey.length > 0 && secretKey.length > 0) {
            saveSecrets(this.props.exchangeName, apiKey, secretKey, this.props.refreshCoins);
        }
        this.props.closeExchangeButton(this.props.exchangeName);
    };

    render() {
        return (
            <View>
                <View style={styles.buttonBorder}>
                    <Button title={this.props.exchangeName} color={this.props.color} onPress={this._openTextField}/>
                </View>
                {this.props.isOpen && (
                    <View>
                        <View style={styles.addInfoBox}>
                            <Text style={styles.keyText}>API KEY</Text>
                            <TextInput
                                style={styles.textBox}
                                onChangeText={apiKey => this.setState({apiKey})}
                            />
                            <Text style={styles.keyText}>SECRET KEY</Text>
                            <TextInput
                                style={styles.textBox}
                                editable={true}
                                onChangeText={secretKey => this.setState({secretKey})}
                            />
                        </View>
                        <View style={styles.buttonBorder}>
                            <Button title="Submit" color="#2b9b6c" onPress={this._saveKeys}/>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

const styles = {
    modalContainer: {
        display: "flex",
        marginRight: 30,
        marginLeft: 30
    },
    modalScrollView: {},
    modalChoice: {
        display: "flex",
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10
    },
    addInfoBox: {
        backgroundColor: "#FFFFFF",
        marginTop: 5,
        marginBottom: 5
    },
    keyText: {
        display: "flex",
        marginTop: 10,
        marginLeft: 10
    },
    textBox: {
        marginLeft: 10,
        marginRight: 10
    },
    amountBoughtText: {
        marginLeft: 10,
        marginRight: 10,
        textAlign: "center"
    },
    buttonContainer: {
        display: "flex",
        alignItems: "flex-end",
        marginRight: 20
    },
    buttonBorder: {
        borderWidth: 5,
        borderColor: "#FFFFFF"
    },
};

export default ExchangeButton;
