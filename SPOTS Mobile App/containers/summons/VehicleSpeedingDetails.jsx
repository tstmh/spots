import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import SystemCode from '../../models/SystemCode';
import { RadioButton } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import stylesOSI from '../../components/spots-styles';

const VehicleSpeedingDetails = ({
  styles,
  toggleSection,
  expandedSection,

  vehicleSpeedingClocked,
  setVehicleSpeedingClocked,
  vehicleSpeedLimit,
  setVehicleSpeedLimit,
  roadSpeedLimit,
  setRoadSpeedLimit,

  // Speed Device props
  selectedSpeedDevice,
  setSelectedSpeedDevice,

  //speed limiter required props
  selectedSpeedLimiterRequired,
  handleSpeedLimiterRequiredRadioButtonChange,

  //speed limiter installed props
  selectedSpeedLimiterInstalled,
  handleSpeedLimiterInstalledRadioButtonChange,

  //sent for inspection props
  selectedSentForInspection,
  handleSentForInspectionRadioButtonChange,

}) => {

  //Fetch ddl options from SQLite database
  useEffect(() => {
    setSpeedDeviceList(SystemCode.speedDevice);
    setSpeedLimiterRequiredOptions(SystemCode.yesNo);
    setSpeedLimiterInstalledOptions(SystemCode.yesNoUnknown);
    setSentForInspectionOptions(SystemCode.yesNo);
  }, []);

  //drop down Speed Device
  const [speedDeviceList, setSpeedDeviceList] = useState([]);

  //radio button Speed Limiter required
  const [speedLimiterRequiredOptions, setSpeedLimiterRequiredOptions] = useState([]);

  //radio button Speed Limiter installed
  const [speedLimiterInstalledOptions, setSpeedLimiterInstalledOptions] = useState([]);

  //radio button Sent For Inspection
  const [sentForInspectionOptions, setSentForInspectionOptions] = useState([]);

  return (
    <View style={styles.AccordionFrame}>
      <TouchableOpacity
        style={styles.PedestrianContainerLessPad}
        onPress={() => toggleSection(4)}>
        <Text style={styles.SubAccordionHeader}>
          {' '}Vehicle Speeding Details If Any?{' '}
        </Text>
        <View style={{ marginRight: 13 }}>
          {expandedSection === 4 ? (
            <Image source={require('../../assets/icon/arrow-up.png')} />
          ) : (
            <Image source={require('../../assets/icon/arrow-down.png')} />
          )}
        </View>
      </TouchableOpacity>
      {expandedSection === 4 && (
        <View style={styles.AccordionFrame}>
          <View style={styles.FrameRow}>
            <View style={styles.TextInputContainerHalf}>
              <Text>
                <Text style={styles.Label}> Vehicle Speeding Clocked </Text>
              </Text>
              <View style={stylesOSI.TextInputWrapper}>
                <TextInput
                  style={styles.RoundedTextInputWhite}
                  keyboardType='numeric'
                  value={vehicleSpeedingClocked}
                  onChangeText={text => setVehicleSpeedingClocked(text)}
                />
                <Text style={styles.CharCounter}>KM/H</Text>
              </View>
            </View>
            <View style={styles.TextInputContainerHalf}>
              <Text style={styles.Label}>Vehicle Speed Limit </Text>
              <View style={stylesOSI.TextInputWrapper}>
                <TextInput
                  style={styles.RoundedTextInputWhite}
                  keyboardType='numeric'
                  value={vehicleSpeedLimit}
                  onChangeText={text => setVehicleSpeedLimit(text)}
                />
                <Text style={styles.CharCounter}>KM/H</Text>
              </View>
            </View>
          </View>
          <View style={styles.FrameRow}>
            <View style={styles.TextInputContainerHalf}>
              <Text style={styles.Label}> Road Speed Limit </Text>
              <View style={stylesOSI.TextInputWrapper}>
                <TextInput
                  style={styles.RoundedTextInputWhite}
                  keyboardType='numeric'
                  value={roadSpeedLimit}
                  onChangeText={text => setRoadSpeedLimit(text)}
                />
                <Text style={styles.CharCounter}>KM/H</Text>
              </View>
            </View>
            <View style={styles.HalfFrameContainer}>
              <Text style={styles.Label}>Speed Device Used? </Text>
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
                  data={speedDeviceList}
                  value={selectedSpeedDevice}
                  onChange={item => {
                    setSelectedSpeedDevice(item.value);
                  }}
              />
            </View>
          </View>
          <View style={styles.FullFrameNoPad}>
            <Text style={[styles.Label, { alignSelf: 'center' }]}>
              Speed Limiter Required?{'            '}
            </Text>
            <View style={styles.RadioFrameRowWrap}>
              {speedLimiterRequiredOptions.length > 0 ? (
                speedLimiterRequiredOptions.map(option => (
                  <View key={option.value} style={styles.RadioButtonContainerFlex}>
                    <RadioButton
                      color="#00163E"
                      value={option.value}
                      status={selectedSpeedLimiterRequired === option.value ? 'checked' : 'unchecked'}
                      onPress={() => handleSpeedLimiterRequiredRadioButtonChange(option.value)}
                    />
                    <Text style={styles.RadioButtonText}>{option.label}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.LabelNormal}>No options available</Text>
              )}
            </View>
          </View>
          <View style={styles.FullFrameNoPad}>
            <Text style={[styles.Label, { alignSelf: 'center' }]}>
              Vehicle Speed Limiter Installed?{' '}
            </Text>
            <View style={styles.RadioFrameRowWrap}>
              {speedLimiterInstalledOptions.length > 0 ? (
                speedLimiterInstalledOptions.map(option => (
                  <View key={option.value} style={styles.RadioButtonContainerFlex}>
                    <RadioButton
                      color="#00163E"
                      value={option.value}
                      status={selectedSpeedLimiterInstalled === option.value ? 'checked' : 'unchecked'}
                      onPress={() => handleSpeedLimiterInstalledRadioButtonChange(option.value)}
                    />
                    <Text style={styles.RadioButtonText}>{option.label}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.LabelNormal}>No options available</Text>
              )}
            </View>
          </View>
          <View style={styles.FullFrameNoPad}>
            <Text style={[styles.Label, { alignSelf: 'center' }]}>
              Sent For Inspection?{'                  '}
            </Text>
            <View style={styles.RadioFrameRowWrap}>
              {sentForInspectionOptions.length > 0 ? (
                sentForInspectionOptions.map(option => (
                  <View key={option.value} style={styles.RadioButtonContainerFlex}>
                    <RadioButton
                      color="#00163E"
                      value={option.value}
                      status={selectedSentForInspection === option.value ? 'checked' : 'unchecked'}
                      onPress={() => handleSentForInspectionRadioButtonChange(option.value)}
                    />
                    <Text style={styles.RadioButtonText}>{option.label}</Text>

                  </View>
                ))
              ) : (
                <Text style={styles.LabelNormal}>No options available</Text>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default VehicleSpeedingDetails;
