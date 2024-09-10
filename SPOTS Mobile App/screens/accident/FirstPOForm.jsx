import React, { useRef } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import styles from '../../components/spots-styles';
import Location from '../../containers/accident/Location';
import VehiclesInvolved from '../../containers/accident/VehiclesInvolved';
import StructureDamage from '../../containers/accident/StructureDamage';
import PedestrianInvolved from '../../containers/accident/PedestrianInvolved';
import Witnesses from '../../containers/accident/Witnesses';
import OfficerDeclaration from '../../containers/accident/OfficerDeclaration';
import PhotoUpload from '../../containers/accident/PhotoUpload';

const Tab = createMaterialTopTabNavigator();

const FirstPOForm = ({ navigation }) => {

    const locationRef = useRef();
    const vehicleRef = useRef();
    const pedestrianRef = useRef();
    const structureRef = useRef();
    const photoRef = useRef();
    const witnessRef = useRef();
    const declarationRef = useRef();

    const CustomTabBar = ({ state, descriptors, navigation, locationRef, vehicleRef, pedestrianRef, structureRef, photoRef, witnessRef, declarationRef }) => {
        const handleTabPress = async (route, index) => {
            console.log('handleTabPress');
            let canNavigate = true;
    
            const currentRouteName = state.routes[state.index].name;
            console.log('currentRouteName ', currentRouteName);

            // Map route names to corresponding refs
            const refMap = {
                'Accident Location': locationRef,
                'Vehicles Involved': vehicleRef,
                'Pedestrian Involved': pedestrianRef,
                'Structure Damage': structureRef,
                'Photo Upload': photoRef,
                'Witness/es': witnessRef,
                "Officer's Declaration": declarationRef,
            };

            // Check if there is a ref for the current route name
            const ref = refMap[currentRouteName];

            if (ref?.current?.validate) {
                canNavigate = await ref.current.validate();
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
                            <Text style={{ fontSize: 14, lineHeight: 16, fontFamily: "ZenKakuGothicAntique-Regular", fontWeight: isFocused ? 'bold' : 'normal' }}>
                                {descriptors[route.key].options.title || route.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.ContainerWhiteBGFrame}>
            <SafeAreaView style={styles.OSITextContainer}>

                {/* <OSIOfficerDetails/> */}

                <View style={styles.OSIPOTabContainerFrame}>
                    <Tab.Navigator 
                        initialRouteName="Accident Location" 
                        screenOptions={{ swipeEnabled: false }}
                        tabBar={(props) => (
                            <CustomTabBar 
                                {...props} 
                                locationRef={locationRef} 
                                vehicleRef={vehicleRef}
                                pedestrianRef={pedestrianRef}
                                structureRef={structureRef}
                                photoRef={photoRef}
                                witnessRef={witnessRef}
                                declarationRef={declarationRef}
                            />
                        )}
                    >
                        <Tab.Screen name="Accident Location">
                            {(props) => <Location ref={locationRef} {...props} />}
                        </Tab.Screen>
                        <Tab.Screen name="Vehicles Involved">
                            {(props) => <VehiclesInvolved ref={vehicleRef} {...props} />}
                        </Tab.Screen>
                        <Tab.Screen name="Pedestrian Involved">
                            {(props) => <PedestrianInvolved ref={pedestrianRef} {...props} />}
                        </Tab.Screen>
                        <Tab.Screen name="Structure Damage">
                            {(props) => <StructureDamage ref={structureRef} {...props} />}
                        </Tab.Screen>
                        <Tab.Screen name="Photo Upload">
                            {(props) => <PhotoUpload ref={photoRef} {...props} />}
                        </Tab.Screen>
                        <Tab.Screen name="Witness/es">
                            {(props) => <Witnesses ref={witnessRef} {...props} />}
                        </Tab.Screen>
                        <Tab.Screen name="Officer's Declaration">
                            {(props) => <OfficerDeclaration ref={declarationRef} {...props} />}
                        </Tab.Screen>
                    </Tab.Navigator>
                </View>
            
            </SafeAreaView>
        </View>
    );
};

export default FirstPOForm;