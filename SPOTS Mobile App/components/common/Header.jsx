import React from "react"
import { Image, Text, View } from "react-native"
import styles from '../spots-styles';

export default function Header({title }) {
    return (
        <View>
            <View style={styles.Header}>
            <Image
                style={styles.SpfLogo}
                source={require('../../assets/images/spf_logo.png')}
            />
            <View style={styles.FlexRowCenter}>
                <Text style={styles.AppName}>
                    SINGAPORE POLICE ON-THE-SPOT TICKETING SYSTEM
                </Text>
            </View>
            <Image
                style={styles.MaskGroup}
                source={require('../../assets/images/tile_profile.png')}
            />
            <View style={styles.FlexRowCenterRow}>
                <Text style={styles.OfficerName}>Officer 1</Text>
                <Image source={require('../../assets/icon/arrow-down.png')}/>
            </View>
            <View style={styles.HomeView}>
                <Image
                    source={require('../../assets/icon/home.png')}
                />
            </View>
            </View>
        </View>
    )
}