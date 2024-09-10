import React, { useContext } from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HeaderOSI from '../../components/common/HeaderOSI';
import styles from '../../components/spots-styles';
import FirstPOForm from './FirstPOForm';
import SketchPlan from './SketchPlan';
import VehicleDamageReport from './VehicleDamageReport';
import { AccidentReportContext } from '../../context/accidentReportContext';
import { OfficerContext } from '../../context/officerContext';

const Tab = createMaterialTopTabNavigator();

const MainScreen = ({ navigation }) => {
    const { officer } = useContext(OfficerContext);

    return (
        <View style={{height: "100%"}}>
            <HeaderOSI title="On-Scene Investigation Report" officerName={officer.OFFICER_NAME} navigation={navigation} />
            
                <View style={styles.ContainerWhite}>
                    <View style={{overflow: "hidden", paddingBottom: 15}}>
                        
                        <View style={styles.OSIPOTabContainerFrame}>
                            <Tab.Navigator 
                                initialRouteName="First PO Form" 
                                screenOptions={{ 
                                    tabBarLabelStyle: { fontSize: 14 },
                                    swipeEnabled: false
                                }}
                            >
                                <Tab.Screen 
                                    name="First PO Form" 
                                    component={FirstPOForm} 
                                />
                                <Tab.Screen 
                                    name="Sketch Plan" 
                                    component={SketchPlan} 
                                />
                                <Tab.Screen 
                                    name="Vehicle Damage Report" 
                                    component={VehicleDamageReport} 
                                />
                            </Tab.Navigator>
                        </View>
                    </View>
                </View>
        </View>
    );
};

export default MainScreen;