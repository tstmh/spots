import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useState, useCallback } from 'react';
import {View,Text,SafeAreaView, FlatList} from 'react-native';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import BlueButton from '../../components/common/BlueButton';
// import styles from './spots-styles';
import styles from '../../components/spots-styles-summons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SummonsContext } from '../../context/summonsContext';
import { OfficerContext } from '../../context/officerContext';
import Summons from '../../models/Summons';
import DatabaseService from '../../utils/DatabaseService';
import { parseStringToDateTime } from '../../utils/Formatter';
import { submitSummonsReport } from '../../utils/SubmitHelper';
import LoadingModal from '../common/Loading';

const Tab = createMaterialTopTabNavigator();

const SummonsEchoSummaryScreen = ({ navigation }) => {
    const { summons, resetSummons } = useContext(SummonsContext);
    const { officer } = useContext(OfficerContext);
    const [summary, setSummary] = useState([]);
    const [formattedSummary, setFormattedSummary] = useState([]);
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        
        setLoading(true);

        const success = await submitSummonsReport(summons.ID);
        console.log('submitSummonsReport success?', success);
        
        setLoading(false);

        if (success == true){
            resetSummons();
            navigation.navigate('Dashboard');
        }
    };

    //on tab focus, get summary
    useFocusEffect(
        useCallback(() => {
            fetchSummary();
        }, [])
    );

    const fetchSummary = async () => {
        try {
            const vehSummary = await Summons.getVehicleSummary(DatabaseService.db, summons.SPOTS_ID, 2);
            console.log('vehSummary' , vehSummary);

            setSummary(vehSummary);

            const summaryFormattedLocations = await Promise.all(vehSummary.map(async veh => {
                const formattedLocation = formatLocationCode(veh.INCIDENT_OCCURED, veh.LOCATION_CODE, veh.LOCATION_CODE_2);
                const formattedDate = parseStringToDateTime(veh.CREATED_AT);

                return { ...veh, formattedLocation, formattedDate };
            }));

            console.log('summaryFormattedLocations' , summaryFormattedLocations);

            setFormattedSummary( summaryFormattedLocations);

        } catch (error) {
            console.error("Failed to fetch summary:", error);
        }
    };

    const formatLocationCode = (incidentOccuredType, location1, location2) => {
        console.log(``)
    
        /* If Location 1 is null then return empty */
        if (location1 === null) return " ";
    
        /* Format Location 1 and 2 */
        if (incidentOccuredType === 2) return "Junction of " + location1 + " and " + location2;
        else if (incidentOccuredType === 3) return location1 + " Slip Road onto " + location2;
        else if (incidentOccuredType === 4) return "Along " + location1 + " Travelling Towards " + location2;
        else return "Along " + location1;
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.SummonsSummaryItems}>
            <View style={styles.SummonsSN}>
                <Text style={styles.LabelNormal}>{index + 1}</Text>
            </View>
            <View style={styles.SummonsOffenderName}>
                <Text style={styles.LabelNormal}>{item.VEHICLE_NO}</Text>
            </View>
            <View style={styles.SummonsOffenceType}>
                <Text style={styles.LabelNormal}>{item.OFFENCE_TYPE}</Text>
            </View>
            <View style={styles.SummonsLocation}>
                <Text style={styles.LabelNormal}>{item.formattedLocation}</Text>
            </View>
            <View style={styles.SummonsDateTime}>
                <Text style={styles.LabelNormal}>{item.formattedDate}</Text>
            </View>
        </View>
    );   

    const ListHeader = () => (
        <View style={[styles.SummonsSummaryList, {backgroundColor: 'rgba(242,245,249,1)', borderRadius: 10}]}>
            <View style={styles.SummonsSN}>
                <Text style={styles.Label}>S/N</Text>
            </View>
            <View style={styles.SummonsOffenderName}>
                <Text style={styles.Label}>Vehicle No.</Text>
            </View>
            <View style={styles.SummonsOffenceType}>
                <Text style={styles.Label}>Offence Type</Text>
            </View>
            <View style={styles.SummonsLocation}>
                <Text style={styles.Label}>Location</Text>
            </View>
            <View style={styles.SummonsDateTime}>
                <Text style={styles.Label}>Date & Time</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.ContainerWhiteBGSummons}>
        <Text style={styles.PageTitle}>Vehicles</Text>
        <View style={styles.MarginContainerXLarge} />
        <Text style={[styles.SpecialZone, {paddingBottom: 7}]}> Total Records {summary?.length} </Text>
        <View style={{flexDirection:'column',width: '100%',borderRadius: 10,}}>
            <FlatList
                style={{height: '70%'}}
                data={formattedSummary}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={ListHeader}
                />
            </View>
            <View style={styles.MarginContainerXLarge} />
            <View style={styles.TextInputContainer}>
                <BlueButton title="SUBMIT" customClick={() => submit()}/>
                <View style={{height: 20}} />
                <BackToHomeButton />
            </View>
            <LoadingModal visible={loading} />
        </SafeAreaView>
    );
};

export default SummonsEchoSummaryScreen;
