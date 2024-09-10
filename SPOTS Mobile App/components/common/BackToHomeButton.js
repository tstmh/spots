import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackToHomeButton = (props) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.SecondaryButtonStyle} onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.BackToHome}>Back to Home</Text>
            <Image style={styles.Icons} source={require('../../assets/icon/home.png')} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    SecondaryButtonStyle: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        width: "100%",
        boxSizing: "border-box",
    },
    BackToHome: {
        color: "rgba(0,22,62,1)",
        fontSize: 15,
        lineHeight: 18,
        fontFamily: "ZenKakuGothicAntique-Bold",
        textAlign: "center",
    },
    Icons: {
        width: 28,
        height: "100%",
    },
});

export default BackToHomeButton;