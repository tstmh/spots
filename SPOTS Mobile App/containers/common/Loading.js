import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingModal = ({ visible }) => (
    <Modal transparent={true} visible={visible}>
        <View style={styles.centeredView}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        direction: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});

export default LoadingModal;
