import React, { useState, useContext } from 'react';
import { TouchableOpacity, Image, Text, View, Alert } from "react-native"
import { StyleSheet } from 'react-native';
import { fetch } from "@react-native-community/netinfo";
import DatabaseService from '../../utils/DatabaseService';
import { OfficerContext } from '../../context/officerContext';
import Summons from '../../models/Summons';
import AccidentReport from '../../models/AccidentReport';
import TransactionLog from '../../models/TransactionLog';
import { sendTransactionLogsAPI } from '../../utils/ApiService';
import LoadingModal from '../../containers/common/Loading';

export default function OfficerDetails ({navigation}) {
    const { officer } = useContext(OfficerContext);
    const [loading, setLoading] = useState(false);

    const logout = async () => {
        setLoading(true);

        //check network connectivity
        const state = await fetch();
            
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);

        if (state.isConnected === false){
            setLoading(false);
            console.log('No network connectivity');
            Alert.alert("Connection failed.", "No network connectivity.");
            return; // Exit the submit function
        } 

        console.log("logging out!!");
        //start loading screen?

        // _fnCheckPendingSummons
        const pendingSummons = await Summons.getCountSummonsByStatus(DatabaseService.db, 3);

        // _fnCheckPendingAccident
        const pendingAccidents = await AccidentReport.getCountAccidentsByStatus(DatabaseService.db, 1);

        console.log(`pendingSummons: ${pendingSummons}, pendingAccidents ${pendingAccidents}`);

        if (pendingSummons > 0 || pendingAccidents > 0){
            setLoading(false);

            Alert.alert("Found incomplete submission.", "Please review before logging out.");
            return;
        }

        // _fnSendLogs
        const logsToSend = await TransactionLog.getAllLogs(DatabaseService.db); //LogHelper.log
        console.log(`logsToSend: ${logsToSend?.length}`, logsToSend);
        if (!logsToSend && logsToSend.length > 0){
            const sendLogsSuccess = await sendTransactionLogsAPI(DatabaseService.db, logsToSend);
            if (!sendLogsSuccess){
                setLoading(false);
                Alert.alert("Connection failed.", "Sending logs failed.");
                return;
            }
        }

        // _fnWipeOutData
        var wipeSuccess = await DatabaseService.wipeOutTransactional();
        console.log(`wipeOutTransactional: `, wipeSuccess);
        setLoading(false);

        if (wipeSuccess){
            navigation.navigate('LoginScreen');
        }
    }

    const confirmLogout = (id) => {
        Alert.alert(
            "Exit App",
            "Are you sure you want to logout? ",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "LOG OUT",
                    onPress: () => logout(),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={{padding: 15}}>
            <View style={styles.Container}>
                <Text style={styles.label}>Officer Name</Text>
                <Text style={styles.labelBold}>{officer.OFFICER_NAME}</Text>
            </View>
            <View style={styles.Container}>
                <Text style={styles.label}>Rank and No.</Text>
                <Text style={styles.labelBold}>{officer.OFFICER_RANK}</Text>
            </View>
            <View style={styles.Container}>
                <Text style={styles.label}>Police Division</Text>
                <Text style={styles.labelBold}>{officer.OFFICER_TEAM}</Text>
            </View>
            <View style={styles.Container}>
                <Text style={styles.label}>NRIC</Text>
                <Text style={styles.labelBold}>{officer.NRIC_NO}</Text>
            </View>
            <View style={styles.horizontalVector} />
            <TouchableOpacity style={styles.buttonStyle} onPress={() => confirmLogout()}>
                <Text style={styles.backToHome}>Exit App</Text>
                <Image
                    source={require('../../assets/icon/logout-red.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
            <LoadingModal visible={loading} />
        </View>
    )
};

const styles = StyleSheet.create({
    Container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        boxSizing: "border-box",
        marginBottom: 7,
        marginTop: 7,
    },
    label: {
        marginRight: 16,
        color: "rgba(0,22,62,1)",
        fontSize: 15,
        lineHeight: 18,
        fontFamily: "ZenKakuGothicAntique-Regular",
    },
    labelBold: {
        marginRight: 16,
        color: "rgba(13,82,210,1)",
        fontSize: 16,
        lineHeight: 18,
        fontFamily: "ZenKakuGothicAntique-Bold",
        marginTop: 3
    },
    details: {
        marginRight: 16,
        color: '#00163E',
        fontSize: 16,
        lineHeight: 18,
        fontFamily: "ZenKakuGothicAntique-Regular",
        marginLeft: 20,
    },
    horizontalVector: {
        borderBottomColor: '#D4D4D4',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 8,
        marginTop: 5,
    },
    buttonStyle: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        height: 35,
    },
    backToHome: {
        marginRight: 2,
        color: "rgba(231,64,64,1)",
        fontSize: 16,
        lineHeight: 16,
        fontFamily: "ZenKakuGothicAntique-Bold"
    },
    icon: { 
        height: 20,
        width: 25 
    },
});