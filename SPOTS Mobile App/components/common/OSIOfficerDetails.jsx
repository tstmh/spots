import React, { useEffect, useState, useContext } from 'react';
import { Text, View } from "react-native"
import { StyleSheet } from 'react-native';
import IOList from '../../models/IOList';
import DatabaseService from '../../utils/DatabaseService';
import { AccidentReportContext } from '../../context/accidentReportContext';

export default function OSIOfficerDetails () {
    const { accidentReport } = useContext(AccidentReportContext);

    const [ioName, setIoName] = useState('');

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
        <View>
            <View style={osistyles.Container}>
                <Text style={osistyles.label}>Incident No.</Text>
                <Text style={osistyles.vector} />
                <Text style={osistyles.details}>{accidentReport.INCIDENT_NO}</Text>
            </View>
            <View style={osistyles.Container}>
                <Text style={osistyles.label}>IO Name</Text>
                <Text style={osistyles.vector} />
                <Text style={osistyles.details}>{ioName}</Text>
            </View>
            <View style={osistyles.Container}>
                <Text style={osistyles.label}>IO No.</Text>
                <Text style={osistyles.vector} />
                <Text style={osistyles.details}>{accidentReport.IO_EXTENSION_NO}</Text>
            </View>
        </View>
    )
};

const osistyles = StyleSheet.create({
    Container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        marginBottom: 7,
    },
    label: {
        marginRight: 16,
        color: '#00163E',
        fontSize: 16,
        width: "15%", 
        lineHeight: 18,
        fontFamily: "ZenKakuGothicAntique-Regular",
    },
    details: {
        marginRight: 16,
        color: '#00163E',
        fontSize: 16,
        lineHeight: 18,
        fontFamily: "ZenKakuGothicAntique-Regular",
        marginLeft: 20,
    },
    vector: {
        borderRightColor: '#D4D4D4',
        borderRightWidth: StyleSheet.hairlineWidth,
        height: "79%",
    },
});