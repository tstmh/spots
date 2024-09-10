import React, { useEffect, useState, useContext } from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet, Modal } from "react-native"
import styles from '../spots-styles';
import IOList from '../../models/IOList';
import { AccidentReportContext } from "../../context/accidentReportContext";
import DatabaseService from '../../utils/DatabaseService';
import OfficerDetails from './OfficerDetails';

export default function HeaderBanner({title, officerName, navigation }) {
    const { accidentReport } = useContext(AccidentReportContext);

    const [ioName, setIoName] = useState('');

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        console.log("toggleDropdown " + dropdownVisible);
        setDropdownVisible(!dropdownVisible);
    };
    const closeDropdown = () => {
        setDropdownVisible(false);
    };

    useEffect(() => {
        const fetchIOName = async () => {
            try {
                const name = await IOList.getIONameById(DatabaseService.db, accidentReport.IO_NAME); 
                setIoName(name);
            } catch (error) {
                console.error(`Error fetching IO name ${accidentReport.IO_NAME}:`, error);
            }
        };

        fetchIOName();
    }, []);

    return (
        <View style={{height: 140}}>
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
                        <Text style={styles.OfficerName} numberOfLines={1} ellipsizeMode="tail" >{officerName}</Text>
                        {dropdownVisible ? (
                            <Image source={require('../../assets/icon/arrow-up.png')}/>
                        ) : (
                            <Image source={require('../../assets/icon/arrow-down.png')}/>
                        )}
                    </TouchableOpacity>
                </View>
                {dropdownVisible && (
                    <Modal transparent={true} visible={dropdownVisible} onRequestClose={closeDropdown}>
                        <TouchableOpacity  style={[{ height: 50 }]} onPress={closeDropdown} />
                        <TouchableOpacity  style={styles.DropdownContainer} onPress={closeDropdown}>
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

            <View style={osistyles.titleBanner}>
                {/* Center Title */}
                <Text style={osistyles.pageTitle}>{title}</Text>

                {/* Align Details to the End */}
                <View style={osistyles.detailsWrapper}>
                    <View style={osistyles.container}>
                        <Text style={osistyles.label}>Incident No.</Text>
                        <Text style={osistyles.vector} />
                        <Text style={osistyles.details} numberOfLines={1} ellipsizeMode="tail">
                            {accidentReport.INCIDENT_NO}
                        </Text>
                    </View>
                    <View style={osistyles.container}>
                        <Text style={osistyles.label}>IO Name</Text>
                        <Text style={osistyles.vector} />
                        <Text style={osistyles.details} numberOfLines={1} ellipsizeMode="tail">
                            {ioName}
                        </Text>
                    </View>
                    <View style={osistyles.container}>
                        <Text style={osistyles.label}>IO No.</Text>
                        <Text style={osistyles.vector} />
                        <Text style={osistyles.details} numberOfLines={1} ellipsizeMode="tail">
                            {accidentReport.IO_EXTENSION_NO}
                        </Text>
                    </View>
                </View>
            </View>

            
        </View>
    )
}

const osistyles = StyleSheet.create({
    titleBanner: {
        flexDirection: 'row', // Horizontal alignment for children
        height: 73,
        width: '100%',
        paddingTop: 10,
        paddingBottom: 16,
        backgroundColor: "rgba(254,254,254,1)",
        marginTop: 3,
        alignItems: 'center', // Center children vertically within the banner
        position: 'relative', // Allows the title to be absolutely positioned within this container
    },
    detailsWrapper: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginLeft: 'auto',
        width: 215, // Fixed width for the details container
        paddingTop: 10
    },
    container: {
        flexDirection: "row",
        alignItems: "center", // Vertically center the text within each row
        width: "100%",
    },
    pageTitle: {
        textAlign: 'center', // Center text within its container horizontally
        color: "rgba(0,22,62,1)",
        fontSize: 20,
        lineHeight: 20,
        fontFamily: "ZenKakuGothicAntique-Bold",
        position: 'absolute', // Absolute positioning to center title across the entire banner
        left: 0,
        right: 0,
    },
    label: {
        color: '#00163E',
        fontSize: 11,
        lineHeight: 12,
        width: 70,
        fontFamily: "ZenKakuGothicAntique-Regular",
    },
    details: {
        color: '#00163E',
        fontSize: 11,
        lineHeight: 12,
        fontFamily: "ZenKakuGothicAntique-Regular",
        marginLeft: 8,
        flexShrink: 1, // Allows text to shrink to fit within the container
    },
    vector: {
        borderRightColor: '#D4D4D4',
        borderRightWidth: StyleSheet.hairlineWidth,
        height: "79%",
    },
});
