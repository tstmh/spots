import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BlueButtonShort = (props) => {
  return (
    <TouchableOpacity
      style={[styles.MainButtonStyle, props.disabled ? styles.disabledButton : {}]}
      onPress={props.customClick}
      disabled={props.disabled}>
      <Text style={styles.text}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#f05555',
        color: '#ffffff',
        padding: 10,
        marginTop: 16,
        marginLeft: 35,
        marginRight: 35,
    },
    text: {
        color: "#FEFEFE",
        fontSize: 15,
        fontFamily: "ZenKakuGothicAntique-Bold",
        lineHeight: 15
    },
    MainButtonStyle: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 48,
        marginRight: 76,
        borderRadius: 8,
        boxSizing: "border-box",
        backgroundColor: "rgba(9,62,160,1)",
    },
    disabledButton: {
      backgroundColor: "rgba(9,62,160,0.5)",
    },
});

export default BlueButtonShort;