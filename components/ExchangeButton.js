import React, { Component } from "react";
import CoinAutocomplete from "./CoinAutocomplete";

import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  Button,
  Picker,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  AsyncStorage
} from "react-native";
import { saveSecrets } from "./../Utils/Utils.js";

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
    // this.setState({
    //   isOpen: true
    // });
  };

  _saveKeys = () => {
    const { apiKey, secretKey } = this.state;
    if (apiKey.length > 0 && secretKey.length > 0) {
        saveSecrets(this.props.exchangeName, apiKey, secretKey, this.props.refreshCoins);
        // this.setState({
        //   isOpen: false
        // });
    }
  };

  render() {
    const {
      modalContainer,
      modalChoice,
      modalScrollView,
      buttonContainer,
      addInfoBox,
      amountBoughtText,
      textBox
    } = styles;

    return (
      <View>
        <Button title={this.props.exchangeName} color={this.props.color} onPress={this._openTextField} />
        {this.props.isOpen && (
          <View>
            <View style={styles.addInfoBox}>
              <Text style={styles.keyText}>API KEY</Text>
              <TextInput
                style={styles.textBox}
                onChangeText={apiKey => this.setState({ apiKey })}
              />
              <Text style={styles.keyText}>SECRET KEY</Text>
              <TextInput
                style={styles.textBox}
                editable={true}
                onChangeText={secretKey => this.setState({ secretKey })}
              />
            </View>
            <Button title="Submit" color="#841584" onPress={this._saveKeys} />
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
  }
};

export default ExchangeButton;
