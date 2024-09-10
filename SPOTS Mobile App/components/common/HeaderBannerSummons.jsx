import React, { useState } from "react"
import { TouchableOpacity, Image, Text, View, Modal } from "react-native"
import styles from '../spots-styles-summons';
import OfficerDetails from "./OfficerDetails";

export default function HeaderBannerSummons({ SummonsTitle, title, RefNo, RefId, officerName, navigation }) {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        console.log("toggleDropdown " + dropdownVisible);
        setDropdownVisible(!dropdownVisible);
    };
    const closeDropdown = () => {
        setDropdownVisible(false);
    };

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

                <View style={styles.FlexRowCenterRow}>
                    <TouchableOpacity onPress={toggleDropdown} style={styles.FlexRowCenterRow}>
                        <Image
                            style={styles.MaskGroup}
                            source={require('../../assets/images/tile_profile.png')}
                        />
                        <Text style={[styles.OfficerName, {width: 75}]} numberOfLines={1} ellipsizeMode="tail" >{officerName}</Text>
                        {dropdownVisible ? (
                            <Image source={require('../../assets/icon/arrow-up.png')} />
                        ) : (
                            <Image source={require('../../assets/icon/arrow-down.png')} />
                        )}
                    </TouchableOpacity>
                </View>
                {dropdownVisible && (
                    <Modal transparent={true} visible={dropdownVisible} onRequestClose={closeDropdown}>
                        <TouchableOpacity style={[{ height: 50 }]} onPress={closeDropdown} />
                        <TouchableOpacity style={styles.DropdownContainer} onPress={closeDropdown}>
                            <View style={[styles.Dropdown]}>
                                <OfficerDetails navigation={navigation} />
                            </View>
                        </TouchableOpacity >
                    </Modal>
                )}
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.HomeView}>
                    <Image
                        source={require('../../assets/icon/home.png')}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <Text style={styles.SummonsTitle}>
                    {SummonsTitle} |  <Text style={styles.PageTitle}>
                        {title}
                    </Text>
                </Text>
                <Text style={styles.RefNo}>
                    {RefNo}  |  <Text style={styles.RefId}>
                        {RefId}
                    </Text>
                </Text>
            </View>
        </View>
    )
}