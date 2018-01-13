import React, { Component } from "react";
import Modal from "react-native-modal";
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

class AddModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      isAddCoinVisible: false,
      isBinanceVisible: false,
      isBittrexVisible: false,
      binanceAPIKey: "",
      binanceSecret: "",
      bittrexAPIKey: "",
      bittrexSecret: "",
      coinBought: "",
      coinAmountBought: 0
    };
  }

  _saveBinance = () => {
    const { binanceAPIKey, binanceSecret } = this.state;
    if (binanceAPIKey.length > 0 && binanceSecret.length > 0) {
      saveSecrets("binance", binanceAPIKey, binanceSecret, this.props.refreshCoins);

      this.setState({
        isBinanceVisible: false
      });
    }
  };

  _saveBittrex = () => {
    const { bittrexAPIKey, bittrexSecret } = this.state;

    if (bittrexAPIKey.length > 0 && bittrexSecret.length > 0) {
      saveSecrets("bittrex", bittrexAPIKey, bittrexSecret, this.props.refreshCoins);

      this.setState({
        isBittrexVisible: false
      });
    }
  };


_saveNewCoin = () => {
  const { coinBought, coinAmountBought } = this.state;

  if (coinBought.length > 0 && coinAmountBought > 0){
    this.props.addCoin(coinBought, coinAmountBought);
    this.setState({
      isAddCoinVisible:false
    })
  }
};


  getAutocompleteCoin = coin => {
    this.setState({
      coinBought:coin
    })
  };

  _openAddCoin = () =>
    this.setState({
      isAddCoinVisible: true,
      isBittrexVisible: false,
      isBinanceVisible: false
    });

  _openBinance = () =>
    this.setState({
      isAddCoinVisible: false,
      isBittrexVisible: false,
      isBinanceVisible: true
    });

  _openBittrex = () =>
    this.setState({
      isAddCoinVisible: false,
      isBittrexVisible: true,
      isBinanceVisible: false
    });

  _showModal = () => this.setState({ isModalVisible: true });

  _hideModal = () =>
    this.setState({
      isModalVisible: false,
      isBinanceVisible: false,
      isBittrexVisible: false
    });

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
        <View style={buttonContainer}>
          <Button
            onPress={this._showModal}
            title="  +  "
            color="#841584"
          />
        </View>
        <TouchableWithoutFeedback onPress={this._hideModal.bind(this)}>
          <Modal
            style={styles.modalContainer}
            isVisible={this.state.isModalVisible}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                <ScrollView style={styles.modalScrollView}>
                  <View style={styles.modalChoice}>
                    <Button
                      title="Add Coin"
                      color="#841584"
                      onPress={this._openAddCoin}
                    />
                    {this.state.isAddCoinVisible && (
                      <View style={styles.addInfoBox}>
                        <Text style={styles.keyText}>COIN</Text>
                        <CoinAutocomplete
                          coinDict={this.props.coinDict}
                          getCoin={this.getAutocompleteCoin}
                        />
                        <Text style={styles.keyText}>AMOUNT BOUGHT</Text>
                        <TextInput
                          style={styles.amountBoughtText}
                          keyboardType='numeric'
                          maxLength={20}
                          onChangeText={coinAmountBought =>
                            this.setState({ coinAmountBought })
                          }
                        />
                      </View>
                    )}
                    {this.state.isAddCoinVisible && (
                      <Button
                        title="Submit"
                        color="#841584"
                        onPress={this._saveNewCoin}
                      />
                    )}
                  </View>
                  <View style={styles.modalChoice}>
                    <Button
                      title="Binance"
                      color="#841584"
                      onPress={this._openBinance}
                    />
                    {this.state.isBinanceVisible && (
                      <View style={styles.addInfoBox}>
                        <Text style={styles.keyText}>API KEY</Text>
                        <TextInput
                          style={styles.textBox}
                          onChangeText={binanceAPIKey =>
                            this.setState({ binanceAPIKey })
                          }
                        />
                        <Text style={styles.keyText}>SECRET KEY</Text>
                        <TextInput
                          style={styles.textBox}
                          editable={true}
                          onChangeText={binanceSecret =>
                            this.setState({ binanceSecret })
                          }
                        />
                      </View>
                    )}
                    {this.state.isBinanceVisible && (
                      <Button
                        title="Submit"
                        color="#841584"
                        onPress={this._saveBinance}
                      />
                    )}
                  </View>
                  <View style={styles.modalChoice}>
                    <Button
                      title="Bittrex"
                      color="#841584"
                      onPress={this._openBittrex}
                    />
                    {this.state.isBittrexVisible && (
                      <View style={styles.addInfoBox}>
                        <Text style={styles.keyText}>API KEY</Text>
                        <TextInput
                          style={styles.textBox}
                          editable={true}
                          onChangeText={bittrexAPIKey =>
                            this.setState({ bittrexAPIKey })
                          }
                        />
                        <Text style={styles.keyText}>SECRET KEY</Text>
                        <TextInput
                          style={styles.textBox}
                          editable={true}
                          onChangeText={bittrexSecret =>
                            this.setState({ bittrexSecret })
                          }
                        />
                      </View>
                    )}
                    {this.state.isBittrexVisible && (
                      <Button
                        title="Submit"
                        color="#841584"
                        onPress={this._saveBittrex}
                      />
                    )}
                  </View>
                  <View style={styles.modalChoice}>
                    <Button
                      title="Close"
                      color="#841584"
                      onPress={this._hideModal}
                    />
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </TouchableWithoutFeedback>
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

export default AddModal;
