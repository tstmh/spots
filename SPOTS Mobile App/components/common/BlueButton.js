import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BlueButton = (props) => {
  return (
    <TouchableOpacity
      style={[
        styles.MainButtonStyle, 
        props.disabled ? styles.buttonDisabled : {}
      ]}
      onPress={props.customClick}
      disabled={props.disabled? props.disabled : false}>
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
    buttonDisabled: {
      opacity: 0.5
    },
    text: {
        color: "#FEFEFE",
        fontSize: 16,
        fontFamily: "ZenKakuGothicAntique-Bold",
        lineHeight: 16
    },
    MainButtonStyle: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 60,
        borderRadius: 8,
        boxSizing: "border-box",
        backgroundColor: "rgba(9,62,160,1)",
    },
});

export default BlueButton;