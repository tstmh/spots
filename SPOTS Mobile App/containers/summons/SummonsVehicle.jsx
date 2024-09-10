import React, { useState, useEffect, useRef, useContext } from 'react';
import { TouchableOpacity, Image, View, Text, Alert, TextInput, SafeAreaView, ScrollView, FlatList, ToastAndroid } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SummonsContext } from '../../context/summonsContext';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import styles from '../../components/spots-styles-summons';
import stylesOSI from '../../components/spots-styles';
import BlueButton from '../../components/common/BlueButton';
import WhiteButton from '../../components/common/WhiteButton';
import VehicleOffenderDetails from './VehicleOffenderDetails';
import PassengerDetails from './PassengerDetails';
import DatabaseService from '../../utils/DatabaseService';
import { validateRegNo } from '../../utils/Validator';
import { formatIntegerValueNotNull, formatIntegerValue, formatDateToString, formatDateToLocaleString, formatTimeToString, formatTimeStamp, parseStringToDate, parseDateTimeStringToDateTime, toStringOrEmpty } from '../../utils/Formatter';
import Offenders from '../../models/Offenders';
import Offences from '../../models/Offences';
import TIMSOffenceCode from '../../models/TIMSOffenceCode';

const Tab = createMaterialTopTabNavigator();

const SummonsVehicle = React.forwardRef((props, ref) => {
  const [showVehicleComponent, setShowVehicleComponent] = useState(false);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [displayText, setDisplayText] = useState('Vehicle List');
  const [searchInput, setSearchInput] = useState('');

  const { summons } = useContext(SummonsContext);
  const offenderDetailsRef = useRef(null);
  const passengersRef = useRef(null);

  // Expose the validate function
  React.useImperativeHandle(ref, () => ({
    validate: validateAndSave,
  }));

  useEffect(() => {
    console.log('currentRecord:', currentRecord);
  }, [currentRecord]);

  useEffect(() => {
    console.log('filteredRecords:', filteredRecords);
  }, [filteredRecords]);

  useEffect(() => {
    const fetchDriverPassengerOffenders = async () => {
      //get drivers
      const driverOffender = await Offenders.getOffendersBySummonsOffenderType(DatabaseService.db, summons.ID, 2);
      console.log(`SummonsVehicle driverOffender ${driverOffender.length}`, driverOffender);
      
      //get passengers
      const passengerOffender = await Offenders.getOffendersBySummonsOffenderType(DatabaseService.db, summons.ID, 3);
      console.log(`SummonsVehicle passengerOffender ${passengerOffender.length}`, passengerOffender);

      for (const driver of driverOffender) {
        const offenderExists = records.some(existing => existing.id === driver.ID);
        console.log(`offenderExists in records? ${offenderExists}, driver >>`  , driver);
      
        if (!offenderExists) {
            //get vehicle details
            let registrationNo = '';
            let toggleLocalVehCheckBox = false;
            let toggleSpecialPlateCheckBox = false;
            registrationNo = driver.REGISTRATION_NO;
            toggleLocalVehCheckBox = driver.LOCAL_PLATE === 1;
            toggleSpecialPlateCheckBox = driver.SPECIAL_PLATE === 1;

            //get list of sub offences by offender
            const driverOffenceData = await Offences.getSubOffenceByVehicleOffender(DatabaseService.db, summons.ID, driver.ID);
            console.log(`driverOffenceData ${driverOffenceData.length} >> ` , driverOffenceData);
    
            const mappedDriverOffenceData = await getMappedOffenceData(driverOffenceData);
            console.log(`mappedDriverOffenceData ${mappedDriverOffenceData.length} >> ` , mappedDriverOffenceData);

            let mappedOffender = {};
            //get driver 
            mappedOffender = {
              offenderName: driver.NAME,
              selectedOffenderInvolvement: driver.INVOLVEMENT_ID?.toString(),
              selectedIdType: driver.ID_TYPE?.toString(),
              idNo: driver.IDENTIFICATION_NO,
              dateOfBirth: driver.DATE_OF_BIRTH? parseStringToDate(driver.DATE_OF_BIRTH) : null, 
              selectedSex: driver.GENDER_CODE?.toString(),
              selectedCountryType: driver.BIRTH_COUNTRY,
              selectedNationalityType: driver.NATIONALITY,
              contact1: driver.CONTACT_1,
              contact2: driver.CONTACT_2,
              //remarks: driver.REMARKS_IDENTIFICATION,
              
              selectedAddressType: driver.ADDRESS_TYPE?.toString(), 
              toggleSameAddress: driver.SAME_AS_REGISTERED === 1,
              block: driver.BLOCK, 
              street: driver.STREET, 
              floor: driver.FLOOR, 
              unitNo: driver.UNIT_NO, 
              buildingName: driver.BUILDING_NAME, 
              postalCode: driver.POSTAL_CODE, 
              addressRemarks: driver.REMARKS_ADDRESS,
    
              selectedVehicleType: driver.TYPE_CODE?.toString(), 
              selectedOperationType: driver.OPERATION_TYPE?.toString(), 
              toggleLocalVehCheckBox: driver.LOCAL_PLATE === 1,
              toggleSpecialPlateCheckBox: driver.SPECIAL_PLATE === 1,
              selectedPlacedUnderArrest: driver.UNDER_ARREST?.toString(),
              selectedBailGranted: driver.BAIL_GRANTED?.toString(),
              selectedBreathAnalyzer: driver.BREATH_ANALYZER?.toString(),
              toggleFurnishInsuranceCheckBox: driver.FURNISH_INSURANCE === 1 || driver.FURNISH_INSURANCE === '1',
    
              selectedLicenseType: driver.LICENSE_TYPE_CODE?.toString(),
              expiryDate: driver.LICENSE_EXPIRY_DATE? parseStringToDate(driver.LICENSE_EXPIRY_DATE) : null,
              selectedDriverLicense: driver.LICENSE_CLASS_CODE,
              otherLicense: driver.OTHER_LICENCE,
              selectedVehicleCategory: driver.CATEGORY_CODE?.toString(),
              selectedVehicleTransmission: driver.TRANSMISSION_TYPE?.toString(),
              selectedClass3CEligibility: driver.ELIGIBLE_CLASS_3C?.toString(),
              selectedVehicleMake: driver.MAKE_CODE?.toString(),
              selectedVehicleColor: driver.COLOR_CODE?.toString(),
              vehicleColorOthers: driver.COLOR,
              vehicleUnladenWeight: driver.WEIGHT,
              toggleDriverNotOffenderCheckBox: driver.NOT_OFFENDER === 1,

              //speeding
              vehicleSpeedingClocked: driverOffenceData?.[0]?.SPEED_CLOCKED || null,
              vehicleSpeedLimit: driverOffenceData?.[0]?.SPEED_LIMIT || null,
              roadSpeedLimit: driverOffenceData?.[0]?.ROAD_LIMIT || null,
              selectedSpeedLimiterRequired: driverOffenceData?.[0]?.SPEED_LIMITER_REQUIRED?.toString() || null,
              selectedSpeedDevice: driverOffenceData?.[0]?.SPEED_DEVICE_ID?.toString() || null,
              selectedSpeedLimiterInstalled: driverOffenceData?.[0]?.SPEED_LIMITER_INSTALLED?.toString() || null,
              selectedSentForInspection: driverOffenceData?.[0]?.SENT_INSPECTION?.toString() || null,

              offences: mappedDriverOffenceData
          }
          console.log(`mappedOffender >> ` , mappedOffender);

          let passengerList = [];
          for (const passengerRow of passengerOffender) {
            //get list of sub offences by offender
            const passengerOffenceData = await Offences.getSubOffenceByVehicleOffender(DatabaseService.db, summons.ID, passengerRow.ID);
            console.log(`passengerOffenceData ${passengerOffenceData.length} >> ` , passengerOffenceData);

            const mappedOffenceData = await getMappedOffenceData(passengerOffenceData);

            // Map passenger data
            const mappedPassengerData = {
              id: passengerRow.ID,
              name: passengerRow.NAME,
              selectedIdType: toStringOrEmpty(passengerRow.ID_TYPE),
              idNo: passengerRow.IDENTIFICATION_NO?.toString(),
              dateOfBirth: passengerRow.DATE_OF_BIRTH? parseStringToDate(passengerRow.DATE_OF_BIRTH) : null,
              selectedSex: toStringOrEmpty(passengerRow.GENDER_CODE),
              contact1: passengerRow.CONTACT_1,
              contact2: passengerRow.CONTACT_2,
              remarks: passengerRow.REMARKS_IDENTIFICATION,
              injury: passengerRow.REMARKS_DEGREE_INJURY,
              selectedAddressType: toStringOrEmpty(passengerRow.ADDRESS_TYPE),
              toggleSameAddress: passengerRow.SAME_AS_REGISTERED === 1,
              block: passengerRow.BLOCK,
              street: passengerRow.STREET,
              floor: passengerRow.FLOOR,
              unitNo: passengerRow.UNIT_NO,
              buildingName: passengerRow.BUILDING_NAME,
              postalCode: passengerRow.POSTAL_CODE,
              addressRemarks: passengerRow.REMARKS_ADDRESS,
              registrationNo: passengerRow.REGISTRATION_NO,
              selectedInvolvementType: toStringOrEmpty(passengerRow.INVOLVEMENT_ID),
              selectedCountryType: passengerRow.BIRTH_COUNTRY,
              selectedNationalityType: passengerRow.NATIONALITY,

              offences: mappedOffenceData
            };

            console.log('mappedPassengerData', mappedPassengerData);
            passengerList.push(mappedPassengerData);
          }

          let mappedRecord = {
            id: driver.ID,
            registrationNo: registrationNo,
            toggleLocalVehCheckBox: toggleLocalVehCheckBox,
            toggleSpecialPlateCheckBox: toggleSpecialPlateCheckBox,
            offender: mappedOffender,
            passengers: passengerList
          }
          console.log('mappedRecord ', mappedRecord);

          records.push(mappedRecord);
        };
      };
      setFilteredRecords(records);
    };

    const getMappedOffenceData = async (data) => {
      console.log('getMappedOffenceData', data);
      if (!data){
        return [];
      }
      const offencePromises = data.map(async (offence) => ({
        id: offence.ID,
        selectedOffence: await TIMSOffenceCode.getAllTIMSOffenceCodeByCode(DatabaseService.db, offence.OFFENCE_TYPE_ID),
        description: offence.REMARKS,
        createdAt: offence.CREATED_AT,
        offenceDate: parseDateTimeStringToDateTime(offence.OFFENCE_DATE, offence.OFFENCE_TIME),
      }));
    
      const mappedOffenceData = await Promise.all(offencePromises);
    
      return mappedOffenceData;
    };

    fetchDriverPassengerOffenders();
  }, []);
  
  useEffect(() => {
    const newFilteredRecords = records.filter(record =>
        record.registrationNo.toUpperCase().includes(searchInput.toUpperCase())
    );
    console.log("newFilteredRecords " , newFilteredRecords.length);
    setFilteredRecords(newFilteredRecords);
  }, [searchInput]);

  const [currentRecord, setCurrentRecord] = useState({
    id: null,
    registrationNo: '',
    toggleLocalVehCheckBox: false,
    toggleSpecialPlateCheckBox: false,
    offender: {},
    passengers: []
  });

  const resetCurrentRecord = () => {
    setCurrentRecord({
        id: Date.now(),
        registrationNo: '',
        toggleLocalVehCheckBox: false,
        toggleSpecialPlateCheckBox: false,
        offender: {},
        passengers: []
    });
};

  const showForm = () => {
    setShowVehicleComponent(true);
  };

  const hideForm = () => {
    setShowVehicleComponent(false);
    //resetForm();
  };

  const addRecord = () => {
    resetCurrentRecord();
    console.log("currentRecord >> " , currentRecord);
    showForm();
  };

  const editRecord = (record) => {
    setCurrentRecord(record);
    console.log("currentRecord >> " , record);
    showForm();
  };

  const deleteRecord = (item) => {
    console.log("deleteRecord ", item.id);
    const updatedRecords = records.filter(record => record.id !== item.id);
    console.log("updatedRecords size ", updatedRecords.length);
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords);

    // delete all offences related to this offenders by regNo
    //Offences.deleteOffenderOffences(DatabaseService.db, offenderId, summonId);

    Offenders.deleteOffenderByRegNo(DatabaseService.db, summons.ID, item.registrationNo);
  };

  const deleteOffenderAndOffences = (offenderId, summonId) => {
    console.log(`deleteOffenderAndOffences ${offenderId}, ${summonId}`);

    // delete all offences related to this offender
    Offences.deleteOffenderOffences(DatabaseService.db, offenderId, summonId);

    // delete offender
    Offenders.deleteOffenderBySummonId(DatabaseService.db, offenderId, summonId);
  }

  const confirmDelete = (item) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this vehicle?",
      [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", onPress: () => deleteRecord(item), style: "destructive" }
      ],
      { cancelable: true }
    );
  };

  const validateAndSave = () => {
    console.log('validateAndSave showVehicleComponent', showVehicleComponent);
    if (showVehicleComponent){
      //Alert.alert('Validation', 'Please go back to Vehicle List to save this form.');
      return handleBackToList();
    }
    return !showVehicleComponent;
  }
  
  const saveRecord = (offenderData, passengersData) => {
    console.log("saveRecord currentRecord >> ", currentRecord);
    console.log("saveRecord offenderData >> ", offenderData);
    console.log("saveRecord passengersData >> ", passengersData);

    // Update currentRecord with new offenderData and passengersData
    setCurrentRecord(prevRecord => {
      const updatedRecord = {
        ...prevRecord,
        offender: offenderData,
        passengers: passengersData,
      };

      // Check if the updatedRecord exists in the records array
      const recordExists = records.some(record => record.id === updatedRecord.id);

      let updatedRecords;
      if (recordExists) {
        // Update the existing record
        updatedRecords = records.map(record =>
          record.id === updatedRecord.id ? updatedRecord : record
        );
      } else {
        // Add the new record
        updatedRecords = [...records, updatedRecord];
      }

      // Update records and filteredRecords
      setRecords(updatedRecords);
      setFilteredRecords(updatedRecords);

      console.log('new updated records', updatedRecords);

      // Return updatedRecord to update the currentRecord state
      return updatedRecord;
    });

    //save to sqlite
    //save driver
    console.log(`start saving offender ` , offenderData);
    console.log('is driver offender? ', offenderData.toggleDriverNotOffenderCheckBox);
    if (!offenderData.toggleDriverNotOffenderCheckBox){
      const offenderToSave = {

        ID: currentRecord.id,
        SUMMONS_ID: summons.ID,
        REGISTRATION_NO: currentRecord.registrationNo,
        // 1-Pedestrian, 2-Driver, 3-Passenger
        OFFENDER_TYPE_ID: 2,
        NAME: offenderData.offenderName,
        INVOLVEMENT_ID: formatIntegerValueNotNull(offenderData.selectedOffenderInvolvement),
        ID_TYPE: formatIntegerValueNotNull(offenderData.selectedIdType),
        IDENTIFICATION_NO: offenderData.idNo,
        DATE_OF_BIRTH: offenderData.dateOfBirth? formatDateToString(offenderData.dateOfBirth) : null,
        GENDER_CODE: formatIntegerValue(offenderData.selectedSex),
        BIRTH_COUNTRY: offenderData.selectedCountryType,
        NATIONALITY: offenderData.selectedNationalityType,
        CONTACT_1: offenderData.contact1,
        CONTACT_2: offenderData.contact2,
        //REMARKS_IDENTIFICATION: offenderData.
        REMARKS_IDENTIFICATION: null, //TODO
        
        ADDRESS_TYPE: formatIntegerValue(offenderData.selectedAddressType),
        SAME_AS_REGISTERED: (offenderData.toggleSameAddress? 1:0),
        BLOCK: offenderData.block,
        STREET: offenderData.street,
        FLOOR: offenderData.floor,
        UNIT_NO: offenderData.unitNo,
        BUILDING_NAME: offenderData.buildingName,
        POSTAL_CODE: offenderData.postalCode,
        REMARKS_ADDRESS: offenderData.addressRemarks,

        TYPE_CODE: offenderData.selectedVehicleType,
				OPERATION_TYPE: formatIntegerValue(offenderData.selectedOperationType),

        LOCAL_PLATE: (currentRecord.toggleLocalVehCheckBox? 1 : 0),
        SPECIAL_PLATE: (currentRecord.toggleSpecialPlateCheckBox? 1 : 0),
        UNDER_ARREST: formatIntegerValue(offenderData.selectedPlacedUnderArrest),
        BAIL_GRANTED: formatIntegerValue(offenderData.selectedBailGranted),
        BREATH_ANALYZER: formatIntegerValue(offenderData.selectedBreathAnalyzer),
        FURNISH_INSURANCE: (offenderData.toggleFurnishInsuranceCheckBox? 1 : 0),
        LICENSE_TYPE_CODE: formatIntegerValue(offenderData.selectedLicenseType),
        LICENSE_EXPIRY_DATE: offenderData.expiryDate? formatDateToString(offenderData.expiryDate) : null,
        LICENSE_CLASS_CODE: offenderData.selectedDriverLicense,
        OTHER_LICENCE: offenderData.otherLicense,
        CATEGORY_CODE: formatIntegerValue(offenderData.selectedVehicleCategory),
        TRANSMISSION_TYPE: formatIntegerValue(offenderData.selectedVehicleTransmission),
        ELIGIBLE_CLASS_3C: formatIntegerValue(offenderData.selectedClass3CEligibility),
        MAKE_CODE: offenderData.selectedVehicleMake,
        COLOR: (offenderData.selectedVehicleColor == 99 || offenderData.selectedVehicleColor == '99') ? offenderData.vehicleColorOthers : null,
        COLOR_CODE: offenderData.selectedVehicleColor,
        WEIGHT: offenderData.vehicleUnladenWeight,

        NOT_OFFENDER: (offenderData.toggleDriverNotOffenderCheckBox? 1 : 0),
      }

      console.log('offenderToSave' , offenderToSave);
      Offenders.insert(DatabaseService.db, offenderToSave);
      
      // delete all offences related to this offender in sqlite
      //Offences.deleteOffenderOffences(DatabaseService.db, offenderToSave.ID, summons.ID);

      //start saving each offender's offence in sqlite
      console.log(`start saving offenders offences size ${offenderData.offences?.length} `, offenderData.offences);
      offenderData.offences?.forEach(offence => {
        console.log('each driver offence ', offence);
        const offenceToSave = {
          ID: offence.id,
          OFFENDER_ID: offenderToSave.ID, 
          SUMMONS_ID: summons.ID, 
          SPOTS_ID: summons.SPOTS_ID,
          OFFENCE_TYPE_ID: offence.selectedOffence.code,
          OFFENCE_DATE: offence.offenceDate? formatDateToLocaleString(offence.offenceDate) : null, 
          OFFENCE_TIME: offence.offenceDate? formatTimeToString(offence.offenceDate) : null, 
          REMARKS: offence.description,
          CREATED_AT: formatTimeStamp(),
          PARENT_ID: 0, //TODO
          // speeding
          SPEED_CLOCKED: offenderData.vehicleSpeedingClocked,
          SPEED_LIMIT: offenderData.vehicleSpeedLimit,
          ROAD_LIMIT: offenderData.roadSpeedLimit,
          SPEED_LIMITER_REQUIRED: offenderData.selectedSpeedLimiterRequired,
          SPEED_DEVICE_ID: offenderData.selectedSpeedDevice,
          SPEED_LIMITER_INSTALLED: offenderData.selectedSpeedLimiterInstalled,
          SENT_INSPECTION: offenderData.selectedSentForInspection
        }
        console.log('driver offenceToSave' , offenceToSave);
        Offences.insert(DatabaseService.db, offenceToSave);
      });

    } else {
      //save driver not offender checkbox in draft, but dont save offender

      const offenderToSave = {

        ID: currentRecord.id,
        SUMMONS_ID: summons.ID,
        REGISTRATION_NO: currentRecord.registrationNo,
        // 1-Pedestrian, 2-Driver, 3-Passenger
        OFFENDER_TYPE_ID: 2,
        NAME: "",
        INVOLVEMENT_ID: 0,
        ID_TYPE: 0,
        IDENTIFICATION_NO: "",
        DATE_OF_BIRTH: null,
        GENDER_CODE: null,
        BIRTH_COUNTRY: null,
        NATIONALITY: null,
        CONTACT_1: null,
        CONTACT_2: null,
        REMARKS_IDENTIFICATION: null, 
        ADDRESS_TYPE: null,
        SAME_AS_REGISTERED: null,
        BLOCK: null,
        STREET: null,
        FLOOR: null,
        UNIT_NO: null,
        BUILDING_NAME: null,
        POSTAL_CODE: null,
        REMARKS_ADDRESS: null,

        TYPE_CODE: null,
				OPERATION_TYPE: null,

        LOCAL_PLATE: (currentRecord.toggleLocalVehCheckBox? 1 : 0),
        SPECIAL_PLATE: (currentRecord.toggleSpecialPlateCheckBox? 1 : 0),

        UNDER_ARREST: null,
        BAIL_GRANTED: null,
        BREATH_ANALYZER: null,
        FURNISH_INSURANCE: null,
        LICENSE_TYPE_CODE: null,
        LICENSE_EXPIRY_DATE: null,
        LICENSE_CLASS_CODE: null,
        OTHER_LICENCE: null,
        CATEGORY_CODE: null,
        TRANSMISSION_TYPE: null,
        ELIGIBLE_CLASS_3C: null,
        MAKE_CODE: null,
        COLOR: null,
        COLOR_CODE: null,
        WEIGHT: null,

        NOT_OFFENDER: (offenderData.toggleDriverNotOffenderCheckBox? 1 : 0),
      }
      Offenders.insert(DatabaseService.db, offenderToSave);
    }

    console.log(`start saving passengers ${passengersData?.length} ` , passengersData);
    //save passenger
    passengersData.forEach(passenger => {

      console.log('saving passenger', passenger);

      const passengerToSave = {

        TYPE_CODE: offenderData?.selectedVehicleType,
        OPERATION_TYPE: offenderData?.selectedOperationType,
        
        MAKE_CODE: offenderData?.selectedVehicleMake,
        CATEGORY_CODE: formatIntegerValue(offenderData?.selectedVehicleCategory),
        TRANSMISSION_TYPE: formatIntegerValue(offenderData?.selectedVehicleTransmission),
        ELIGIBLE_CLASS_3C: formatIntegerValue(offenderData?.selectedClass3CEligibility),
        COLOR: (offenderData?.selectedVehicleColor == 99 || offenderData?.selectedVehicleColor == '99') ? offenderData?.vehicleColorOthers : null,
        COLOR_CODE: offenderData?.selectedVehicleColor,
        WEIGHT: offenderData?.vehicleUnladenWeight,

        ID: passenger.id,
        SUMMONS_ID: summons.ID,
        REGISTRATION_NO: currentRecord.registrationNo,
        // 1-Pedestrian,2-Driver,3-Passenger
        OFFENDER_TYPE_ID: 3,

        NAME: passenger.name,
        INVOLVEMENT_ID: formatIntegerValueNotNull(passenger.selectedInvolvementType),
        ID_TYPE: formatIntegerValueNotNull(passenger.selectedIdType),  
        IDENTIFICATION_NO: passenger.idNo !== null ? passenger.idNo : "",
        DATE_OF_BIRTH: passenger.dateOfBirth? formatDateToString(passenger.dateOfBirth) : null,
        GENDER_CODE: formatIntegerValue(passenger.selectedSex),

        BIRTH_COUNTRY: passenger.selectedCountryType,
        NATIONALITY: passenger.selectedNationalityType,
        CONTACT_1: passenger.contact1,
        CONTACT_2: passenger.contact2,
        REMARKS_IDENTIFICATION: passenger.remarks,
        ADDRESS_TYPE: formatIntegerValue(passenger.selectedAddressType),
        SAME_AS_REGISTERED: passenger.toggleSameAddress? 1:0,
        BLOCK: passenger.block,
        STREET: passenger.street,
        FLOOR: passenger.floor,
        UNIT_NO: passenger.unitNo,
        BUILDING_NAME: passenger.buildingName,
        POSTAL_CODE: passenger.postalCode,
        REMARKS_ADDRESS: passenger.addressRemarks
      }
      console.log('saving passengerToSave', passengerToSave);
      Offenders.insertPassengerNew(DatabaseService.db, passengerToSave);

      // delete all offences related to this passenger in sqlite
      //Offences.deleteOffenderOffences(DatabaseService.db, passengerToSave.ID, summons.ID);

      //start saving each offender's offence in sqlite
      console.log(`start saving passenger offences size ${passenger.offences?.length} `, passenger.offences);
      passenger.offences?.forEach(offence => {
        console.log('each passenger offence ', offence);
        const offenceToSave = {
          ID: offence.id,
          OFFENDER_ID: passengerToSave.ID, 
          SUMMONS_ID: summons.ID, 
          SPOTS_ID: summons.SPOTS_ID,
          OFFENCE_TYPE_ID: offence.selectedOffence.code,
          OFFENCE_DATE: offence.offenceDate? formatDateToLocaleString(offence.offenceDate) : null, 
          OFFENCE_TIME: offence.offenceDate? formatTimeToString(offence.offenceDate) : null, 
          REMARKS: offence.description,
          CREATED_AT: formatTimeStamp(),
          PARENT_ID: 0, //TODO
        }
        console.log('passenger offenceToSave' , offenceToSave);
        Offences.insert(DatabaseService.db, offenceToSave);
      });
    })
    ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
  };

  const validateForm = () => {
    // Synchronous validation
    if (!currentRecord.registrationNo) {
        Alert.alert('Invalid fields', 'Please enter Vehicle Registration No.');
        return false;
    }

    if (currentRecord.toggleLocalVehCheckBox && !currentRecord.toggleSpecialPlateCheckBox) {
        // Validate registration no
        if (!validateRegNo(currentRecord.registrationNo)) { 
            Alert.alert('Invalid fields', 'Please enter valid Vehicle Registration No.');
            return false;
        }
    }

    const offenderValid = validateOffender();
    const passengerValid = validatePassengers();

    console.log(`validate summons vehicle >> offenderValid: ${offenderValid}, passengerValid ${passengerValid}`);

    if (!offenderValid || !passengerValid) {
        return false;
    }

    // Retrieve data from refs
    let offenderData = {};
    let passengersData = [];

    if (offenderDetailsRef.current) {
        offenderData = offenderDetailsRef.current.getOffenderData();
        console.log('offenderData:', offenderData);
    }

    if (passengersRef.current) {
        passengersData = passengersRef.current.getPassengersData();
        console.log('passengersData:', passengersData);
    }
    
    // Update currentRecord with retrieved data
    setCurrentRecord(prevRecord => ({
      ...prevRecord,
      offender: offenderData,
      passengers: passengersData
    }));

    // Return combined data
    return {
        offender: offenderData,
        passengers: passengersData
    };
  }

  const validateOffender = () => {
    if (offenderDetailsRef.current) {
      const validation = offenderDetailsRef.current.validateForm();
      console.log('offenderDetailsRef valid?', validation);
      
      if (!validation) {
        return false;
      }
    }
    return true;
  };

  const validatePassengers = () => {
    if (passengersRef.current) {
      const validation = passengersRef.current.validateForm();
      console.log('passengersRef valid?', validation);
      
      if (!validation) {
        return false;
      }
    }
    return true;
  };

  const handleSaveDraft = () => {
    const result = validateForm();

    if (result) {
      console.log('Valid form data:', result);
      saveRecord(result.offender, result.passengers); 
    } 
  };

  const handleBackToList = () => {
    const result = validateForm();

    if (result) {
      console.log('Valid form data:', result);
      saveRecord(result.offender, result.passengers); 
      hideForm();
      return true;
    } 
    return false;
  };

  const renderItem = ({ item }) => (
    <View style={styles.PedestrianContainer}>
      <TouchableOpacity
        onPress={() => editRecord(item)}
        style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start' }}>
        <Text style={styles.LabelNormalBold}>{item.registrationNo}</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", alignItems: 'center', alignSelf: 'center' }}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: 'center', marginRight: 20 }}
          onPress={() => confirmDelete(item)}>
          <Text style={[styles.DeleteFont, { marginRight: 5 }]}>Delete</Text>
          <Image style={{ width: 15, height: 17, alignSelf: 'center' }} source={require('../../assets/icon/delete-red.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: 'center' }}
          onPress={() => editRecord(item)}>
          <Text style={[styles.EditFont, { marginRight: 5 }, { alignSelf: 'center' }]}>Edit</Text>
          <Image style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../../assets/icon/edit.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.ContainerWhiteBGSummons}>
      {!showVehicleComponent && (
        <SafeAreaView style={styles.SummonsTextContainer}>
          <View style={styles.SummonsListComponentFrame}>
          <View style={styles.MarginContainerSmall} />
            <View style={styles.VehicleInvolvedTitle}>
                <Text style={styles.VehicleInvolvedTitleFontStyle}>Vehicle List</Text>
            </View>
            <View style={styles.MarginContainerSmall} />
            <View style={styles.RoundedDateInput}>
                <TextInput
                    style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 12 }}
                    placeholder="Search Vehicle"
                    value={searchInput}
                    onChangeText={setSearchInput}
                />
                <TouchableOpacity>
                    <Image
                        source={require('../../assets/icon/search.png')}
                        style={{ width: 28, height: 28 }}
                    />
                </TouchableOpacity>
            </View>
            <FlatList
              style={[styles.ListContainer, { flex: 1, marginBottom: 10 }]}
              data={filteredRecords}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              ListEmptyComponent={() => (
                <View style={styles.NoItemsContainer}>
                  <Text style={styles.NoItemsFont}>No items found.</Text>
                  <Text style={styles.NoItemsRegularFont}> Tap the button below to add vehicle. </Text>
                </View>
              )}
            />
            <View style={[styles.ListContainer, { flex: 1 }]}>
              <BlueButton title="ADD VEHICLE OFFENCE" customClick={addRecord} />
              <View style={styles.MarginContainer} />
              <BackToHomeButton />
            </View>
            <View style={styles.MarginContainerXLarge} />
          </View>
        </SafeAreaView>
      )}
      {showVehicleComponent && (
        <SafeAreaView style={styles.SummonsTextContainer}>
          <Text style={styles.PageTitle}>{displayText}</Text>
          <View style={styles.TextInputContainerSummonsVehicle}>
            <Text>
              <Text style={styles.Label}> Vehicle Registration No. </Text>
              <Text style={styles.LabelImpt}> (*)</Text>
            </Text>
            <TextInput
              style={stylesOSI.RoundedTextInputFont}
              autoCapitalize='characters'
              maxLength={66}
              value={currentRecord.registrationNo}
              onChangeText={ (text) => 
                setCurrentRecord((prevRecord) => ({
                  ...prevRecord, 
                  registrationNo: text,
                }))
              }
            />
          </View>
          <View style={styles.FlexRowCenterRow}>
            <CheckBox
              tintColors={{ true: 'rgba(9,62,160,1)', false: 'rgba(9,62,160,1)' }}
              value={currentRecord.toggleLocalVehCheckBox}
              onValueChange={(value) => {
                setCurrentRecord((prevRecord) => ({
                  ...prevRecord,
                  toggleLocalVehCheckBox: value,
                  toggleSpecialPlateCheckBox: value ? prevRecord.toggleSpecialPlateCheckBox : false,
                }));
              }}
            />
            <Text style={[styles.LabelNormal, { alignItems: 'center' }]}>Local Vehicle (Uncheck if Other Vehicle) </Text>
            <CheckBox
              style={{ marginLeft: 8 }}
              tintColors={{ true: 'rgba(9,62,160,1)', false: 'rgba(9,62,160,1)' }}
              disabled={!currentRecord.toggleLocalVehCheckBox} // Disable Special Plate Vehicle checkbox if Local Vehicle is unchecked
              value={currentRecord.toggleSpecialPlateCheckBox}
              onValueChange={(value) => {
                setCurrentRecord((prevRecord) => ({
                  ...prevRecord,
                  toggleSpecialPlateCheckBox: value,
                }));
              }}
            />
            <Text style={[styles.LabelNormal, { alignItems: 'center' }]}>Special/Foreign/Partial Plate Vehicle Number </Text>
          </View>

          <View>
            <View style={{ marginTop: 10, marginBottom: 10 }}>
              <Tab.Navigator
                screenOptions={{
                  labelStyle: { fontSize: 11 },
                  swipeEnabled: false
                }}
              >
                <Tab.Screen name='Offender Details'>
                  {() => (
                    <VehicleOffenderDetails
                      ref={offenderDetailsRef}
                      offender={currentRecord.offender}
                    />
                  )}
                </Tab.Screen>
                <Tab.Screen name='Passenger/s'>
                  {() => (
                    <PassengerDetails
                      ref={passengersRef}
                      initialPassengers={currentRecord.passengers}
                    />
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            </View>
            <View style={styles.TextInputContainer}>
              <View style={styles.MarginContainerXSmall} />
              <WhiteButton title="SAVE AS DRAFT" customClick={handleSaveDraft} />
              <View style={styles.MarginContainerXSmall} />
              <BlueButton title="BACK TO LIST" customClick={handleBackToList} />
            </View>
          </View>
        </SafeAreaView>
      )}
      <View style={styles.MarginContainerXLarge} />
    </ScrollView>
  );
});

export default SummonsVehicle;