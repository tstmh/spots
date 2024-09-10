import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SketchButton = (props) => {
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
        fontSize: 15,
        lineHeight: 15,
        fontFamily: "ZenKakuGothicAntique-Bold",
    },
    MainButtonStyle: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderColor: "rgba(9,62,160,1)",
        borderRadius: 8,
        boxSizing: "border-box",
        backgroundColor: "rgba(254,254,254,0.0)",
    },
});

export default SketchButton;