import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput, Pressable } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import { RadioButton } from 'react-native-paper';
import { formatDateToLocaleString } from '../../utils/Formatter';
import SystemCode from '../../models/SystemCode';
import stylesOSI from '../../components/spots-styles';
import TIMSCountryCode from '../../models/TIMSCountryCode';
import TIMSNationalityCode from '../../models/TIMSNationalityCode';
import TIMSVehicleColor from '../../models/TIMSVehicleColor';
import TIMSVehicleMake from '../../models/TIMSVehicleMake';
import TIMSVehicleType from '../../models/TIMSVehicleType';

const VehicleInformation = ({
    styles,
    toggleSection,
    expandedSection,

    registrationNo,
    setRegistrationNo,
    selectedOperationType,
    setSelectedOperationType,
    selectedVehicleType,
    setSelectedVehicleType,
    selectedVehicleCategory,
    setSelectedVehicleCategory,
    toggleLocalVehCheckBox,
    setToggleLocalVehCheckBox,
    toggleSpecialPlateCheckBox,
    setToggleSpecialPlateCheckBox,
    selectedVehicleTransmission,
    setSelectedVehicleTransmission,
    selectedClass3CEligibility,
    setSelectedClass3CEligibility,
    selectedVehicleMake,
    setSelectedVehicleMake,
    vehicleUnladenWeight,
    setVehicleUnladenWeight,
    selectedVehicleColor,
    setSelectedVehicleColor,
    vehicleColorOthers,
    setVehicleColorOthers,

}) => {

    useEffect(() => {
        setVehicleTypeList(TIMSVehicleType.timsVehicleType);
        setVehicleMakeList(TIMSVehicleMake.timsVehicleMake);
        setVehicleColorList(TIMSVehicleColor.timsVehicleColor); 
        setVehicleCategoryList(SystemCode.vehicleCategory);
        setOperationTypeList(SystemCode.operationType);
        setVehicleTransmissionList(SystemCode.vehicleTransmission);
        setClass3CEligibilityList(SystemCode.yesNo);
    }, []);

    const [vehicleTypeList, setVehicleTypeList] = useState([]);
    const [vehicleCategoryList, setVehicleCategoryList] = useState([]);
    const [vehicleMakeList, setVehicleMakeList] = useState([]);
    const [vehicleColorList, setVehicleColorList] = useState([]);
    const [operationTypeList, setOperationTypeList] = useState([]);
    const [vehicleTransmissionList, setVehicleTransmissionList] = useState([]);
    const [class3CEligiblityList, setClass3CEligibilityList] = useState([]);

    return (
        <View style={styles.AccordionFrame} >
            <TouchableOpacity style={styles.PedestrianContainerLessPad} onPress={() => toggleSection(1)}>
                <Text style={styles.AccordionHeader} > Vehicle Information {' '} </Text>
                <View style={{marginRight: 13}}>
                    {expandedSection === 1 ? (
                        <Image source={require('../../assets/icon/arrow-up.png')}/>
                    ) : (
                        <Image source={require('../../assets/icon/arrow-down.png')}/>
                    )}
                </View>
            </TouchableOpacity>
            {expandedSection === 1 && (
            <View style={styles.AccordionFrame} >
                <View style={styles.FrameRow}>
                    <View style={styles.FullFrame}>
                        <Text>
                            <Text style={stylesOSI.LabelSmall}> Registration No.</Text>
                            <Text style={stylesOSI.LabelImptSmall}> (*)</Text>
                        </Text>
                        <TextInput
                            style={styles.RoundedTextInputWhiteFont}
                            autoCapitalize='characters'
                            value={registrationNo}
                            onChangeText={setRegistrationNo}
                            maxLength={66}
                        />
                    </View>
                </View>
                <View style={styles.FrameRow}>
                    <CheckBox
                        disabled={false}
                        value={toggleLocalVehCheckBox}
                        onValueChange={setToggleLocalVehCheckBox}
                        tintColors={{ true: 'rgba(9,62,160,1)', false: 'rgba(9,62,160,1)' }}
                        style={{marginLeft: 8}}
                    />
                    <Text style={[styles.LabelNormal, {alignItems:'center'}]}>Local Vehicle (Uncheck if Other Vehicle) </Text>
                </View>

                <View style={styles.FrameRow}>
                    <CheckBox
                        disabled={false}
                        value={toggleSpecialPlateCheckBox}
                        onValueChange={setToggleSpecialPlateCheckBox}
                        tintColors={{ true: 'rgba(9,62,160,1)', false: 'rgba(9,62,160,1)' }}
                        style={{marginLeft: 8}}
                    />
                    <Text style={[styles.LabelNormal, {alignItems:'center'}]}>Special/Foreign/Partial Plate Vehicle Number </Text>
                </View>
                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={stylesOSI.LabelSmall}> Operation Type </Text>
                            <Text style={stylesOSI.LabelImptSmall}> (*)</Text>
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
                            data={operationTypeList}
                            value={selectedOperationType}
                            onChange={item => {
                                setSelectedOperationType(item.value);
                            }}
                        />
                    </View>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={stylesOSI.LabelSmall}>Vehicle Type </Text>
                            <Text style={stylesOSI.LabelImptSmall}>(*)</Text>
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
                            data={vehicleTypeList}
                            value={selectedVehicleType}
                            onChange={item => {
                                setSelectedVehicleType(item.value);
                            }}
                        />
                    </View>
                </View>
                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text style={stylesOSI.LabelSmall}>Vehicle Make </Text>
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
                            data={vehicleMakeList}
                            value={selectedVehicleMake}
                            onChange={item => {
                                setSelectedVehicleMake(item.value);
                            }}
                        />
                    </View>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={stylesOSI.LabelSmall}>Vehicle Category </Text>
                        </Text>
                        <Dropdown
                            style={styles.DropdownRoundedTextInputFont}
                            placeholderStyle={styles.Placeholder}
                            selectedTextStyle={styles.Placeholder}
                            itemTextStyle={styles.Placeholder}
                            labelField="label"
                            valueField="value"
                            placeholder="Select item"
                            data={vehicleCategoryList}
                            value={selectedVehicleCategory}
                            onChange={item => {
                                setSelectedVehicleCategory(item.value);
                            }}
                        />
                    </View>
                </View>
                <View style={styles.FrameRow}>
                    <View style={selectedVehicleColor === '99' ? styles.HalfFrameContainer : styles.FullFrame}>
                        <Text style={stylesOSI.LabelSmall}>Vehicle Color </Text>
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
                            data={vehicleColorList}
                            value={selectedVehicleColor}
                            onChange={item => {
                                setSelectedVehicleColor(item.value);
                            }}
                        />
                    </View>
                    {selectedVehicleColor === '99' ? (
                        <View style={styles.HalfFrameContainer}>
                            <Text style={stylesOSI.LabelSmall}>Vehicle Color (For Others) </Text>
                            <TextInput
                                style={styles.RoundedTextInputWhiteFont}
                                value={vehicleColorOthers}
                                editable={selectedVehicleColor === '99'}
                                onChangeText={setVehicleColorOthers}
                                maxLength={20}
                            />
                        </View>
                    ) : null}
                </View>
                <View style={styles.FrameRow}>
                    <View style={stylesOSI.ThirdFrameContainer}>
                        <Text style={stylesOSI.LabelSmall}>Vehicle Transmission Type </Text>
                        <Dropdown
                            style={styles.DropdownRoundedTextInputFont}
                            placeholderStyle={styles.Placeholder}
                            selectedTextStyle={styles.Placeholder}
                            itemTextStyle={styles.Placeholder}
                            labelField="label"
                            valueField="value"
                            placeholder="Select item"
                            data={vehicleTransmissionList}
                            value={selectedVehicleTransmission}
                            onChange={item => {
                                setSelectedVehicleTransmission(item.value);
                            }}
                        />
                    </View>
                    <View style={stylesOSI.ThirdFrameContainer}>
                        <Text style={stylesOSI.LabelSmall}>Eligible for Class 3C </Text>
                        <Dropdown
                            style={styles.DropdownRoundedTextInputFont}
                            placeholderStyle={styles.Placeholder}
                            selectedTextStyle={styles.Placeholder}
                            itemTextStyle={styles.Placeholder}
                            labelField="label"
                            valueField="value"
                            placeholder="Select item"
                            data={class3CEligiblityList}
                            value={selectedClass3CEligibility}
                            onChange={item => {
                                setSelectedClass3CEligibility(item.value);
                            }}
                        />
                    </View>
                    <View style={stylesOSI.ThirdFrameContainer}>
                        <Text style={stylesOSI.LabelSmall}>Vehicle Unladen Weight</Text>
                        <TextInput
                            style={styles.RoundedTextInputWhite}
                            value={vehicleUnladenWeight}
                            onChangeText={setVehicleUnladenWeight}
                            maxLength={7}
                        />
                    </View>
                </View>

                
            </View>
            )}
        </View>
    );
};

export default VehicleInformation;
