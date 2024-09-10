import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import TIMSVehicleType from '../../models/TIMSVehicleType';
import TIMSVehicleColor from '../../models/TIMSVehicleColor';
import TIMSVehicleMake from '../../models/TIMSVehicleMake';
import SystemCode from '../../models/SystemCode';
import { Dropdown } from 'react-native-element-dropdown';
import stylesOSI from '../../components/spots-styles';

const VehicleInformation = ({
  styles,
  toggleSection,
  expandedSection,

  //Operation Type props
  selectedOperationType,
  setSelectedOperationType,

  //Vehicle Type props
  selectedVehicleType,
  setSelectedVehicleType,

  //Vehicle Category props
  selectedVehicleCategory,
  setSelectedVehicleCategory,

  //Vehicle Transmission props
  selectedVehicleTransmission,
  setSelectedVehicleTransmission,

  //Class 3C Eligibility props
  selectedClass3CEligibility,
  setSelectedClass3CEligibility,

  //Vehicle Make props
  selectedVehicleMake,
  setSelectedVehicleMake,

  //Vehicle Color props
  selectedVehicleColor,
  setSelectedVehicleColor,

  //Vehicle Color Others props
  vehicleColorOthers,
  setVehicleColorOthers,

  //Vehicle Unladen Weight props
  vehicleUnladenWeight,
  setVehicleUnladenWeight,

  otherLicense,
  setOtherLicense
}) => {
  // Fetch ddl options from SQLite database
  useEffect(() => {
    if (vehicle) {
      setOperationTypeList(SystemCode.operationType);
      setVehicleTypeList(TIMSVehicleType.timsVehicleType);
      setVehicleCategoryList(SystemCode.vehicleCategory);
      setVehicleTransmissionList(SystemCode.vehicleTransmission);
      setClass3CEligibilityList(SystemCode.yesNo);
      setVehicleMakeList(TIMSVehicleMake.timsVehicleMake);
      setVehicleColorList(TIMSVehicleColor.timsVehicleColor);
    }
  }, [vehicle]);

  const [vehicle, setVehicle] = useState([]);

  //drop down vehicle type
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  //drop down vehicle category
  const [vehicleCategoryList, setVehicleCategoryList] = useState([]);
  //drop down vehicle transmission
  const [vehicleTransmissionList, setVehicleTransmissionList] = useState([]);
  //drop down operation type
  const [operationTypeList, setOperationTypeList] = useState([]);
  //drop down Class 3C Eligibility
  const [class3CEligiblityList, setClass3CEligibilityList] = useState([]);
  //drop down vehicle make
  const [vehicleMakeList, setVehicleMakeList] = useState([]);
  //drop down vehicle color
  const [vehicleColorList, setVehicleColorList] = useState([]);

  return (

    <View style={styles.AccordionFrame}>
      <TouchableOpacity
        style={styles.PedestrianContainerLessPad}
        onPress={() => toggleSection(3)}>
        <Text style={styles.SubAccordionHeader}>{' '}Vehicle Information {'  '} </Text>
        <View style={{ marginRight: 13 }}>
          {expandedSection === 3 ? (
            <Image source={require('../../assets/icon/arrow-up.png')} />
          ) : (
            <Image source={require('../../assets/icon/arrow-down.png')} />
          )}
        </View>
      </TouchableOpacity>
      {expandedSection === 3 && (
        <View style={styles.AccordionFrame}>
          <View style={styles.FrameRow}>
            <View style={styles.HalfFrameContainer}>
              <Text>
                <Text style={styles.Label}>Operation Type</Text>
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
                data={operationTypeList}
                value={selectedOperationType}
                onChange={item => {
                  setSelectedOperationType(item.value);
                }}
              />
            </View>
            <View style={styles.HalfFrameContainer}>
              <Text>
                <Text style={styles.Label}>Vehicle Type </Text>
                <Text style={styles.LabelImpt}>(*)</Text>
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
              <Text style={styles.Label}>Vehicle Make </Text>
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
              <Text style={styles.Label}>Vehicle Category </Text>
              <Dropdown
                style={styles.DropdownRoundedTextInputFont}
                placeholderStyle={styles.Placeholder}
                selectedTextStyle={styles.Placeholder}
                itemTextStyle={styles.Placeholder}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                searchPlaceholder="Search..."
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
              <Text style={styles.Label}>Vehicle Color </Text>
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
                <Text style={styles.Label}>Vehicle Color (For Others) </Text>
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
              <Text style={styles.Label}>Vehicle Transmission Type </Text>
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
              <Text style={styles.Label}>Eligible for Class 3C </Text>
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
              <Text style={styles.Label}>Vehicle Unladen Weight</Text>
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
