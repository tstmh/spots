import React from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const vehicleImages = [
    { id: '1', src: require('../../assets/presets/vehicle/1-2x.png') },
    { id: '2', src: require('../../assets/presets/vehicle/2-2x.png') },
    { id: '3', src: require('../../assets/presets/vehicle/3-2x.png') },
    { id: '4', src: require('../../assets/presets/vehicle/4-2x.png') },
    { id: '5', src: require('../../assets/presets/vehicle/5-2x.png') },
    { id: '6', src: require('../../assets/presets/vehicle/6-2x.png') },
    { id: '7', src: require('../../assets/presets/vehicle/7-2x.png') },
    { id: '8', src: require('../../assets/presets/vehicle/8-2x.png') },
    { id: '9', src: require('../../assets/presets/vehicle/9-2x.png') },
    { id: '10', src: require('../../assets/presets/vehicle/10-2x.png') },
    { id: '11', src: require('../../assets/presets/vehicle/pmd-right.png') },
    { id: '12', src: require('../../assets/presets/vehicle/pmd-left.png') },
    { id: '13', src: require('../../assets/presets/vehicle/pab-right.png') },
    { id: '14', src: require('../../assets/presets/vehicle/pab-left.png') },
    { id: '15', src: require('../../assets/presets/vehicle/bus-top.png') },
    { id: '16', src: require('../../assets/presets/vehicle/bus-bottom.png') },
    { id: '17', src: require('../../assets/presets/vehicle/bus-right.png') },
    { id: '18', src: require('../../assets/presets/vehicle/bus-left.png') },
    { id: '19', src: require('../../assets/presets/vehicle/lorry-top.png') },
    { id: '20', src: require('../../assets/presets/vehicle/lorry-bottom.png') },
    { id: '21', src: require('../../assets/presets/vehicle/lorry-right.png') },
    { id: '22', src: require('../../assets/presets/vehicle/lorry-left.png') },
    { id: '23', src: require('../../assets/presets/vehicle/truck-top.png') },
    { id: '24', src: require('../../assets/presets/vehicle/truck-bottom.png') },
    { id: '25', src: require('../../assets/presets/vehicle/truck-right.png') },
    { id: '26', src: require('../../assets/presets/vehicle/truck-left.png') },
    //VDR 
    { id: '27', src: require('../../assets/vehicles/bicycle/bicycle_1/bicycle_1_left.png') },
    { id: '28', src: require('../../assets/vehicles/bicycle/bicycle_1/bicycle_1_right.png') },
    { id: '29', src: require('../../assets/vehicles/bicycle/bicycle_2/bicycle_2_left.png') },
    { id: '30', src: require('../../assets/vehicles/bicycle/bicycle_2/bicycle_2_right.png') },
    { id: '31', src: require('../../assets/vehicles/bicycle/bicycle_3/bicycle_3_left.png') },
    { id: '32', src: require('../../assets/vehicles/bicycle/bicycle_3/bicycle_3_right.png') },
];

const roadImages = [
    { id: '1', src: require('../../assets/presets/roads/cross-road.png') },
    { id: '2', src: require('../../assets/presets/roads/straight-road.png') },
    { id: '3', src: require('../../assets/presets/roads/t-road.png') },
    { id: '4', src: require('../../assets/presets/roads/Icons-33.png') },
    { id: '5', src: require('../../assets/presets/roads/Icons-34.png') },
    { id: '6', src: require('../../assets/presets/roads/Icons-35.png') },
    { id: '7', src: require('../../assets/presets/roads/Icons-36.png') },
    { id: '8', src: require('../../assets/presets/roads/Icons-37.png') },
    { id: '9', src: require('../../assets/presets/roads/Icons-38.png') },
    { id: '10', src: require('../../assets/presets/roads/Icons-39.png') },
    { id: '11', src: require('../../assets/presets/roads/Icons-40.png') },
    { id: '12', src: require('../../assets/presets/roads/Icons-41.png') },
    { id: '13', src: require('../../assets/presets/roads/Icons-42.png') },
    { id: '14', src: require('../../assets/presets/roads/Icons-43.png') },
    { id: '15', src: require('../../assets/presets/roads/Icons-44.png') },
    { id: '16', src: require('../../assets/presets/roads/Icons-45.png') },
    { id: '17', src: require('../../assets/presets/roads/Icons-46.png') },
    { id: '18', src: require('../../assets/presets/roads/Icons-49.png') },
    { id: '19', src: require('../../assets/presets/roads/yellow-box.png') },
    { id: '20', src: require('../../assets/presets/roads/cross_walk.png') },
    { id: '21', src: require('../../assets/presets/roads/Icons-50.png') },
    { id: '22', src: require('../../assets/presets/roads/Icons-51.png') },
    { id: '23', src: require('../../assets/presets/roads/straight-left.png') },
    { id: '24', src: require('../../assets/presets/roads/straight-right.png') },
    { id: '25', src: require('../../assets/presets/roads/forward-arrow.png') },
    { id: '26', src: require('../../assets/presets/roads/forwardleftright-arrow.png') },
    { id: '27', src: require('../../assets/presets/roads/forwardright-arrow.png') },
    { id: '28', src: require('../../assets/presets/roads/forwardleft-arrow.png') },
    { id: '29', src: require('../../assets/presets/roads/leftright-arrow.png') },
    { id: '30', src: require('../../assets/presets/roads/curve-left.png') },
    { id: '31', src: require('../../assets/presets/roads/curve-right.png') },
    { id: '32', src: require('../../assets/presets/roads/center_divider.png') },
    { id: '33', src: require('../../assets/presets/roads/sliproad-left.png') },
    { id: '34', src: require('../../assets/presets/roads/sliproad-right.png') },
    { id: '35', src: require('../../assets/presets/roads/roadLanes2.png') },
    { id: '36', src: require('../../assets/presets/roads/roadLanes3.png') },
    { id: '37', src: require('../../assets/presets/roads/roadLanes4.png') },
    { id: '38', src: require('../../assets/presets/roads/roadLanes5.png') },
    { id: '39', src: require('../../assets/presets/roads/roadLanes6.png') },
];

const bodyImages = [
    { id: '1', src: require('../../assets/presets/body/blood-1.png') },
    { id: '2', src: require('../../assets/presets/body/female.png') },
    { id: '3', src: require('../../assets/presets/body/male.png') },
    { id: '4', src: require('../../assets/presets/body/female_sideview.png') },
    { id: '5', src: require('../../assets/presets/body/male_sideview.png') },
    { id: '6', src: require('../../assets/presets/body/leftarm.png') },
    { id: '7', src: require('../../assets/presets/body/rightarm.png') },
    { id: '8', src: require('../../assets/presets/body/leftleg.png') },
    { id: '9', src: require('../../assets/presets/body/rightleg.png') },
    { id: '10', src: require('../../assets/presets/body/leftfoot.png') },
    { id: '11', src: require('../../assets/presets/body/rightfoot.png') },
    { id: '12', src: require('../../assets/presets/body/footprint.png') },
    { id: '13', src: require('../../assets/presets/body/blood-1.png') },
    { id: '14', src: require('../../assets/presets/body/blood-2.png') },
    { id: '15', src: require('../../assets/presets/body/blood-3.png') },
    { id: '16', src: require('../../assets/presets/body/blood-4.png') },
    { id: '17', src: require('../../assets/presets/body/blood-5.png') },
    { id: '18', src: require('../../assets/presets/body/debris.png') },
]

const trafficSignImages = [
    { id: '1', src: require('../../assets/presets/traffic_sign/arrow-down-leftright.png') },
    { id: '2', src: require('../../assets/presets/traffic_sign/arrow-left.png') },
    { id: '3', src: require('../../assets/presets/traffic_sign/arrow-leftcurve.png') },
    { id: '4', src: require('../../assets/presets/traffic_sign/arrow-leftdown.png') },
    { id: '5', src: require('../../assets/presets/traffic_sign/arrow-right.png') },
    { id: '6', src: require('../../assets/presets/traffic_sign/arrow-rightcurve.png') },
    { id: '7', src: require('../../assets/presets/traffic_sign/arrow-rightdown.png') },
    { id: '8', src: require('../../assets/presets/traffic_sign/arrow-up.png') },
    { id: '9', src: require('../../assets/presets/traffic_sign/arrow-left-up.png') },
    { id: '10', src: require('../../assets/presets/traffic_sign/arrow-right-up.png') },
    { id: '11', src: require('../../assets/presets/traffic_sign/arrow-left-right.png') },
    { id: '12', src: require('../../assets/presets/traffic_sign/uturn-lane.png') },
    { id: '13', src: require('../../assets/presets/traffic_sign/arrow-up-rect.png') },
    { id: '14', src: require('../../assets/presets/traffic_sign/crossing.png') },
    { id: '15', src: require('../../assets/presets/traffic_sign/express.png') },
    { id: '16', src: require('../../assets/presets/traffic_sign/no-express.png') },
    { id: '17', src: require('../../assets/presets/traffic_sign/multi-lane.png') },
    { id: '18', src: require('../../assets/presets/traffic_sign/oneway.png') },
    { id: '19', src: require('../../assets/presets/traffic_sign/pedal-lane.png') },
    { id: '20', src: require('../../assets/presets/traffic_sign/plain_rect.png') },
    { id: '21', src: require('../../assets/presets/traffic_sign/plain_sign.png') },
    { id: '22', src: require('../../assets/presets/traffic_sign/red-light-camera.png') },
    { id: '23', src: require('../../assets/presets/traffic_sign/speed-camera.png') },
    { id: '24', src: require('../../assets/presets/traffic_sign/turn-left-red.png') },
    { id: '25', src: require('../../assets/presets/traffic_sign/uturn-lane.png') },
    { id: '26', src: require('../../assets/presets/others/11-2x.png') },
    { id: '27', src: require('../../assets/presets/others/13-x.png') },
    { id: '28', src: require('../../assets/presets/others/14-x.png') },
    { id: '29', src: require('../../assets/presets/others/15-x.png') },
    { id: '30', src: require('../../assets/presets/others/16-x.png') },
    { id: '31', src: require('../../assets/presets/others/17-x.png') },
    { id: '32', src: require('../../assets/presets/others/18-x.png') },
    { id: '33', src: require('../../assets/presets/others/19-x.png') }
];

const prohibitorySignImages = [
    { id: '1', src: require('../../assets/presets/prohibitory_sign/speed-40.png') },
    { id: '2', src: require('../../assets/presets/prohibitory_sign/speed-50.png') },
    { id: '3', src: require('../../assets/presets/prohibitory_sign/speed-60.png') },
    { id: '4', src: require('../../assets/presets/prohibitory_sign/speed-70.png') },
    { id: '5', src: require('../../assets/presets/prohibitory_sign/speed-80.png') },
    { id: '6', src: require('../../assets/presets/prohibitory_sign/speed-90.png') },
    { id: '7', src: require('../../assets/presets/prohibitory_sign/meter-23.png') },
    { id: '8', src: require('../../assets/presets/prohibitory_sign/meter-43.png') },
    { id: '9', src: require('../../assets/presets/prohibitory_sign/meter-45.png') },
    { id: '10', src: require('../../assets/presets/prohibitory_sign/meter-55.png') },
    { id: '11', src: require('../../assets/presets/prohibitory_sign/no_bike.png') },
    { id: '12', src: require('../../assets/presets/prohibitory_sign/no-entry.png') },
    { id: '13', src: require('../../assets/presets/prohibitory_sign/no-entry-per.png') },
    { id: '14', src: require('../../assets/presets/prohibitory_sign/no-left-turn.png') },
    { id: '15', src: require('../../assets/presets/prohibitory_sign/no-parking.png') },
    { id: '16', src: require('../../assets/presets/prohibitory_sign/no-right-turn.png') },
    { id: '17', src: require('../../assets/presets/prohibitory_sign/no-trucks.png') },
    { id: '18', src: require('../../assets/presets/prohibitory_sign/no-u-turn.png') },
    { id: '19', src: require('../../assets/presets/prohibitory_sign/no-overtaking.png') },
    { id: '20', src: require('../../assets/presets/prohibitory_sign/no-overtaking2.png') },
    { id: '21', src: require('../../assets/presets/prohibitory_sign/no-lorries.png') },
    { id: '22', src: require('../../assets/presets/prohibitory_sign/no-cars.png') },
    { id: '23', src: require('../../assets/presets/prohibitory_sign/no-standing.png') },
    { id: '24', src: require('../../assets/presets/prohibitory_sign/parking-one.png') },
    { id: '25', src: require('../../assets/presets/prohibitory_sign/parking-two.png') },
    { id: '26', src: require('../../assets/presets/prohibitory_sign/short-term.png') },
    { id: '27', src: require('../../assets/presets/prohibitory_sign/stop-ahead.png') },
    { id: '28', src: require('../../assets/presets/prohibitory_sign/no-entry-bound.png') },
    { id: '29', src: require('../../assets/presets/prohibitory_sign/no-jaywalking.png') },
    { id: '30', src: require('../../assets/presets/prohibitory_sign/no-bus-park.png') },
    { id: '31', src: require('../../assets/presets/prohibitory_sign/child-ahead.png') },
    { id: '32', src: require('../../assets/presets/prohibitory_sign/reduce-speed.png') },
    { id: '33', src: require('../../assets/presets/prohibitory_sign/give-way.png') },
    { id: '34', src: require('../../assets/presets/prohibitory_sign/plain.png') }
];

const VehicleTab = ({ onSelectImage }) => (
    <View>
        <FlatList
            data={vehicleImages}
            keyExtractor={(item) => item.id}
            numColumns={8}
            renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectImage(item.src)}>
                <Image source={item.src} style={styles.vehicleImage} />
            </TouchableOpacity>
            )}
        />
    </View>
);

const RoadTab = ({ onSelectImage }) => (
    <FlatList
        data={roadImages}
        keyExtractor={(item) => item.id}
        numColumns={8}
        renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelectImage(item.src)}>
            <Image source={item.src} style={styles.vehicleImage} />
        </TouchableOpacity>
        )}
    />
);

const BodyTab = ({ onSelectImage }) => (
    <FlatList
        data={bodyImages}
        keyExtractor={(item) => item.id}
        numColumns={8}
        renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelectImage(item.src)}>
            <Image source={item.src} style={styles.vehicleImage} />
        </TouchableOpacity>
        )}
    />
);

const TrafficSignTab = ({ onSelectImage }) => (
    <FlatList
        data={trafficSignImages}
        keyExtractor={(item) => item.id}
        numColumns={8}
        renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelectImage(item.src)}>
            <Image source={item.src} style={styles.vehicleImage} />
        </TouchableOpacity>
        )}
    />
);

const ProhibotorySignTab = ({ onSelectImage }) => (
    <FlatList
        data={prohibitorySignImages}
        keyExtractor={(item) => item.id}
        numColumns={8}
        renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelectImage(item.src)}>
            <Image source={item.src} style={styles.vehicleImage} />
        </TouchableOpacity>
        )}
    />
);

const Presets = ({ onSelectImage }) => (
    <Tab.Navigator>
        <Tab.Screen name="Vehicle">
            {() => <VehicleTab onSelectImage={onSelectImage} />}
        </Tab.Screen>
        <Tab.Screen name="Roads">
            {() => <RoadTab onSelectImage={onSelectImage} />}
        </Tab.Screen>
        <Tab.Screen name="Body">
            {() => <BodyTab onSelectImage={onSelectImage} />}
        </Tab.Screen>
        <Tab.Screen name="Traffic Sign">
            {() => <TrafficSignTab onSelectImage={onSelectImage} />}
        </Tab.Screen>
        <Tab.Screen name="Prohibotory Sign">
            {() => <ProhibotorySignTab onSelectImage={onSelectImage} />}
        </Tab.Screen>
    </Tab.Navigator>
);

const styles = StyleSheet.create({
    vehicleImage: {
        width: 130,
        height: 130,
        padding: 15,
        resizeMode: 'contain',
        marginRight: 15,
        marginTop: 15,
    },
});

export default Presets;
