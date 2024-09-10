import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Login';
import DashboardScreen from '../screens/Dashboard';
import AccidentAddAccidentScreen from '../screens/accident/AddAccidentScreen';
import AccidentMainScreen from '../screens/accident/MainScreen';
import AccidentSketchPlan from '../screens/accident/SketchPlan';
import AccidentVehicleDetails from '../containers/accident/VehicleDetails';
import AccidentDriverDetails from '../containers/accident/DriverDetails';
import AccidentPassengerDetails from '../containers/accident/PassengerDetails';
import AccidentVehiclesInvolved from '../containers/accident/VehiclesInvolved';
import AccidentPhotoUpload from '../containers/accident/PhotoUpload';
import AccidentAddSketch from '../containers/accident/AddSketch';
import AccidentDraftAccidentScreen from '../screens/accident/DraftAccidentScreen';
import AccidentIssuedAccidentScreen from '../screens/accident/IssuedAccidentScreen';

import SummonsLocationScreen from '../containers/summons/Location';
import SummonsPedestrianCyclistScreen from '../containers/summons/PedestrianCyclistScreen';
import SummonsVehicle from '../containers/summons/SummonsVehicle';
import SummonsSummaryScreen from '../containers/summons/SummonsSummaryScreen';
import SummonsMainScreen from '../screens/summons/SummonsMainScreen';
import SummonsDraftSummonsScreen from '../screens/summons/DraftSummonsScreen';
import SummonsEchoMainScreen from '../screens/summons/SummonsEchoMainScreen';
import SummonsIssuedSummonsScreen from '../screens/summons/IssuedSummonsScreen';

const Stack = createNativeStackNavigator();

const Navigation = ({ initialRoute }) => {
    console.log('Navigation initialRoute', initialRoute);
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                />
                <Stack.Screen
                    name="AccidentAddAccidentScreen"
                    component={AccidentAddAccidentScreen}
                />
                <Stack.Screen
                    name="AccidentVehicleDetails"
                    component={AccidentVehicleDetails}
                />
                <Stack.Screen
                    name="AccidentDriverDetails"
                    component={AccidentDriverDetails}
                />
                <Stack.Screen
                    name="AccidentPassengerDetails"
                    component={AccidentPassengerDetails}
                />
                <Stack.Screen
                    name="AccidentVehiclesInvolved"
                    component={AccidentVehiclesInvolved}
                />
                <Stack.Screen
                    name="AccidentPhotoUpload"
                    component={AccidentPhotoUpload}
                />
                <Stack.Screen
                    name="AccidentSketchPlan"
                    component={AccidentSketchPlan}
                />
                <Stack.Screen
                    name="AccidentAddSketch"
                    component={AccidentAddSketch}
                />
                <Stack.Screen
                    name="AccidentMainScreen"
                    component={AccidentMainScreen}
                />
                <Stack.Screen
                    name="AccidentDraftAccidentScreen"
                    component={AccidentDraftAccidentScreen}
                />
                <Stack.Screen
                    name="AccidentIssuedAccidentScreen"
                    component={AccidentIssuedAccidentScreen}
                />
                <Stack.Screen
                    name="SummonsLocationScreen"
                    component={SummonsLocationScreen}
                />
                <Stack.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                />
                {/* Summons */}
                <Stack.Screen
                    name="SummonsEchoMainScreen"
                    component={SummonsEchoMainScreen}
                />
                <Stack.Screen
                    name="SummonsMainScreen"
                    component={SummonsMainScreen}
                /> 
                <Stack.Screen
                    name="SummonsPedestrianCyclistScreen"
                    component={SummonsPedestrianCyclistScreen}
                />
                <Stack.Screen
                    name="SummonsVehicle"
                    component={SummonsVehicle}
                />
                <Stack.Screen
                    name="SummonsSummaryScreen"
                    component={SummonsSummaryScreen}
                />
                <Stack.Screen
                    name="SummonsDraftSummonsScreen"
                    component={SummonsDraftSummonsScreen}
                />
                <Stack.Screen
                    name="SummonsIssuedSummonsScreen"
                    component={SummonsIssuedSummonsScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
