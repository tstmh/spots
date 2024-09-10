import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const WhiteButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.MainButtonStyle}
      onPress={props.customClick}>
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
        color: "rgba(9,62,160,1)",
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
        borderWidth: 1,
        borderColor: "rgba(9,62,160,1)",
        borderRadius: 8,
        boxSizing: "border-box",
        backgroundColor: "rgba(254,254,254,1)",
    },
});

export default WhiteButton;