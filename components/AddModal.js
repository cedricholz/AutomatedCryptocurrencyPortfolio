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
import ExchangeButton from "./ExchangeButton";

const modalButtons = ["isAddCoinVisible", "bittrex", "binance", "kucoin"];

class AddModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      isAddCoinVisible: false,
      coinBought: "",
      coinAmountBought: 0,
      binance: false,
      bittrex: false,
      kucoin: false
    };
  }

  _openButton = exchangeName => {
    for (var i in modalButtons) {
      if (modalButtons[i] == exchangeName) {
        this.setState({
          [modalButtons[i]]: true
        });
      } else {
        this.setState({
          [modalButtons[i]]: false
        });
      }
    }
  };

  _closeExchange = exchangeName => {
    this.setState({
      [exchangeName]: false
    });
  };

  _saveNewCoin = () => {
    const { coinBought, coinAmountBought } = this.state;

    if (coinBought.length > 0 && coinAmountBought > 0) {
      this.props.addCoin(coinBought, coinAmountBought);
      this.setState({
        isAddCoinVisible: false
      });
    }
  };

  getAutocompleteCoin = coin => {
    this.setState({
      coinBought: coin
    });
  };

  _openAddCoin = () =>
    this.setState({
      isAddCoinVisible: true
    });

  _showModal = () => {
    this.setState({ isModalVisible: true });
    this._openButton("")
  };

  _hideModal = () =>
    this.setState({
      isModalVisible: false
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
          <Button onPress={this._showModal} title="  +  " color="#841584" />
        </View>
        <TouchableWithoutFeedback onPress={this._hideModal.bind(this)}>
          <Modal
            style={styles.modalContainer}
            isVisible={this.state.isModalVisible}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                <ScrollView style={styles.modalScrollView}>
                  {/* ADD COIN */}
                  <View style={styles.modalChoice}>
                    <Button
                      title="Add Coin"
                      color="#841584"
                      onPress={() => {
                        this._openButton("isAddCoinVisible");
                      }}
                    />
                    {this.state.isAddCoinVisible && (
                      <View>
                        <View style={styles.addInfoBox}>
                          <Text style={styles.keyText}>COIN</Text>
                          <CoinAutocomplete
                            coinDict={this.props.coinDict}
                            getCoin={this.getAutocompleteCoin}
                          />
                          <Text style={styles.keyText}>AMOUNT BOUGHT</Text>
                          <TextInput
                            style={styles.amountBoughtText}
                            keyboardType="numeric"
                            maxLength={20}
                            onChangeText={coinAmountBought =>
                              this.setState({ coinAmountBought })
                            }
                          />
                        </View>
                        <Button
                          title="Submit"
                          color="#841584"
                          onPress={this._saveNewCoin}
                        />
                      </View>
                    )}
                  </View>
                  {/* BINANCE */}
                  <View style={styles.modalChoice}>
                    <ExchangeButton
                      exchangeName={"binance"}
                      color={"#841584"}
                      refreshCoins={this.props.refreshCoins}
                      whichExchange={this._openButton}
                      isOpen={this.state.binance}
                      closeExchangeButton={this._closeExchange}
                    />
                  </View>
                  {/* BITTREX */}
                  <View style={styles.modalChoice}>
                    <ExchangeButton
                      exchangeName={"bittrex"}
                      color={"#841584"}
                      refreshCoins={this.props.refreshCoins}
                      whichExchange={this._openButton}
                      isOpen={this.state.bittrex}
                      closeExchangeButton={this._closeExchange}
                    />
                  </View>

                  <View style={styles.modalChoice}>
                    <ExchangeButton
                      exchangeName={"kucoin"}
                      color={"#841584"}
                      refreshCoins={this.props.refreshCoins}
                      whichExchange={this._openButton}
                      isOpen={this.state.kucoin}
                      closeExchangeButton={this._closeExchange}
                    />
                  </View>

                  {/* CLOSE */}
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
