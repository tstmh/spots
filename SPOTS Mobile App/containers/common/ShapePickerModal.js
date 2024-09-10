import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import spotsStyles from '../../components/spots-styles';

const ShapePickerModal = ({ visible, onClose, shapeMode, setShapeMode }) => {
    return (
        <Modal transparent={true} visible={visible}>
            <View style={styles.centeredView}>
                <View style={styles.shapeModalView}>
                    <Text style={[spotsStyles.LabelSmall, { marginBottom: 15 }]}>Select Shape</Text>
                    <TouchableOpacity 
                        style={[
                            styles.button,
                            shapeMode === 'line' ? styles.activeButton : null,
                        ]}
                        onPress={() => setShapeMode('line')}
                    >
                        <Image
                            source={require('../../assets/icon/minus-sign.png')}
                            style={styles.shapeIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.button,
                            shapeMode === 'dashedLine' ? styles.activeButton : null,
                        ]}
                        onPress={() => setShapeMode('dashedLine')}
                    >
                        <Image
                            source={require('../../assets/icon/dashed-line.png')}
                            style={styles.shapeIcon}
                        />
                    </TouchableOpacity>
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
                    <TouchableOpacity 
                        style={[
                            styles.button,
                            shapeMode === 'rectangle' ? styles.activeButton : null,
                        ]}
                        onPress={() => setShapeMode('rectangle')}
                    >
                        <Image
                            source={require('../../assets/icon/rectangle.png')}
                            style={styles.shapeIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.button,
                            shapeMode === 'triangle' ? styles.activeButton : null,
                        ]}
                        onPress={() => setShapeMode('triangle')}
                    >
                        <Image
                            source={require('../../assets/icon/triangle.png')}
                            style={styles.shapeIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.button,
                            shapeMode === 'circle' ? styles.activeButton : null,
                        ]}
                        onPress={() => setShapeMode('circle')}
                    >
                        <Image
                            source={require('../../assets/icon/circle.png')}
                            style={styles.shapeIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.button,
                            shapeMode === 'curvedLine' ? styles.activeButton : null,
                        ]}
                        onPress={() => setShapeMode('curvedLine')}
                    >
                        <Image
                            source={require('../../assets/icon/arc.png')}
                            style={styles.shapeIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.button,
                            shapeMode === 'dashedCurvedLine' ? styles.activeButton : null,
                        ]}
                        onPress={() => setShapeMode('dashedCurvedLine')}
                    >
                        <Image
                            source={require('../../assets/icon/menu.png')}
                            style={styles.shapeIcon}
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

export default ShapePickerModal;
