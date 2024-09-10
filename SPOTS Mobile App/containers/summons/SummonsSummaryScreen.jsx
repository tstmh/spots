import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useContext, useCallback } from 'react';
import {View, Text, SafeAreaView, ScrollView, FlatList} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SummonsContext } from '../../context/summonsContext';
import { parseStringToDateTime } from '../../utils/Formatter';
import DatabaseService from '../../utils/DatabaseService';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import BlueButton from '../../components/common/BlueButton';
import styles from '../../components/spots-styles-summons';
import Summons from '../../models/Summons';
import { submitSummonsReport } from '../../utils/SubmitHelper';
import LoadingModal from '../common/Loading';

const Tab = createMaterialTopTabNavigator();

const SummonsSummaryScreen = ({ navigation }) => {
    const { summons, resetSummons } = useContext(SummonsContext);
    const [formattedPedestrianSummary, setFormattedPedestrianSummary] = useState([]);
    const [formattedVehicleSummary, setFormattedVehicleSummary] = useState([]);

    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchSummary();
        }, [])
    );

    const fetchSummary = async () => {
        try {
            //PEDESTRIAN_SUMMONS: 1, VEHICLE_SUMMONS: 2, PASSENGER_SUMMONS: 3,

            // PEDESTRIAN SUMMARY
            const pedSummary = await Summons.getVehicleSummary(DatabaseService.db, summons.SPOTS_ID, 1);
            console.log('pedSummary' , pedSummary);

            const summaryFormattedPedLocations = await Promise.all(pedSummary.map(async ped => {
                const formattedLocation = formatLocationCode(ped.INCIDENT_OCCURED, ped.LOCATION_CODE, ped.LOCATION_CODE_2);
                const formattedDate = parseStringToDateTime(ped.CREATED_AT);

                return { ...ped, formattedLocation, formattedDate };
            }));
            setFormattedPedestrianSummary(summaryFormattedPedLocations);
            
            // DRIVER AND PASSENGER SUMMARY
            const vehSummary = await Summons.getSummonsVehicleSummaryTest(DatabaseService.db, summons.SPOTS_ID, 2);
            console.log('vehSummary' , vehSummary);

            const summaryFormattedVehLocations = await Promise.all(vehSummary.map(async veh => {
                const formattedLocation = formatLocationCode(veh.INCIDENT_OCCURED, veh.LOCATION_CODE, veh.LOCATION_CODE_2);
                const formattedDate = parseStringToDateTime(veh.CREATED_AT);

                return { ...veh, formattedLocation, formattedDate };
            }));

            setFormattedVehicleSummary(summaryFormattedVehLocations);

            // const combinedSummary = [...pedSummary, ...vehSummary];
            // console.log('combinedSummary', combinedSummary);
            // setSummary(combinedSummary);

            // const summaryFormattedLocations = await Promise.all(combinedSummary.map(async veh => {
            //     const formattedLocation = formatLocationCode(veh.INCIDENT_OCCURED, veh.LOCATION_CODE, veh.LOCATION_CODE_2);
            //     const formattedDate = parseStringToDateTime(veh.CREATED_AT);

            //     return { ...veh, formattedLocation, formattedDate };
            // }));

            // console.log('summaryFormattedLocations' , summaryFormattedLocations);

            // setFormattedSummary( summaryFormattedLocations);

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

    const renderPedItem = ({ item, index }) => (
        <View style={[styles.SummonsSummaryItems, {backgroundColor: 'white'}]}>
            <View style={styles.SummonsSN}>
                <Text style={styles.LabelNormal}>{index + 1}</Text>
            </View>
            <View style={styles.SummonsOffenderName}>
                <Text style={styles.LabelNormal}>{item.NAME}</Text>
            </View>
            <View style={styles.SummonsID}>
                <Text style={styles.LabelNormal}>{item.IDENTIFICATION_NO}</Text>
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
    
    const PedestrianListHeader = () => (
        <View style={[styles.SummonsSummaryList, {backgroundColor: 'rgba(242,245,249,1)', borderRadius: 10}]}>
            <View style={styles.SummonsSN}>
                <Text style={styles.LabelNormalBold}>S/N</Text>
            </View>
            <View style={styles.SummonsOffenderName}>
                <Text style={styles.LabelNormalBold}>Offender Name</Text>
            </View>

            <View style={styles.SummonsID}>
                <Text style={styles.LabelNormalBold}>ID No.</Text>
            </View>

            <View style={styles.SummonsOffenceType}>
                <Text style={styles.LabelNormalBold}>Offence Type</Text>
            </View>

            <View style={styles.SummonsLocation}>
                <Text style={styles.LabelNormalBold}>Location</Text>
            </View>

            <View style={styles.SummonsDateTime}>
                <Text style={styles.LabelNormalBold}>Date/Time</Text>
            </View>
        </View>
    );

    const renderVehItem = ({ item, index }) => (
        <View style={[styles.SummonsSummaryItems, {backgroundColor: 'white'}]}>
            <View style={{width:'5%',padding:0,alignItems:"center"}}>
                <Text style={styles.LabelNormal}>{index + 1}</Text>
            </View>
            <View style={{width:'15%',padding:0,alignItems:"center"}}>
                <Text style={styles.LabelNormal}>{item.NAME}</Text>
            </View>
            <View style={{width:'15%',padding:0,alignItems:"center"}}>
                <Text style={styles.LabelNormal}>{item.IDENTIFICATION_NO}</Text>
            </View>
            <View style={{width:'23%',padding:0,alignItems:"center"}}>
                <Text style={styles.LabelNormal}>{item.OFFENCE_TYPE}</Text>
            </View>
            <View style={{width:'15%',padding:0,alignItems:"center"}}>
                <Text style={styles.LabelNormal}>{item.VEHICLE_NO}</Text>
            </View>
            <View style={{width:'17%',padding:0,alignItems:"center"}}>
                <Text style={styles.LabelNormal}>{item.formattedLocation}</Text>
            </View>
            <View style={{width:'10%',padding:0,alignItems:"center"}}>
                <Text style={styles.LabelNormal}>{item.formattedDate}</Text>
            </View>
        </View>
    );   

    const VehicleListHeader = () => (
        <View style={[styles.SummonsSummaryList, {backgroundColor: 'rgba(242,245,249,1)', borderRadius: 10}]}>
            <View style={{width:'5%',padding:0,alignItems:"center", justifyContent: 'center'}}>
                <Text style={styles.LabelNormalBold}>S/N</Text>
            </View>
            <View style={{width:'15%',padding:0,alignItems:"center", justifyContent: 'center'}}>
                <Text style={styles.LabelNormalBold}>Offender Name</Text>
            </View>
            <View style={{width:'15%',padding:0,alignItems:"center"}}>
                <Text style={styles.LabelNormalBold}>ID No.</Text>
            </View>
            <View style={{width:'23%',padding:0,alignItems:"center"}}>
                <Text style={styles.LabelNormalBold}>Offence Type</Text>
            </View>
            <View style={{width:'15%',padding:0,alignItems:"center"}}>
                <Text style={styles.LabelNormalBold}>Vehicle No.</Text>
            </View>
            <View style={{width:'17%',padding:0,alignItems:"center"}}>
                <Text style={styles.LabelNormalBold}>Location</Text>
            </View>
            <View style={{width:'10%',padding:0,alignItems:"center"}}>
                <Text style={styles.LabelNormalBold}>Date/Time</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.ContainerWhiteBGSummons}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5}}>
                <Text style={[styles.SummaryTitle, {paddingLeft: 10}]}>Pedestrian / Cyclist</Text>
                <Text style={[styles.SpecialZone, {paddingBottom: 7}]}> Total Record: {formattedPedestrianSummary?.length} </Text>    
            </View>
            <View style={{flexDirection:'column',width: '100%',borderRadius: 10}}>
                <FlatList
                    style={{height: '40%'}}
                    data={formattedPedestrianSummary}
                    renderItem={renderPedItem}
                    keyExtractor={item => item.ID.toString()}
                    ListHeaderComponent={PedestrianListHeader}
                />
            </View>
            <View style={{height: 20}} />
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5}}>
                <Text style={[styles.SummaryTitle, {paddingLeft: 10}]}>Vehicle</Text>
                <Text style={[styles.SpecialZone, {paddingBottom: 7}]}> Total Record: {formattedVehicleSummary?.length} </Text>    
            </View>
            <View style={{flexDirection:'column',width: '100%',borderRadius: 10,}}>
                <FlatList
                    style={{height: '40%'}}
                    data={formattedVehicleSummary}
                    renderItem={renderVehItem}
                    keyExtractor={item => item.OFFENDER_ID.toString()}
                    ListHeaderComponent={VehicleListHeader}
                />
            </View>
            <View style={styles.TextInputContainer}>
                <BlueButton title="SUBMIT" customClick={() => submit()}/>
                <View style={{height: 20}} />
                <BackToHomeButton />
            </View>
            <LoadingModal visible={loading} />
        </SafeAreaView>
    );
};

export default SummonsSummaryScreen;
