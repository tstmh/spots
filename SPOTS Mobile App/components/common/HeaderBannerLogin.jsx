import React from "react"
import { Image, Text, View } from "react-native"
import styles from '../spots-styles';

export default function HeaderBannerLogin() {

    return (
        <View>
            <View style={styles.Header}>
                <Image
                    style={styles.SpfLogo}
                    source={require('../../assets/images/spf_logo.png')}
                />
                <View style={styles.FlexRowCenter}>
                    <Text style={styles.AppName}>SINGAPORE POLICE ON-THE-SPOT TICKETING SYSTEM</Text>
                </View>
            </View>
            <View style={styles.Header}>
                <Image
                    style={styles.Banner}
                    source={require('../../assets/images/banner_police.jpg')}
                />
            </View>
        </View>
    )
}