import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import spotsStyles from '../../components/spots-styles';

const PenWidthModal = ({ visible, onClose, mode, penWidth, setPenWidth, eraserWidth, setEraserWidth }) => {
    return (
        <Modal transparent={true} visible={visible}>
            <View style={styles.centeredView}>
                <View style={styles.lineWidthModalView}>
                    <Text style={[spotsStyles.LabelSmall]}>{mode === 'erase' ? "Adjust Eraser Width" : "Adjust Line Width"}</Text>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={1}
                        maximumValue={50}
                        step={1}
                        minimumTrackTintColor="#C7C7C7"
                        maximumTrackTintColor="#000000"
                        thumbTintColor="#093EA0"
                        value={mode === 'erase' ? eraserWidth : penWidth}
                        onValueChange={(value) => {
                            if (mode === 'erase') {
                                setEraserWidth(value);
                            } else {
                                setPenWidth(value);
                            }
                        }}
                    />
                    <Text style={styles.sliderText}>{mode === 'erase' ? eraserWidth : penWidth}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    lineWidthModalView: {
        margin: 20,
        width: '50%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    sliderText: {
        width: 30,
        textAlign: 'center',
        fontSize: 16,
        color: "#093EA0",
    },
    closeButton: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        margin: 20,
    },
    buttonText: {
        fontSize: 15,
        color: "rgba(0,22,62,1)",
        fontFamily: "ZenKakuGothicAntique-Regular",
    },
});

export default PenWidthModal;
