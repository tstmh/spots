import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import styles from '../../components/spots-styles';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import HeaderBanner from '../../components/common/HeaderBanner';
import DatabaseService from '../../utils/DatabaseService';
import AccidentReport from '../../models/AccidentReport';
import Offenders from '../../models/Offenders';
import Summons from '../../models/Summons';
import { parseStringToDateTime, formatLocationCode } from '../../utils/Formatter'; 
import { AccidentReportContext } from '../../context/accidentReportContext';
import { OfficerContext } from '../../context/officerContext';

const IssuedSummonsScreen = ({ navigation }) => {
    const { officer } = useContext(OfficerContext);
    
    const [issuedSummons, setIssuedSummons] = useState([]);
    const [issuedCount, setIssuedCount] = useState(0);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchIssuedSummons();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchIssuedSummons();
        fetchIssuedCount();
    }, []);

    const fetchIssuedSummons = async () => {
        try {
            const issuedReports = await Summons.getIssuedSummons(DatabaseService.db);
            console.log("issuedReports" , issuedReports);
            const issuedsWithFormattedLocations = await Promise.all(issuedReports.map(async Issued => {
                
                const offendersCount = await Offenders.getOffendersCountBySummonsID(DatabaseService.db, Issued.ID);
                const offendersList = await Offenders.getOffendersListBySummonsID(DatabaseService.db, Issued.ID);
                // Get unique registrationNo list
                const regNoList = [...new Set(offendersList.map(offender => offender.registrationNo).filter(registrationNo => registrationNo !== null))];
                // Get unique name list for offenders with offenderType === 1
                const nameList = [...new Set(offendersList.filter(offender => offender.offenderType === 1).map(offender => offender.name))];

                const formattedLocation = await formatLocationCode(Issued.INCIDENT_OCCURED, Issued.LOCATION_CODE, Issued.LOCATION_CODE_2);
                const formattedDate = parseStringToDateTime(Issued.CREATED_AT);
                return { ...Issued, formattedLocation, formattedDate, regNoList, nameList, offendersCount };
            }));
            setIssuedSummons(issuedsWithFormattedLocations);
        } catch (error) {
            console.error("Failed to fetch Issued Summons:", error);
        }
    };

    const fetchIssuedCount = async () => {
        try {
            const count = await Summons.getIssuedCountSummons(DatabaseService.db);
            setIssuedCount(count);
        } catch (error) {
            console.error("Failed to fetch Issued count:", error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={IssuedStyles.row}>
        <View style={[{width:"20%"}, {justifyContent: "flex-start"}, {marginLeft:10}]}>
                <Text style={styles.LabelNormal}>{item.SPOTS_ID}</Text>
            </View>
            <View style={[{width:"10%"}, {justifyContent: "flex-start"}]}>
                <Text style={styles.LabelNormal}>{item.TYPE}</Text>
            </View>
            <View style={[{width:"23%"}, {justifyContent: "flex-start"}]}>
                <Text style={styles.LabelNormal}>{item.formattedLocation}</Text>
            </View>
            <View style={[{width:"22%"}, {justifyContent: "flex-start"}]}>
                {item.nameList && item.nameList.length > 0 && (
                    <>
                        <Text style={styles.LabelNormalBold}>Person Name: </Text>
                        {item.nameList.map((name, index) => (
                            <Text key={index} style={styles.LabelNormal}>{name}</Text>
                        ))}
                    </>
                )}
                {item.regNoList && item.regNoList.length > 0 && (
                    <>
                        <Text style={styles.LabelNormalBold}>Vehicle No: </Text>
                        {item.regNoList.map((regNo, index) => (
                            <Text key={index} style={styles.LabelNormal}>{regNo}</Text>
                        ))}
                    </>
                )}
            </View>
            <View style={[{width:"10%"}, {justifyContent: "flex-start"}]}>
                <Text style={styles.LabelNormal}>{item.offendersCount}</Text>
            </View>
            <View style={[{width:"15%"}, {justifyContent: "flex-start"}]}>
                <Text style={styles.LabelNormal}>{item.formattedDate}</Text>
            </View>
        </View>
    );    

    return (
        <View>
            <HeaderBanner title="Issued Summons" officerName={officer.OFFICER_NAME} navigation={navigation} />
            <View style={styles.ContainerGrey}>
                <View style={styles.ContainerWhite}>
                    <SafeAreaView style={IssuedStyles.TextContainer}>
                        <Text style={styles.LabelBig}>Total Reports: {issuedCount}</Text>
                        <View style={styles.MarginContainerSmall} />
                        <View style={IssuedStyles.container}>
                            <FlatList
                                data={issuedSummons}
                                renderItem={renderItem}
                                keyExtractor={item => item.ID.toString()}
                                ListHeaderComponent={
                                    <View style={IssuedStyles.header}>
                                        <View style={[{ width: "20%" }, { justifyContent: "flex-start" }, { marginLeft: 10 }]}>
                                            <Text style={styles.LabelSmall}>Spots ID.</Text>
                                        </View>
                                        <View style={[{ width: "10%" }, { justifyContent: "flex-start" }]}>
                                            <Text style={styles.LabelSmall}>Type</Text>
                                        </View>
                                        <View style={[{ width: "23%" }, { justifyContent: "flex-start" }]}>
                                            <Text style={styles.LabelSmall}>Location</Text>
                                        </View>
                                        <View style={[{ width: "22%" }, { justifyContent: "flex-start" }]}>
                                            <Text style={styles.LabelSmall}>Offender</Text>
                                        </View>
                                        <View style={[{ width: "10%" }, { justifyContent: "flex-start" }]}>
                                            <Text style={styles.LabelSmall}>Count</Text>
                                        </View>
                                        <View style={[{ width: "15%" }, { justifyContent: "flex-start" }]}>
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
        width: '92%',
        marginTop: '5%',
    },
    container: {
        width: '100%'
    }
});

export default IssuedSummonsScreen;