import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, SafeAreaView, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import { RadioButton } from 'react-native-paper';
import styles from '../../components/spots-styles'
import Address from '../common/Address'
import SystemCode from '../../models/SystemCode';
import VehicleOffenderIdentity from '../common/VehicleOffenderIdentity';
import VehicleInformation from './VehicleInformation';
import VehicleSpeedingDetails from './VehicleSpeedingDetails';
import OffenceModal from '../common/OffenceDetailsModal';
import { validateDateIsFutureDate, validateIdNo } from '../../utils/Validator';

const VehicleOffenderDetails = forwardRef(({ offender }, ref) => {
  console.log('VehicleOffenderDetails offender', offender);

  const navigation = useNavigation();
  const [expandedSection, setExpandedSection] = useState(null);
  const toggleSection = (sectionNumber) => {
    setExpandedSection( sectionNumber === expandedSection ? null : sectionNumber );
  };

  const [offences, setOffences] = useState(offender.offences? offender.offences : []);
  const [selectedOffence, setSelectedOffence] = useState(null);

  const handlePlacedUnderArrestRadioButtonChange = (value) => { setSelectedPlacedUnderArrest(value); };
  const handleBailGrantedRadioButtonChange = (value) => { setSelectedBailGranted(value); };
  const handleBreathAnalyzerRadioButtonChange = (value) => { setSelectedBreathAnalyzer(value); };

  const [selectedPlacedUnderArrest, setSelectedPlacedUnderArrest] = useState(null);
  const [selectedBailGranted, setSelectedBailGranted] = useState(null);
  const [selectedBreathAnalyzer, setSelectedBreathAnalyzer] = useState(null);
  const [selectedOffenderInvolvement, setSelectedOffenderInvolvement] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState(null);
  const [selectedVehicleTransmission, setSelectedVehicleTransmission] = useState(null);
  const [selectedOperationType, setSelectedOperationType] = useState(null);
  const [selectedClass3CEligibility, setSelectedClass3CEligibility] = useState(null);
  const [selectedVehicleMake, setSelectedVehicleMake] = useState(null);
  const [selectedVehicleColor, setSelectedVehicleColor] = useState(null);
  const [selectedIdType, setSelectedIdType] = useState(null);
  const [selectedLicenseType, setSelectedLicenseType] = useState(null);
  const [selectedAddressType, setSelectedAddressType] = useState(null);
  const [selectedSpeedDevice, setSelectedSpeedDevice] = useState(null);
  const [selectedCountryType, setSelectedCountryType] = useState(null);
  const [selectedNationalityType, setSelectedNationalityType] = useState(null);

  const [toggleSameAddress, setToggleSameAddress] = useState(false);
  const [toggleDriverNotOffenderCheckBox, setToggleDriverNotOffenderCheckBox] = useState(false);
  const [toggleFurnishInsuranceCheckBox, setToggleFurnishInsuranceCheckBox] = useState(false);

  const [expiryDate, setExpiryDate] = useState(null);
  const [openExpiryDate, setOpenExpiryDate] = useState(false);
  const handleOpenExpiryDate = () => { setOpenExpiryDate(true); };
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [openDateOfBirth, setOpenDateOfBirth] = useState(false);
  const handleOpenDateOfBirth = (date) => { setOpenDateOfBirth(true); };

  const [age, setAge] = useState("");
  const [selectedSex, setSelectedSex] = useState(null);
  const handleSexRadioButtonChange = (value) => { setSelectedSex(value); };
  const [selectedSpeedLimiterRequired, setSelectedSpeedLimiterRequired] = useState(null);
  const handleSpeedLimiterRequiredRadioButtonChange = (value) => { setSelectedSpeedLimiterRequired(value); };
  const [selectedSpeedLimiterInstalled, setSelectedSpeedLimiterInstalled] = useState(null);
  const handleSpeedLimiterInstalledRadioButtonChange = (value) => { setSelectedSpeedLimiterInstalled(value); };
  const [selectedSentForInspection, setSelectedSentForInspection] = useState(null);
  const handleSentForInspectionRadioButtonChange = (value) => { setSelectedSentForInspection(value); };
  const [selectedDriverLicense, setSelectedDriverLicense] = useState([]);
  const handleDriverLicenseChange = (value) => {
    setSelectedDriverLicense((prevSelected) =>
        prevSelected.includes(value)
            ? prevSelected.filter((item) => item !== value)
            : [...prevSelected, value]
    );
  };

  const [offenderName, setOffenderName] = useState("");
  const [idNo, setIdNo] = useState("");
  const [block, setBlock] = useState("");
  const [street, setStreet] = useState("");
  const [floor, setFloor] = useState("");
  const [unitNo, setUnitNo] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressRemarks, setAddressRemarks] = useState("");
  const [vehicleUnladenWeight, setVehicleUnladenWeight] = useState("");
  const [vehicleSpeedingClocked, setVehicleSpeedingClocked] = useState("");
  const [vehicleSpeedLimit, setVehicleSpeedLimit] = useState("");
  const [roadSpeedLimit, setRoadSpeedLimit] = useState("");
  const [vehicleColorOthers, setVehicleColorOthers] = useState("");
  const [contact1, setContact1] = useState("");
  const [contact2, setContact2] = useState("");
  const [otherLicense, setOtherLicense] = useState("");

  const [placedUnderArrestList, setPlacedUnderArrestList] = useState([]);
  const [bailGrantedList, setBailGrantedList] = useState([]);
  const [breathAnalyzerList, setBreathAnalyzerList] = useState([]);
  
  const [showOffenceModal, setShowOffenceModal] = useState(false);

  useImperativeHandle(ref, () => ({
    validateForm() {
        return validateForm();
    },
    getOffenderData: () => ({
      offenderName,
      idNo,
      block,
      street,
      floor,
      unitNo,
      buildingName,
      postalCode,
      addressRemarks,
      contact1,
      contact2,
      expiryDate,
      dateOfBirth,
      vehicleUnladenWeight,
      vehicleSpeedingClocked,
      vehicleSpeedLimit,
      vehicleColorOthers,
      otherLicense,
      roadSpeedLimit,
      toggleSameAddress,
      toggleDriverNotOffenderCheckBox,
      toggleFurnishInsuranceCheckBox,
      selectedCountryType,
      selectedNationalityType,
      selectedPlacedUnderArrest,
      selectedBailGranted,
      selectedBreathAnalyzer,
      selectedOffenderInvolvement,
      selectedVehicleType,
      selectedVehicleCategory,
      selectedVehicleTransmission,
      selectedOperationType,
      selectedClass3CEligibility,
      selectedVehicleMake,
      selectedVehicleColor,
      selectedIdType,
      selectedLicenseType,
      selectedAddressType,
      selectedSpeedDevice,
      selectedSex,
      selectedSpeedLimiterRequired,
      selectedSpeedLimiterInstalled,
      selectedSentForInspection,
      selectedDriverLicense,
      offences
    })
  }));

  const handleCheckboxChange = (value) => {
    setToggleDriverNotOffenderCheckBox(value);
    if (value) {
        navigation.navigate('Passenger/s');
    }
  };

  useEffect(() => {
    setPlacedUnderArrestList(SystemCode.yesNo);
    setBailGrantedList(SystemCode.yesNoUnknown2);
    setBreathAnalyzerList(SystemCode.yesNoUnknown3);
  }, []);

  useEffect(() => {
    if (offender) {
      setOffenderName(offender.offenderName || "");
      setIdNo(offender.idNo || "");
      setBlock(offender.block || "");
      setStreet(offender.street || "");
      setFloor(offender.floor || "");
      setUnitNo(offender.unitNo || "");
      setBuildingName(offender.buildingName || "");
      setPostalCode(offender.postalCode || "");
      setAddressRemarks(offender.addressRemarks || "");
      setContact1(offender.contact1 || "");
      setContact2(offender.contact2 || "");
      setVehicleUnladenWeight(offender.vehicleUnladenWeight || "");
      setVehicleSpeedingClocked(offender.vehicleSpeedingClocked || "");
      setVehicleSpeedLimit(offender.vehicleSpeedLimit || "");
      setRoadSpeedLimit(offender.roadSpeedLimit || "");
      setVehicleColorOthers(offender.vehicleColorOthers || "");
      setOtherLicense(offender.otherLicense || "");
      setExpiryDate(offender.expiryDate || "");
      setDateOfBirth(offender.dateOfBirth || "");
      
      setSelectedCountryType(offender.selectedCountryType || null);
      setSelectedNationalityType(offender.selectedNationalityType || null);
      setSelectedPlacedUnderArrest(offender.selectedPlacedUnderArrest || null)
      setSelectedBailGranted(offender.selectedBailGranted || null)
      setSelectedBreathAnalyzer(offender.selectedBreathAnalyzer || null)
      setSelectedOffenderInvolvement(offender.selectedOffenderInvolvement || null)
      setSelectedIdType(offender.selectedIdType || null);
      setSelectedLicenseType(offender.selectedLicenseType || null);
      setSelectedDriverLicense(offender.selectedDriverLicense || []);
      setSelectedAddressType(offender.selectedAddressType || null);
      setSelectedSex(offender.selectedSex || null);
      setSelectedVehicleType(offender.selectedVehicleType || null);
      setSelectedVehicleCategory(offender.selectedVehicleCategory || null);
      setSelectedVehicleTransmission(offender.selectedVehicleTransmission || null);
      setSelectedOperationType(offender.selectedOperationType || null);
      setSelectedClass3CEligibility(offender.selectedClass3CEligibility || null);
      setSelectedVehicleMake(offender.selectedVehicleMake || null);
      setSelectedVehicleColor(offender.selectedVehicleColor || null);
      setSelectedVehicleMake(offender.selectedVehicleMake || null);
      setSelectedSpeedDevice(offender.selectedSpeedDevice || null);
      setSelectedVehicleMake(offender.selectedVehicleMake || null);
      setSelectedSpeedLimiterRequired(offender.selectedSpeedLimiterRequired || null);
      setSelectedSpeedLimiterInstalled(offender.selectedSpeedLimiterInstalled || null);
      setSelectedSentForInspection(offender.selectedSentForInspection || null);

      setToggleSameAddress(offender.toggleSameAddress || false);
      setToggleFurnishInsuranceCheckBox(offender.toggleFurnishInsuranceCheckBox || false);
      setToggleDriverNotOffenderCheckBox(offender.toggleDriverNotOffenderCheckBox || false);
    }
  }, [offender]);

  const validateForm = () => {
    if (toggleDriverNotOffenderCheckBox){
      return true;
    }

    // if (!offenderName) {
    //   Alert.alert('Validation Error', `Please enter Offender Name.`);
    //   return false;
    // }

    if (!selectedIdType) {
      Alert.alert('Validation Error', `Please select ID Type.`);
      return false;
    }

    if (!idNo){
      Alert.alert('Validation Error', `Please enter ID Number.`);
      return false;
    }
    
    if (!validateIdNo(selectedIdType, idNo)) {
      Alert.alert('Validation Error', `Invalid ID Number.`);
      return false;
    }

    if (!selectedOffenderInvolvement) {
      Alert.alert('Validation Error', `Please select Offender Involvement.`);
      return false;
    }

    if (!selectedLicenseType){
      Alert.alert('Validation Error', `Please select License Type.`);
      return false;
    }

    if ( selectedIdType === 4 || selectedIdType === '4' ){
      if (!selectedCountryType){
          Alert.alert('Validation Error', `Please select Birth Country.`);
          return false;
      }
      if (!selectedNationalityType){
          Alert.alert('Validation Error', `Please select Nationality.`);
          return false;
      }
    }

    if (dateOfBirth){
      if (validateDateIsFutureDate(dateOfBirth)){
          Alert.alert('Validation Error', `Date of Birth cannot be future date.`);
          return false;
      }
    }

    if (!toggleSameAddress) {
      if (!selectedAddressType){
          Alert.alert('Validation Error', `Please select Address Type.`);
          return false;
      }
      if (!block){
          Alert.alert('Validation Error', `Please enter Block/House No.`);
          return false;
      }
      if (!street){
          Alert.alert('Validation Error', `Please enter Street.`);
          return false;
      }
      if (!floor){
          Alert.alert('Validation Error', `Please enter Floor.`);
          return false;
      }
      if (!unitNo){
          Alert.alert('Validation Error', `Please enter Unit No.`);
          return false;
      }
      if (!postalCode){
          Alert.alert('Validation Error', `Please enter Postal Code.`);
          return false;
      }
    }

    if (!selectedOperationType){
      Alert.alert('Validation Error', `Please select Operation Type.`);
      return false;
    }

    if (!selectedVehicleType){
      Alert.alert('Validation Error', `Please select Vehicle Type.`);
      return false;
    }

    //validate offences, date/time selected??
    console.log('validateForm offences' , offences);
    for (let i = 0; i < offences.length; i++) {
        const element = offences[i];
        console.log('each offence', element);
        if (!element.offenceDate || element.offenceDate == '') {
            console.log('invalid offenceDate');
            Alert.alert('Validation Error', `Please select Offence Date & Time for Offence ${index + 1}.`);
            return false;  
        }
    }

    return true;
  };

  const handleSelectOffence = (offence) => {
    console.log('handleSelectOffence', offence);

    setOffences((prevOffences) => {
      const index = prevOffences.findIndex((item) => item.selectedOffence.code === offence.selectedOffence.code);

      if (index !== -1) {
        // Update existing offence
        const updatedOffences = [...prevOffences];
        updatedOffences[index] = offence;
        return updatedOffences;
      } else {
        // Add new offence
        return [...prevOffences, offence];
      }
    });

    console.log('offences', offences);
  };

  const handleEdit = (item) => {
    console.log('handleEdit', item);
    setSelectedOffence(item);
    setShowOffenceModal(true);
  };

  const handleAdd = () => {
    setSelectedOffence(null);
    setShowOffenceModal(true);
  };

  const renderOffenceModal = () => (
    <OffenceModal
      visible={showOffenceModal}
      onClose={() => setShowOffenceModal(false)}
      onSelectOffence={handleSelectOffence}
      offence={selectedOffence}
      isVehicle={true}
    />
  );

  const renderOffences = ({ item, index }) => (
    <View style={styles.OffenceFrameRow} >
      <TouchableOpacity style={styles.OffenceDescContainer} onPress={() => handleEdit(item)}>
        <Text style={styles.LabelNormal}>{item.selectedOffence.caption}</Text>
      </TouchableOpacity>
      <View style={styles.OffenceActionsContainer}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginRight: 35 }}
          onPress={() => confirmDelete(index)}>
          <Image style={{ width: 17, height: 20, alignSelf: 'center' }} source={require('../../assets/icon/delete-red.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginRight: 10 }}
          onPress={() => handleEdit(item)}>
          <Image style={{ width: 17, height: 17, alignSelf: 'center' }} source={require('../../assets/icon/edit.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleRemoveOffence = (index) => {
    const newOffenceList = offences.filter((_, i) => i !== index);
    setOffences(newOffenceList);
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this offence?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => handleRemoveOffence(id),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.ContainerGreyBG}>
      <SafeAreaView>
        <View style={[styles.ComponentFrame]}>
          <View style={[styles.FlexRowCenterRow, {paddingVertical: 10}]}>
            <CheckBox
              disabled={false}
              value={toggleDriverNotOffenderCheckBox}
              onValueChange={handleCheckboxChange}
              tintColors={{
                true: 'rgba(9,62,160,1)',
                false: 'rgba(9,62,160,1)',
              }}
              style={{ marginLeft: 8 }}
            />
            <Text style={[styles.Label, {paddingLeft: 8, paddingBottom: 7}]}>Tick if Driver is not offender </Text>
          </View>
          <View style={[styles.FlexRowCenterRow, {paddingVertical: 10}]}>
            <CheckBox
              disabled={false}
              value={toggleFurnishInsuranceCheckBox}
              onValueChange={setToggleFurnishInsuranceCheckBox}
              tintColors={{
                true: 'rgba(9,62,160,1)',
                false: 'rgba(9,62,160,1)',
              }}
              style={{ marginLeft: 8 }}
            />
            <Text style={[styles.Label, {paddingLeft: 8, paddingBottom: 7}]}>Notice to furnish insurance certificate (NP144A) </Text>
          </View>
          <View style={styles.FullFrameNoPad}>
            <Text style={[styles.Label, { alignSelf: 'center', width: 250 }]}> Placed Under Arrest? </Text>
            <View style={styles.RadioFrameRowWrap}>
              {placedUnderArrestList.length > 0 ? (
                placedUnderArrestList.map(option => (
                  <View key={option.value} style={styles.RadioButtonContainerFlex}>
                    <RadioButton
                      color="#00163E"
                      value={option.value}
                      status={selectedPlacedUnderArrest === option.value ? 'checked' : 'unchecked'}
                      onPress={() => handlePlacedUnderArrestRadioButtonChange(option.value)}
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
            <Text style={[styles.Label, { alignSelf: 'center', width: 250 }]}> Bail Granted? </Text>
            <View style={styles.RadioFrameRowWrap}>
              {bailGrantedList.length > 0 ? (
                bailGrantedList.map(option => (
                  <View key={option.value} style={styles.RadioButtonContainerFlex}>
                    <RadioButton
                      color="#00163E"
                      value={option.value}
                      status={selectedBailGranted === option.value ? 'checked' : 'unchecked'}
                      onPress={() => handleBailGrantedRadioButtonChange(option.value)}
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
            <Text style={[styles.Label, { alignSelf: 'center', width: 250 }]}> Breath Analyzer Test? </Text>
            <View style={styles.RadioFrameRowWrap}>
              {breathAnalyzerList.length > 0 ? (
                breathAnalyzerList.map(option => (
                  <View key={option.value} style={styles.RadioButtonContainerFlex}>
                    <RadioButton
                      color="#00163E"
                      value={option.value}
                      status={selectedBreathAnalyzer === option.value ? 'checked' : 'unchecked'}
                      onPress={() => handleBreathAnalyzerRadioButtonChange(option.value)}
                    />
                    <Text style={styles.RadioButtonText}>{option.label}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.LabelNormal}>No options available</Text>
              )}
            </View>
          </View>
          
          <VehicleOffenderIdentity
            styles={styles}
            toggleSection={toggleSection}
            expandedSection={expandedSection}
            offenderName={offenderName}
            setOffenderName={setOffenderName}
            idNo={idNo}
            setIdNo={setIdNo}
            selectedIdType={selectedIdType}
            setSelectedIdType={setSelectedIdType}
            selectedOffenderInvolvement={selectedOffenderInvolvement}
            setSelectedOffenderInvolvement={setSelectedOffenderInvolvement}
            selectedLicenseType={selectedLicenseType}
            setSelectedLicenseType={setSelectedLicenseType}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            handleOpenExpiryDate={handleOpenExpiryDate}
            setOpenExpiryDate={setOpenExpiryDate}
            openExpiryDate={openExpiryDate}
            dateOfBirth={dateOfBirth}
            setDateOfBirth={setDateOfBirth}
            handleOpenDateOfBirth={handleOpenDateOfBirth}
            setOpenDateOfBirth={setOpenDateOfBirth}
            openDateOfBirth={openDateOfBirth}
            age={age}
            setAge={setAge}
            selectedSex={selectedSex}
            handleSexRadioButtonChange={handleSexRadioButtonChange}
            selectedDriverLicense={selectedDriverLicense}
            handleDriverLicenseChange={handleDriverLicenseChange}
            selectedCountryType={selectedCountryType}
            setSelectedCountryType={setSelectedCountryType}
            selectedNationalityType={selectedNationalityType}
            setSelectedNationalityType={setSelectedNationalityType}
            contact1={contact1}
            setContact1={setContact1}
            contact2={contact2}
            setContact2={setContact2}
            otherLicense={otherLicense}
            setOtherLicense={setOtherLicense}
          />
          {/* Section 2 */}
          <Address
            styles={styles}
            toggleSection={toggleSection}
            expandedSection={expandedSection}
            block={block}
            setBlock={setBlock}
            street={street}
            setStreet={setStreet}
            floor={floor}
            setFloor={setFloor}
            unitNo={unitNo}
            setUnitNo={setUnitNo}
            buildingName={buildingName}
            setBuildingName={setBuildingName}
            postalCode={postalCode}
            setPostalCode={setPostalCode}
            addressRemarks={addressRemarks}
            setAddressRemarks={setAddressRemarks}
            selectedAddressType={selectedAddressType}
            setSelectedAddressType={setSelectedAddressType}
            toggleSameAddress={toggleSameAddress}
            setToggleSameAddress={setToggleSameAddress}
          />
          {/* Section 3 */}
          <VehicleInformation
            styles={styles}
            toggleSection={toggleSection}
            expandedSection={expandedSection}
            selectedOperationType={selectedOperationType}
            setSelectedOperationType={setSelectedOperationType}
            selectedVehicleType={selectedVehicleType}
            setSelectedVehicleType={setSelectedVehicleType}
            selectedVehicleCategory={selectedVehicleCategory}
            setSelectedVehicleCategory={setSelectedVehicleCategory}
            selectedVehicleTransmission={selectedVehicleTransmission}
            setSelectedVehicleTransmission={setSelectedVehicleTransmission}
            selectedClass3CEligibility={selectedClass3CEligibility}
            setSelectedClass3CEligibility={setSelectedClass3CEligibility}
            selectedVehicleMake={selectedVehicleMake}
            setSelectedVehicleMake={setSelectedVehicleMake}
            selectedVehicleColor={selectedVehicleColor}
            setSelectedVehicleColor={setSelectedVehicleColor}
            vehicleColorOthers={vehicleColorOthers}
            setVehicleColorOthers={setVehicleColorOthers}
            vehicleUnladenWeight={vehicleUnladenWeight}
            setVehicleUnladenWeight={setVehicleUnladenWeight}
          />
          <VehicleSpeedingDetails
            styles={styles}
            toggleSection={toggleSection}
            expandedSection={expandedSection}
            vehicleSpeedingClocked={vehicleSpeedingClocked}
            setVehicleSpeedingClocked={setVehicleSpeedingClocked}
            vehicleSpeedLimit={vehicleSpeedLimit}
            setVehicleSpeedLimit={setVehicleSpeedLimit}
            roadSpeedLimit={roadSpeedLimit}
            setRoadSpeedLimit={setRoadSpeedLimit}
            selectedSpeedDevice={selectedSpeedDevice}
            setSelectedSpeedDevice={setSelectedSpeedDevice}
            selectedSpeedLimiterRequired={selectedSpeedLimiterRequired}
            handleSpeedLimiterRequiredRadioButtonChange={handleSpeedLimiterRequiredRadioButtonChange}
            selectedSpeedLimiterInstalled={selectedSpeedLimiterInstalled}
            handleSpeedLimiterInstalledRadioButtonChange={handleSpeedLimiterInstalledRadioButtonChange}
            selectedSentForInspection={selectedSentForInspection}
            handleSentForInspectionRadioButtonChange={handleSentForInspectionRadioButtonChange}
          />
          <View style={styles.PassengerTitle}>
            <Text style={styles.VehicleInvolvedTitleFontStyle}> Offence List ({offences ? offences.length : 0})</Text>
            <TouchableOpacity style={[styles.MainButtonStyle3, { marginRight: 15 }]} onPress={() => handleAdd()}>
              <Text style={styles.Add}>Add</Text>
              <Image
                source={require('../../assets/icon/add-white.png')}
                style={{ width: 12, height: 12, alignSelf: "center" }}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            style={{ height: '75%' }}
            data={offences}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderOffences}
          />
        </View>
        {renderOffenceModal()}
      </SafeAreaView>
    </View>
  );
});

export default VehicleOffenderDetails;