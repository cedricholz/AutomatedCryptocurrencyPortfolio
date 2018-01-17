import React from "react";
import Modal from "react-native-modal";

import {
    ScrollView,
    View,
    Text,
    Button,
    TextInput,
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
        return (
            <View>
                <Modal style={styles.modalContainer} isVisible={true}>
                    <View style={styles.modalContainer}>
                        <View>
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
                                            this.setState({coinAmountBought})
                                        }
                                    />
                                </View>

                                <View style={styles.both}>
                                    <View style={styles.individual}>
                                        <Button title="Remove Coin" color="#077187" onPress={() => {
                                            this._removeCoin(this.props.symbol);
                                        }}/>
                                    </View>
                                    <View style={styles.individual}>
                                        <Button style={styles.individual} color="#2b9b6c" title="Submit Edit" onPress={() => {
                                            this._editCoin(this.props.symbol, parseFloat(this.state.coinAmountBought));
                                        }}/>
                                    </View>
                                </View>


                                <View style={styles.cancelButton}>
                                    <View style={styles.buttonBorder}>
                                        <Button
                                            style={styles.buttonContainer}
                                            title="Cancel"
                                            // color="#2b9b6c"
                                            color="#F03A47"
                                            onPress={this.props.close}
                                        />
                                    </View>
                                </View>
                                <View>
                                </View>

                            </View>

                        </View>

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
    both: {
        display: "flex",
        flexDirection: 'row',
        // justifyContent:'space-around',
        // alignItems:'center',
        justifyContent: 'center',
        justifyContent: 'space-between'

    },
    individual: {
        width: "50%",
        borderWidth: 2,
        borderColor: "#FFFFFF"
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
        marginTop:5,
        borderWidth: 2,
        borderColor: "#FFFFFF"
    },
    buttonBorder: {
        // borderWidth: 5,
        // borderColor: "#FFFFFF"
    },
    twoButtons: {
        display: "flex",
        // flex: 1,
        flexDirection: "row",
        // width:"100%",
        // justifyContent: "space-around",
        // margin: 10
    },
    buttonContainer: {
        display: "flex",

    }
};

export default EditModal;
