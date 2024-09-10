import React, {useState} from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TriangleColorPicker } from 'react-native-color-picker';
import spotsStyles from '../../components/spots-styles';

const ColorModal = ({ visible, onClose, color, setColor }) => {
    const [currentColor, setCurrentColor] = useState(color);

    return (
        <Modal transparent={true} visible={visible}>
            <View style={styles.centeredView}>
                <View style={[styles.modalView]}>
                    <Text style={spotsStyles.LabelSmall}>Select Color</Text>
                    <TriangleColorPicker
                        onColorChange={(selectedColor) => {
                            setCurrentColor(selectedColor);
                        }}
                        onColorSelected={(selectedColor) => {
                            setColor(selectedColor);
                            onClose();
                        }}
                        style={[{ width: "100%", height: 210, marginTop: 10 }]}
                        defaultColor={color}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.buttonText}>Cancel</Text>
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
    modalView: {
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

export default ColorModal;
