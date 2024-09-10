import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import SystemCode from '../../models/SystemCode';
import { formatTimeToLocaleString } from '../../utils/Formatter';

const Treatment = ({
    styles,
    toggleSection,
    expandedSection,

    ambulanceNo,
    setAmbulanceNo,

    aoIdentity,
    setAoIdentity,

    others,
    setOthers,

    // Hospital props
    selectedHospital,
    setSelectedHospital,

    // Ambulance Arrival props
    openAmbulanceArrivalTime,
    ambulanceArrivalTime,
    handleOpenAmbulanceArrivalTime,
    setOpenAmbulanceArrivalTime,
    setAmbulanceArrivalTime,

    // Ambulance Departure props
    openAmbulanceDepartureTime, 
    ambulanceDepartureTime,
    handleOpenAmbulanceDepartureTime,
    setOpenAmbulanceDepartureTime,
    setAmbulanceDepartureTime,
}) => {
    
    // Fetch ddl options from SQLite database
    useEffect(() => {
        setHospitalList(SystemCode.hospitalName);
        
    }, []);

    //drop down Hospital 
    const [hospitalList, setHospitalList] = useState([]);

    return (
        <View style={styles.AccordionFrame} >
            <TouchableOpacity style={styles.PedestrianContainerLessPad} onPress={() => toggleSection(3)}>
                <Text style={styles.SubAccordionHeader}> Treatment If Any? {' '} </Text>
                <View style={{marginRight: 13}}>
                    {expandedSection === 3 ? (
                        <Image source={require('../../assets/icon/arrow-up.png')}/>
                    ) : (
                        <Image source={require('../../assets/icon/arrow-down.png')}/>
                    )}
                </View>
            </TouchableOpacity>
            {expandedSection === 3 && (
                <View style={styles.AccordionFrame} >
                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> Ambulance Number </Text>
                        </Text>
                        <TextInput
                            style={styles.RoundedTextInputWhiteFont}
                            value={ambulanceNo}
                            onChangeText={text => setAmbulanceNo(text)}
                            maxLength={20}
                        />
                    </View>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> AO Identity </Text>
                        </Text>
                        <TextInput
                            style={styles.RoundedTextInputWhiteFont}
                            value={aoIdentity}
                            onChangeText={text => setAoIdentity(text)}
                            maxLength={20}
                        />
                    </View>
                </View>

                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> Ambulance Arrival Time </Text>
                        </Text>
                        <Pressable style={styles.RoundedDateInputWhite} onPress={handleOpenAmbulanceArrivalTime}>
                            <TextInput
                                style={styles.DateTextInputWhiteFont}
                                editable={false}
                                value={ambulanceArrivalTime? formatTimeToLocaleString(ambulanceArrivalTime) : ""}
                            />
                            <TouchableOpacity onPress={handleOpenAmbulanceArrivalTime}>
                                <Image
                                    source={require('../../assets/icon/clock.png')}
                                    style={{ width: 20, height: 20 }}
                                />
                            </TouchableOpacity>
                        </Pressable>
                        <DatePicker
                            modal
                            textColor="black"
                            mode="time"
                            open={openAmbulanceArrivalTime}
                            date={ambulanceArrivalTime? new Date(ambulanceArrivalTime) : new Date()}
                            onConfirm={(ambulanceArrivalTime) => {
                                setOpenAmbulanceArrivalTime(false);
                                setAmbulanceArrivalTime(ambulanceArrivalTime);
                            }}
                            onCancel={() => {
                                setOpenAmbulanceArrivalTime(false);
                            }}
                        />
                    </View>
                    <View style={styles.HalfFrameContainer}>
                        <Text style={styles.Label}>Ambulance Departure Time </Text>
                        <Pressable  style={styles.RoundedDateInputWhite} onPress={handleOpenAmbulanceDepartureTime}>
                            <TextInput
                                style={styles.DateTextInputWhiteFont}
                                editable={false}
                                value={ambulanceDepartureTime? formatTimeToLocaleString(ambulanceDepartureTime) : ""}
                            />
                            <TouchableOpacity onPress={handleOpenAmbulanceDepartureTime}>
                                <Image
                                    source={require('../../assets/icon/clock.png')}
                                    style={{ width: 20, height: 20 }}
                                />
                            </TouchableOpacity>
                        </Pressable>
                        <DatePicker
                            modal
                            textColor="black"
                            mode="time"
                            open={openAmbulanceDepartureTime}
                            date={ambulanceDepartureTime? new Date(ambulanceDepartureTime) : new Date()}
                            onConfirm={(ambulanceDepartureTime) => {
                                setOpenAmbulanceDepartureTime(false);
                                setAmbulanceDepartureTime(ambulanceDepartureTime);
                            }}
                            onCancel={() => {
                                setOpenAmbulanceDepartureTime(false);
                            }}
                        />
                    </View>
                </View>

                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> Hospital </Text>
                        </Text>
                        <Dropdown
                            style={styles.DropdownRoundedTextInputFont}
                            placeholderStyle={styles.Placeholder}
                            selectedTextStyle={styles.Placeholder}
                            itemTextStyle={styles.Placeholder}
                            search
                            labelField="label"
                            valueField="value"
                            placeholder="Select item"
                            searchPlaceholder="Search..."
                            data={hospitalList}
                            value={selectedHospital}
                            onChange={item => {
                                setSelectedHospital(item.value);
                            }}
                        />
                    </View>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> Others (Specify) </Text>
                        </Text>
                        <TextInput
                            style={styles.RoundedTextInputWhiteFont}
                            value={others}
                            onChangeText={text => setOthers(text)}
                            maxLength={66}
                        />
                    </View>
                </View>

            </View>
        )}
    </View>
    );
};

const style = StyleSheet.create({
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default Treatment;
