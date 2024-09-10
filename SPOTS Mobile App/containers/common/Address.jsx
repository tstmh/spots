import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import CheckBox from '@react-native-community/checkbox';
import SystemCode from '../../models/SystemCode';
import stylesOSI from '../../components/spots-styles';

const Address = ({
    styles,
    toggleSection,
    expandedSection,

    // Address Type props
    selectedAddressType,
    setSelectedAddressType,

    // Same Address props
    toggleSameAddress,
    setToggleSameAddress,

    block,
    setBlock,
    street,
    setStreet,
    floor,
    setFloor,
    unitNo,
    setUnitNo,
    buildingName,
    setBuildingName,
    postalCode,
    setPostalCode,
    addressRemarks,
    setAddressRemarks,

}) => {

    // Fetch ddl options from SQLite database
    useEffect(() => {
        setAddressTypeList(SystemCode.addressType);
    }, []);

    //drop down Address Type
    const [addressTypeList, setAddressTypeList] = useState([]);

    return (
        <View style={styles.AccordionFrame} >
            <TouchableOpacity style={styles.PedestrianContainerLessPad} onPress={() => toggleSection(2)}>
                <Text style={styles.SubAccordionHeader}> Address Information {' '}</Text>
                <View style={{ marginRight: 13 }}>
                    {expandedSection === 2 ? (
                        <Image source={require('../../assets/icon/arrow-up.png')} />
                    ) : (
                        <Image source={require('../../assets/icon/arrow-down.png')} />
                    )}
                </View>
            </TouchableOpacity>
            {expandedSection === 2 && (
                <View style={styles.AccordionFrame}>

                    <View style={styles.FrameRow}>
                        <CheckBox
                            disabled={false}
                            value={toggleSameAddress}
                            onValueChange={(sameAddress) => setToggleSameAddress(sameAddress)}
                            style={{ marginLeft: 8 }}
                            tintColors={{ true: 'rgba(9,62,160,1)', false: 'rgba(9,62,160,1)' }}
                        />
                        <Text style={[styles.Label, { alignSelf: 'center' }]}>Address is same as registered address </Text>
                    </View>

                    {/* Conditionally render Block/House No. based on toggleSameAddress */}
                    {!toggleSameAddress && (
                        <View>
                            <View style={styles.FrameRow}>
                                <View style={styles.FullFrame}>
                                    <Text>
                                        <Text style={styles.Label}> Address Type</Text>
                                        <Text style={styles.LabelImpt}> (*)</Text>
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
                                        data={addressTypeList}
                                        value={selectedAddressType}
                                        onChange={item => {
                                            setSelectedAddressType(item.value);
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.FrameRow}>
                                <View style={stylesOSI.ThirdFrameContainer}>
                                    <Text>
                                        <Text style={styles.Label}> Block/House No. </Text>
                                        <Text style={styles.LabelImpt}> (*)</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.RoundedTextInputWhiteFont}
                                        value={block}
                                        onChangeText={text => setBlock(text)}
                                        maxLength={10}
                                    />
                                </View>
                                <View style={stylesOSI.ThirdFrameContainer}>
                                    <Text>
                                        <Text style={styles.Label}>Street </Text>
                                        <Text style={styles.LabelImpt}> (*)</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.RoundedTextInputWhiteFont}
                                        value={street}
                                        onChangeText={text => setStreet(text)}
                                        maxLength={32}
                                    />
                                </View>
                                <View style={stylesOSI.ThirdFrameContainer}>
                                    <Text>
                                        <Text style={styles.Label}> Floor </Text>
                                        <Text style={styles.LabelImpt}> (*)</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.RoundedTextInputWhiteFont}
                                        value={floor}
                                        maxLength={3}
                                        onChangeText={text => setFloor(text)}
                                    />
                                </View>
                            </View>

                            <View style={styles.FrameRow}>
                                <View style={stylesOSI.ThirdFrameContainer}>
                                    <Text>
                                        <Text style={styles.Label}> Unit No. </Text>
                                        <Text style={styles.LabelImpt}> (*)</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.RoundedTextInputWhiteFont}
                                        value={unitNo}
                                        maxLength={5}
                                        onChangeText={text => setUnitNo(text)}
                                    />
                                </View>
                                <View style={stylesOSI.ThirdFrameContainer}>
                                    <Text>
                                        <Text style={styles.Label}> Building Name </Text>
                                    </Text>
                                    <TextInput
                                        style={styles.RoundedTextInputWhiteFont}
                                        value={buildingName}
                                        maxLength={66}
                                        onChangeText={text => setBuildingName(text)}
                                    />
                                </View>
                                <View style={stylesOSI.ThirdFrameContainer}>
                                    <Text>
                                        <Text style={styles.Label}> Postal Code </Text>
                                        <Text style={styles.LabelImpt}> (*)</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.RoundedTextInputWhiteFont}
                                        value={postalCode}
                                        onChangeText={text => setPostalCode(text)}
                                        keyboardType='numeric'
                                        maxLength={6}
                                    />
                                </View>
                            </View>

                            <View style={styles.FullFrame}>
                                <Text>
                                    <Text style={styles.Label}> Remarks (2000 Characters)</Text>
                                </Text>
                                <View style={styles.TextInputWrapper}>
                                    <TextInput
                                        style={styles.RoundedLongTextInputMediumWhiteFont}
                                        multiline
                                        editable
                                        textAlignVertical="top"
                                        onChangeText={(text) => setAddressRemarks(text)}
                                        maxLength={2000}
                                        value={addressRemarks}
                                    />
                                    <Text style={styles.CharCounter}>{addressRemarks?.length}/2000</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default Address;
