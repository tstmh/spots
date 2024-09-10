import React, { useContext, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SummonsLocationScreen from '../../containers/summons/Location';
import HeaderBannerSummons from '../../components/common/HeaderBannerSummons';
import SummonsEchoVehicle from '../../containers/summons/SummonsEchoVehicle';
import SummonsEchoSummaryScreen from '../../containers/summons/SummonsEchoSummaryScreen';
import { SummonsContext } from '../../context/summonsContext';
import { OfficerContext } from '../../context/officerContext';

const Tab = createMaterialTopTabNavigator();

const SummonsMainScreen = ({ navigation }) => {
    const { summons, updateSummon } = useContext(SummonsContext);
    const { officer, updateOfficer } = useContext(OfficerContext);
    console.log("SummonsMainScreen >>", summons);

    const locationRef = useRef();
    const vehicleRef = useRef();

    const CustomTabBar = ({ state, descriptors, navigation, locationRef, vehicleRef }) => {
        const handleTabPress = async (route, index) => {
            console.log('handleTabPress');
            let canNavigate = true;
    
            // Check which screen is being navigated from
            const currentRouteName = state.routes[state.index].name;
            console.log('currentRouteName ', currentRouteName);
    
            if (currentRouteName === 'Location') {
                if (locationRef.current?.validate) {
                    canNavigate = await locationRef.current.validate();  // Await the result of validate
                }
            } else if (currentRouteName === 'Vehicle') {
                if (vehicleRef.current?.validate) {
                    canNavigate = await vehicleRef.current.validate();  // Await the result of validate
                }
            }
            console.log('canNavigate? ', canNavigate);
            console.log('route.name ', route.name);
    
            if (canNavigate) {
                navigation.navigate(route.name);
            }
        };
    
        return (
            <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' }}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={() => handleTabPress(route, index)}
                            style={{
                                flex: 1,
                                paddingVertical: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomWidth: isFocused ? 2 : 0,
                                borderBottomColor: isFocused ? '#007aff' : 'transparent',
                            }}
                        >
                            <Text style={{ fontSize: 17, fontFamily: "ZenKakuGothicAntique-Regular", fontWeight: isFocused ? 'bold' : 'normal' }}>
                                {descriptors[route.key].options.title || route.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={{ height: '100%' }}>
            <HeaderBannerSummons SummonsTitle="Summons" title={summons.TYPE} RefNo="Ref No." RefId={summons.SPOTS_ID} officerName={officer.OFFICER_NAME} navigation={navigation} />

            <View style={{
                flexDirection: "column",
                justifyContent: 'flex-start',
                height: '100%',
                margin:15,
                backgroundColor: "rgba(254,254,254,1)",
                padding: 15
            }}>
                <View style={{
                    height:'100%',
                    alignContent: 'flex-start',
                    justifyContent: 'flex-start',

                }}>
                    <Tab.Navigator
                        initialRouteName="Location"
                        screenOptions={{ labelStyle: { fontSize: 11 }, swipeEnabled: false }}
                        tabBar={(props) => (
                            <CustomTabBar 
                                {...props} 
                                locationRef={locationRef} 
                                vehicleRef={vehicleRef} 
                            />
                        )}
                    >
                        <Tab.Screen name="Location">
                            {(props) => <SummonsLocationScreen ref={locationRef} {...props} />}
                        </Tab.Screen>
                        <Tab.Screen name="Vehicle">
                            {(props) => <SummonsEchoVehicle ref={vehicleRef} {...props} />}
                        </Tab.Screen>
                        <Tab.Screen name="Summary" component={SummonsEchoSummaryScreen} />

                    </Tab.Navigator>
                </View>
            </View>

        </View>
    );
};

export default SummonsMainScreen;