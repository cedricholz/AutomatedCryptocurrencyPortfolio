import React, { Component } from "react";
import Modal from "react-native-modal";

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

class EditModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      coinAmountBought: 0
    };
  }

  _removeCoin = symbol => {
    console.log("REMOVE COIN")
    this.props.remove(symbol);
    this.props.close()
  };

  _editCoin = (symbol, newBal) => {
    console.log("EDIT COIN")
    this.props.edit(symbol, newBal);
    this.props.close()
  };

  render() {
    const {
      modalContainer,
      modalChoice,
      modalScrollView,
      buttonContainer,
      addInfoBox,
      amountBoughtText,
      cancelButton,
      twoButtons,
      symbolText
    } = styles;

    return (
      <View>
        <Modal style={styles.modalContainer} isVisible={true}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.modalChoice}>
                <View style={styles.addInfoBox}>
                  <Text style={styles.symbolText}>{this.props.symbol}</Text>
                  <Text style={styles.keyText}>EDIT AMOUNT BOUGHT</Text>
                  <TextInput
                    style={styles.amountBoughtText}
                    keyboardType="numeric"
                    placeholder={this.props.amountBought.toString()}
                    maxLength={20}
                    onChangeText={coinAmountBought =>
                      this.setState({ coinAmountBought })
                    }
                  />
                </View>
                <View style={styles.twoButtons}>
                  <Button
                    style={styles.buttonContainer}
                    title="Remove Coin"
                    color="#D81E5B"
                    onPress={() => {
                      this._removeCoin(this.props.symbol);
                    }}
                  />
                  <Button
                    style={styles.buttonContainer}
                    title="Submit Edit"
                    color="#2A9D8F"
                    onPress={() => {
                      this._editCoin(this.props.symbol, parseFloat(this.state.coinAmountBought));
                    }}
                  />
                </View>
                <View style={styles.cancelButton}>
                  <Button
                    style={styles.buttonContainer}
                    title="Cancel"
                    color="#841584"
                    onPress={this.props.close}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
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
  symbolText: {
    display: "flex",
    marginTop: 10,
    marginLeft: 10,
    fontWeight: "bold"
  },
  amountBoughtText: {
    marginLeft: 10,
    marginRight: 10,
    textAlign: "center"
  },
  cancelButton: {
    marginLeft: 50,
    marginRight: 50
  },
  twoButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10
  },
  buttonContainer: {
    display: "flex"
  }
};

export default EditModal;
