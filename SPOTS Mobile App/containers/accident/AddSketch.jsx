import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import styles from '../../components/spots-styles';
import DatabaseService from '../../utils/DatabaseService';
import FirstPOForm from '../../screens/accident/FirstPOForm';
import VehicleDamageReport from '../../screens/accident/VehicleDamageReport';
import Sketch from './Sketch';
import IOList from '../../models/IOList';
import { AccidentReportContext } from '../../context/accidentReportContext';

const Tab = createMaterialTopTabNavigator();

const AddSketch = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const sketchImage = route.params?.sketchImage;

    const { accidentReport } = useContext(AccidentReportContext);
    const [ioName, setIoName] = useState('');

    useEffect(() => {
        const fetchIOName = async () => {
            try {
                const name = await IOList.getIONameById(DatabaseService.db, accidentReport.IO_NAME); 
                console.log(`fetchIOName name ${name}`);
                setIoName(name);
            } catch (error) {
                console.error(`Error fetching IO name ${accidentReport.IO_NAME}:`, error);
            }
        };

        fetchIOName();
    }, []);

    useEffect(() => {
        // Lock the screen to landscape mode when the component mounts
        Orientation.lockToLandscape();
        
        // Remember to unlock the orientation when the component unmounts
        return () => {
            Orientation.unlockAllOrientations();
            Orientation.lockToPortrait();
        };
    }, []);

    return (
        <View style={styles.ContainerWhiteBGFrame}>

            <View style={styles.SketchBanner}>
                <Text style={styles.SketchBannerTitle}>
                    On-Scene Investigation Report
                </Text>
                <View style={styles.SketchBannerTextComponent}>
                    <View style={styles.SketchBannerTextComponentMargin}>
                        <Text style={styles.SketchBannerText}>Incident No.</Text>
                        <View style={{ width: 1, height: "40%", backgroundColor: '#D4D4D4', marginLeft: 10, marginRight: 10}} />
                        <Text style={styles.SketchBannerText}>{accidentReport.INCIDENT_NO}</Text>
                    </View>
                    <View style={styles.SketchBannerTextComponentMargin}>
                        <Text style={styles.SketchBannerText}>IO Name</Text>
                        <View style={{ width: 1, height: "40%", backgroundColor: '#D4D4D4', marginLeft: 10, marginRight: 10}} />
                        <Text style={styles.SketchBannerText}>{ioName} </Text>
                    </View>
                    <View style={styles.SketchBannerTextComponent}>
                        <Text style={styles.SketchBannerText}>IO No.</Text>
                        <View style={{ width: 1, height: "40%", backgroundColor: '#D4D4D4', marginLeft: 10, marginRight: 10}} />
                        <Text style={styles.SketchBannerText}>{accidentReport.IO_EXTENSION_NO}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.SketchContainerFrame}>
                <Tab.Navigator
                    initialRouteName="Sketch Plan"
                    screenOptions={{ 
                        labelStyle: { fontSize: 11 },
                        swipeEnabled: false
                    }}
                >
                    <Tab.Screen
                        name="First PO Form"
                        component={FirstPOForm}
                        listeners={{
                            tabPress: (e) => {
                                e.preventDefault();
                                navigation.navigate('AccidentMainScreen', { screen: 'First PO Form' });
                            },
                        }}
                    />
                    <Tab.Screen name="Sketch Plan" component={Sketch} initialParams={{ sketchImage }} />
                    <Tab.Screen
                        name="Vehicle Damage Report"
                        component={VehicleDamageReport}
                        listeners={{
                            tabPress: (e) => {
                                e.preventDefault();
                                navigation.navigate('AccidentMainScreen', { screen: 'Vehicle Damage Report' });
                            },
                        }}
                    />
                </Tab.Navigator>
            </View>
        </View>
    );
};

export default AddSketch;