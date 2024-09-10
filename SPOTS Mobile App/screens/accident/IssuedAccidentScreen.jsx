import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import styles from '../../components/spots-styles';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import HeaderBanner from '../../components/common/HeaderBanner';
import DatabaseService from '../../utils/DatabaseService';
import AccidentReport from '../../models/AccidentReport';
import { parseStringToDateTime, formatLocationCode } from '../../utils/Formatter'; 
import { OfficerContext } from '../../context/officerContext';

const IssuedAccidentScreen = ({ navigation }) => {
    const { officer } = useContext(OfficerContext);
    
    const [IssuedAccidents, setIssuedAccidents] = useState([]);
    const [IssuedCount, setIssuedCount] = useState(0);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchIssuedAccidents();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchIssuedAccidents();
        fetchIssuedCount();
    }, []);

    const fetchIssuedAccidents = async () => {
        try {
            const issuedReports = await AccidentReport.getIssuedOSI(DatabaseService.db);
            console.log("issuedReports" , issuedReports);
            const IssuedsWithFormattedLocations = await Promise.all(issuedReports.map(async Issued => {
                const formattedLocation = await formatLocationCode(Issued.INCIDENT_OCCURED, Issued.LOCATION_CODE, Issued.LOCATION_CODE_2);
                const formattedDate = parseStringToDateTime(Issued.CREATED_AT);
                return { ...Issued, formattedLocation, formattedDate };
            }));
            setIssuedAccidents(IssuedsWithFormattedLocations);
        } catch (error) {
            console.error("Failed to fetch Issued accidents:", error);
        }
    };

    const fetchIssuedCount = async () => {
        try {
            const count = await AccidentReport.getIssuedOSICount(DatabaseService.db);
            setIssuedCount(count);
        } catch (error) {
            console.error("Failed to fetch Issued count:", error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={IssuedStyles.row}>
        <View style={[{width:"27%"}, {justifyContent: "flex-start"}, {marginLeft:10}]}>
                <Text style={styles.LabelNormal}>{item.INCIDENT_NO}</Text>
            </View>
            <View style={[{width:"45%"}, {justifyContent: "flex-start"}]}>
                <Text style={styles.LabelNormal}>{item.formattedLocation}</Text>
            </View>
            <View style={[{width:"28%"}, {justifyContent: "flex-start"}]}>
                <Text style={styles.LabelNormal}>{item.formattedDate}</Text>
            </View>
        </View>
    );    

    return (
        <View>
            <HeaderBanner title="Issued On-Scene Investigation Report" officerName={officer.OFFICER_NAME} navigation={navigation} />
            <View style={styles.ContainerGrey}>
                <View style={styles.ContainerWhite}>
                    <SafeAreaView style={IssuedStyles.TextContainer}>
                        <Text style={styles.LabelBig}>Total Reports: {IssuedCount}</Text>
                        <View style={styles.MarginContainerSmall} />
                        <View style={IssuedStyles.container}>
                            <FlatList
                                data={IssuedAccidents}
                                renderItem={renderItem}
                                keyExtractor={item => item.ID.toString()}
                                ListHeaderComponent={
                                    <View style={IssuedStyles.header}>
                                        <View style={[{ width: "27%" }, { justifyContent: "flex-start" }, { marginLeft: 10 }]}>
                                            <Text style={styles.LabelSmall}>Incident No.</Text>
                                        </View>
                                        <View style={[{ width: "45%" }, { justifyContent: "flex-start" }]}>
                                            <Text style={styles.LabelSmall}>Location</Text>
                                        </View>
                                        <View style={[{ width: "28%" }, { justifyContent: "flex-start" }]}>
                                            <Text style={styles.LabelSmall}>Date/Time</Text>
                                        </View>
                                    </View>
                                }
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            />
                        </View>
                        <View style={styles.MarginContainer} />
                        <BackToHomeButton/>
                    </SafeAreaView>
                </View>
            </View>
        </View>
    );
};

const IssuedStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'rgba(212, 212, 212, 0.8)',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    TextContainer: {
        flex: 1,
        height: '100%',
        width: '87%',
        marginTop: '5%',
    }
    
});

export default IssuedAccidentScreen;