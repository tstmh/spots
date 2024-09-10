import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import spotsStyles from '../../components/spots-styles';

const ZIndexModal = ({ visible, onClose, onBringToFront, onSendToBack, onBringForward, onSendBackward }) => {
    return (
        <Modal transparent={true} visible={visible}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.button} onPress={onBringToFront}>
                        <Text style={styles.labelText}>Bring to Front</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onSendToBack}>
                        <Text style={styles.labelText}>Send to Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onBringForward}>
                        <Text style={styles.labelText}>Bring Forward</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onSendBackward}>
                        <Text style={styles.labelText}>Send Backward</Text>
                    </TouchableOpacity>
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
        alignItems: 'center',
        marginTop: 440,
        marginRight: 195,
    },
    modalView: {
        width: '20%',
        backgroundColor: 'white',
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 10
    },
    button: {
        padding: 8,
    },
    buttonText: {
        fontSize: 15,
        color: "rgba(0,22,62,1)",
        fontFamily: "ZenKakuGothicAntique-Regular",
    },
    labelText: {
        color: "rgba(0,22,62,1)",
        fontSize: 15,
        fontFamily: "ZenKakuGothicAntique-Bold",
    },
    closeButton: {
        padding: 10,
        paddingTop: 15,
        backgroundColor: 'white',
        alignItems: 'center',
    },
});

export default ZIndexModal;
