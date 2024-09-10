import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import spotsStyles from '../../components/spots-styles';

const ArrowPickerModal = ({ visible, onClose, shapeMode, setShapeMode }) => {
    return (
        <Modal transparent={true} visible={visible}>
            <View style={styles.centeredView}>
                <View style={styles.shapeModalView}>
                    <Text style={[spotsStyles.LabelSmall, { marginBottom: 15 }]}>Select Arrow</Text>
                    <TouchableOpacity 
                        style={[
                            styles.button,
                            shapeMode === 'single' ? styles.activeButton : null,
                        ]}
                        onPress={() => setShapeMode('single')}
                    >
                        <Image
                            source={require('../../assets/icon/arrow-right.png')}
                            style={{ width: 25, height: 20 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.button,
                            shapeMode === 'double' ? styles.activeButton : null,
                        ]}
                        onPress={() => setShapeMode('double')}
                    >
                        <Image
                            source={require('../../assets/icon/double-arrows.png')}
                            style={{ width: 25, height: 20 }}
                        />
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
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    shapeModalView: {
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
    },
    button: {
        padding: 10,
        borderRadius: 5,
    },
    activeButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#bbb',
    },
    shapeIcon: { 
        width: 17, 
        height: 17 
    },
    buttonText: {
        fontSize: 15,
        color: "rgba(0,22,62,1)",
        fontFamily: "ZenKakuGothicAntique-Regular",
    },
    closeButton: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        margin: 20,
    },
});

export default ArrowPickerModal;
