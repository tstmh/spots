import React, { useState, useEffect, useContext, forwardRef, useRef } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput, SafeAreaView, FlatList, Alert, Dimensions, ScrollView, ToastAndroid } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BlueButton from '../../components/common/BlueButton';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import VehicleDetails from './VehicleDetails';
import DriverDetails from './DriverDetails';
import PassengerDetails from './PassengerDetails';
import styles from '../../components/spots-styles';
import PartiesInvolved from '../../models/PartiesInvolved';
import { AccidentReportContext } from '../../context/accidentReportContext';
import DatabaseService from '../../utils/DatabaseService';
import { formatIntegerValue, formatIntegerValueNotNull, formatDateToString, formatTimeToString, parseStringToTime, parseStringToDate, toStringOrEmpty } from '../../utils/Formatter';

const Tab = createMaterialTopTabNavigator();

const VehiclesInvolved = forwardRef((props, ref) => {
    const { accidentReport } = useContext(AccidentReportContext);
    const [showVehicleComponent, setShowVehicleComponent] = useState(false);
    const [records, setRecords] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredRecords, setFilteredRecords] = useState(records);

    const vehicleRef = useRef();
    const driverRef = useRef();
    const passengerRef = useRef();

    // Expose the validate function
    React.useImperativeHandle(ref, () => ({
        validate: validateAndSave,
    }));

    const validateAndSave = () => {
        console.log('validateAndSave showVehicleComponent', showVehicleComponent);
        if (showVehicleComponent){
            Alert.alert('Validation', 'Please go back to Vehicle List to save this form.');
            //TODO HERE
        }
        return !showVehicleComponent;
    }

    useEffect(() => {
        const newFilteredRecords = records.filter(record =>
            record.vehicle.registrationNo.toUpperCase().includes(searchInput.toUpperCase())
        );
        console.log("newFilteredRecords " , newFilteredRecords.length);
        setFilteredRecords(newFilteredRecords);
    }, [searchInput]);

    useEffect(() => {
        const fetchVehicleDriverPassengers = async () => {
            try {
                const accidentReportId = accidentReport.ID;
                const data = await PartiesInvolved.getPartiesInvolvedByAccIDPerson(DatabaseService.db, accidentReportId, 2);
                const passengerData = await PartiesInvolved.getPartiesInvolvedByAccIDPerson(DatabaseService.db, accidentReportId, 3);
                
                // console.log("fetchVehicleDriverPassengers data >> " , data);
                // console.log("fetchVehicleDriverPassengers passengerData >> " , passengerData);

                const mappedData = data.map(row => ({
                    id: row.ID,
                    vehicle: {
                        registrationNo: row.REGISTRATION_NO,
                        selectedVehicleType: row.TYPE_CODE,
                        selectedVehicleCategory: row.CATEGORY_CODE,
                        toggleLocalVehCheckBox: row.LOCAL_PLATE === 1,
                        toggleSpecialPlateCheckBox: row.SPECIAL_PLATE === 1,
                        selectedVehicleMake: row.MAKE_CODE,
                        vehicleModel: row.MODEL,
                        selectedVehicleColor: row.COLOR_CODE,
                        vehicleColorOthers: row.COLOR,
                        vehicleOnFire: row.IN_FLAME === 1,
                        remarks: row.REMARKS_VEHICLE,
                        sequence: row.VEHICLE_SEQUENCE,
                    },
                    driver: {
                        driverName: row.NAME,
                        idNo: row.IDENTIFICATION_NO,
                        otherLicense: row.OTHER_LICENCE,
                        breathalyzerNo: row.BREATHALYZER_NO,
                        injuryDriver: row.REMARKS_DEGREE_INJURY,
                        contact1: row.CONTACT_1,
                        contact2: row.CONTACT_2,
                        block: row.BLOCK,
                        street: row.STREET,
                        floor: row.FLOOR,
                        unitNo: row.UNIT_NO,
                        buildingName: row.BUILDING_NAME,
                        postalCode: row.POSTAL_CODE,
                        addressRemarks: row.REMARKS_ADDRESS,
                        ambulanceNo: row.AMBULANCE_NO,
                        aoIdentity: row.AMBULANCE_AO_ID,
                        others: row.HOSPITAL_OTHER,
                        selectedIdType: toStringOrEmpty(row.ID_TYPE),
                        selectedLicenseType: toStringOrEmpty(row.LICENSE_TYPE_CODE),
                        selectedCountryType: row.BIRTH_COUNTRY,
                        selectedNationalityType: row.NATIONALITY,
                        selectedAlcoholicBreath: toStringOrEmpty(row.ALCOHOL_BREATH),
                        selectedBreathalyserResult: toStringOrEmpty(row.BREATHALYZER_RESULT),
                        selectedAddressType: toStringOrEmpty(row.ADDRESS_TYPE),
                        expiryDate: row.LICENSE_EXPIRY_DATE?  parseStringToDate(row.LICENSE_EXPIRY_DATE) : null,
                        toggleSameAddress: row.SAME_AS_REGISTERED === 1,
                        dateOfBirth: row.DATE_OF_BIRTH?  parseStringToDate(row.DATE_OF_BIRTH) : null,
                        selectedSex: toStringOrEmpty(row.GENDER_CODE),
                        selectedDriverLicense: row.LICENSE_CLASS_CODE,
                        selectedHospital: toStringOrEmpty(row.HOSPITAL_ID),
                        ambulanceArrivalTime: row.AMBULANCE_ARRIVAL? parseStringToTime(row.AMBULANCE_ARRIVAL) : null,
                        ambulanceDepartureTime: row.AMBULANCE_DEPARTURE? parseStringToTime(row.AMBULANCE_DEPARTURE) : null,
                    },
                    passengers: [] // Initialize as empty, will populate below
                }));
                console.log("fetchVehicleDriverPassengers mappedData >> " , mappedData);

                // Map passenger data
                const mappedPassengerData = passengerData.map(row => ({
                    id: row.ID,
                    pedestrianName: row.NAME,
                    selectedIdType: toStringOrEmpty(row.ID_TYPE),
                    selectedInvolvementType: toStringOrEmpty(row.INVOLVEMENT_ID),
                    idNo: row.IDENTIFICATION_NO,
                    dateOfBirth: row.DATE_OF_BIRTH? parseStringToDate(row.DATE_OF_BIRTH) : null,
                    selectedSex: toStringOrEmpty(row.GENDER_CODE),
                    contact1: row.CONTACT_1,
                    contact2: row.CONTACT_2,
                    selectedCountryType: row.BIRTH_COUNTRY,
                    selectedNationalityType: row.NATIONALITY,
                    remarks: row.REMARKS_IDENTIFICATION,
                    injury: row.REMARKS_DEGREE_INJURY,
                    selectedAddressType: toStringOrEmpty(row.ADDRESS_TYPE),
                    toggleSameAddress: row.SAME_AS_REGISTERED === 1,
                    block: row.BLOCK,
                    street: row.STREET,
                    floor: row.FLOOR,
                    unitNo: row.UNIT_NO,
                    buildingName: row.BUILDING_NAME,
                    postalCode: row.POSTAL_CODE,
                    addressRemarks: row.REMARKS_ADDRESS,
                    ambulanceNo: row.AMBULANCE_NO,
                    aoIdentity: row.AMBULANCE_AO_ID,
                    ambulanceArrivalTime: row.AMBULANCE_ARRIVAL? parseStringToTime(row.AMBULANCE_ARRIVAL) : null,
                    ambulanceDepartureTime: row.AMBULANCE_DEPARTURE? parseStringToTime(row.AMBULANCE_DEPARTURE) : null,
                    selectedHospital: toStringOrEmpty(row.HOSPITAL_ID),
                    others: row.HOSPITAL_OTHER,
                    vehicleSequence: row.VEHICLE_SEQUENCE,
                    registrationNo: row.REGISTRATION_NO,
                }));
                // console.log("fetchVehicleDriverPassengers mappedPassengerData >> " , mappedPassengerData);

                // Assign passengers to the appropriate vehicle and driver record
                const updatedData = mappedData.map(record => {
                    console.log(`fetchVehicleDriverPassengers record.registrationNo: ${record.vehicle.registrationNo}`);
                    const passengersForRecord = mappedPassengerData.filter(passenger => passenger.registrationNo === record.vehicle.registrationNo); 
                    console.log("fetchVehicleDriverPassengers passengersForRecord >> " , passengersForRecord);
                    return { ...record, passengers: passengersForRecord };
                });

                console.log("fetchVehicleDriverPassengers updatedData >> " , updatedData);

                setRecords(updatedData);
                setFilteredRecords(updatedData);
                
            } catch (error) {
                console.error("Error fetchVehicleDriverPassengers:", error);
            }
        };

        fetchVehicleDriverPassengers();
    }, []);

    const getPassengersFromDB = async () => {
        try {
            const accidentReportId = accidentReport.ID;
            const passengerData = await PartiesInvolved.getPartiesInvolvedByAccIDPerson(DatabaseService.db, accidentReportId, 3);

            const mappedPassengerData = passengerData.map(row => ({
                id: row.ID,
                pedestrianName: row.NAME,
                selectedIdType: toStringOrEmpty(row.ID_TYPE),
                selectedInvolvementType: toStringOrEmpty(row.INVOLVEMENT_ID),
                idNo: row.IDENTIFICATION_NO,
                dateOfBirth: row.DATE_OF_BIRTH? parseStringToDate(row.DATE_OF_BIRTH) : null,
                selectedSex: toStringOrEmpty(row.GENDER_CODE),
                contact1: row.CONTACT_1,
                contact2: row.CONTACT_2,
                selectedCountryType: row.BIRTH_COUNTRY,
                selectedNationalityType: row.NATIONALITY,
                remarks: row.REMARKS_IDENTIFICATION,
                injury: row.REMARKS_DEGREE_INJURY,
                selectedAddressType: toStringOrEmpty(row.ADDRESS_TYPE),
                toggleSameAddress: row.SAME_AS_REGISTERED === 1,
                block: row.BLOCK,
                street: row.STREET,
                floor: row.FLOOR,
                unitNo: row.UNIT_NO,
                buildingName: row.BUILDING_NAME,
                postalCode: row.POSTAL_CODE,
                addressRemarks: row.REMARKS_ADDRESS,
                ambulanceNo: row.AMBULANCE_NO,
                aoIdentity: row.AMBULANCE_AO_ID,
                ambulanceArrivalTime: row.AMBULANCE_ARRIVAL? parseStringToTime(row.AMBULANCE_ARRIVAL) : null,
                ambulanceDepartureTime: row.AMBULANCE_DEPARTURE? parseStringToTime(row.AMBULANCE_DEPARTURE) : null,
                selectedHospital: toStringOrEmpty(row.HOSPITAL_ID),
                others: row.HOSPITAL_OTHER,
                vehicleSequence: row.VEHICLE_SEQUENCE,
                registrationNo: row.REGISTRATION_NO,
            }));

            return mappedPassengerData;
            
        } catch (error) {
            console.error("Error getPassengersFromDB:", error);
        }
    };

    //initial state
    const [currentRecord, setCurrentRecord] = useState({
        vehicle: {
            registrationNo: '',
            selectedVehicleType: '',
            selectedVehicleCategory: '',
            toggleLocalVehCheckBox: '',
            toggleSpecialPlateCheckBox: '',
            selectedVehicleMake: '',
            vehicleModel: '',
            selectedVehicleColor: '',
            vehicleColorOthers: '',
            vehicleOnFire: '',
            remarks: '',
            sequence: '',
        },
        driver: {
            driverName: '',
            idNo: '',
            otherLicense: '',
            breathalyzerNo: '',
            injuryDriver: '',
            contact1: '',
            contact2: '',
            block: '',
            street: '',
            floor: '',
            unitNo: '',
            buildingName: '',
            postalCode: '',
            addressRemarks: '',
            ambulanceNo: '',
            aoIdentity: '',
            others: '',
            selectedIdType: '',
            selectedLicenseType: '',
            selectedCountryType: '',
            selectedNationalityType: '',
            selectedAlcoholicBreath: '',
            selectedBreathalyserResult: '',
            selectedAddressType: '',
            expiryDate: '',
            toggleSameAddress: false,
            dateOfBirth: '',
            selectedSex: '',
            selectedDriverLicense: '',
            selectedHospital: '',
            ambulanceArrivalTime: '',
            ambulanceDepartureTime: '',
        },
        passengers: []
    });

    const handleAddPassenger = () => {
        console.log("in handleAddPassenger, currentRecord " , currentRecord.passengers);
        const newPassenger = {
            id: Date.now(),
            pedestrianName: '',
            idNo: '',
            contact1: '',
            contact2: '',
            injury: '',
            remarks: '',
            block: '',
            street: '',
            floor: '',
            unitNo: '',
            buildingName: '',
            postalCode: '',
            addressRemarks: '',
            ambulanceNo: '',
            aoIdentity: '',
            others: '',
            selectedIdType: '',
            selectedInvolvementType: '',
            selectedAddressType: null,
            toggleSameAddress: false,
            dateOfBirth: null,
            selectedSex: null,
            selectedHospital: null,
            ambulanceArrivalTime: null,
            ambulanceDepartureTime: null,
            selectedCountryType: null,
            selectedNationalityType: null,
            vehicleSequence: currentRecord.vehicle.sequence,
            registrationNo: currentRecord.vehicle.registrationNo,
        };
        
        // Update the currentRecord with the new passenger
        setCurrentRecord(prevRecord => ({
            ...prevRecord,
            passengers: [...prevRecord.passengers, newPassenger],
        }));
        
        console.log("current passenger >> " , currentRecord.passengers);
    };

    const handleRemovePassenger = (id) => {
        console.log("handleRemovePassenger ", id);
        setCurrentRecord(prevRecord => {
            const updatedPassengers = prevRecord.passengers.filter((passenger) => (passenger.id !== id));
            return { ...prevRecord, passengers: updatedPassengers };
        });
        
        PartiesInvolved.deletePartiesInvolved(DatabaseService.db, id);
    };
    
    const resetCurrentRecord = () => {
        setCurrentRecord({
            id: '',
            vehicle: {
                registrationNo: '',
                selectedVehicleType: '',
                selectedVehicleCategory: '',
                toggleLocalVehCheckBox: '',
                toggleSpecialPlateCheckBox: '',
                selectedVehicleMake: '',
                vehicleModel: '',
                selectedVehicleColor: '',
                vehicleColorOthers: '',
                vehicleOnFire: '',
                remarks: '',
                sequence: '',
            },
            driver: {
                driverName: '',
                idNo: '',
                otherLicense: '',
                breathalyzerNo: '',
                injuryDriver: '',
                contact1: '',
                contact2: '',
                block: '',
                street: '',
                floor: '',
                unitNo: '',
                buildingName: '',
                postalCode: '',
                addressRemarks: '',
                ambulanceNo: '',
                aoIdentity: '',
                others: '',
                selectedIdType: '',
                selectedLicenseType: '',
                selectedCountryType: '',
                selectedNationalityType: '',
                selectedAlcoholicBreath: '',
                selectedBreathalyserResult: '',
                selectedAddressType: '',
                expiryDate: '',
                toggleSameAddress: false,
                dateOfBirth: '',
                selectedSex: '',
                selectedDriverLicense: '',
                selectedHospital: '',
                ambulanceArrivalTime: '',
                ambulanceDepartureTime: '',
            },
            passengers: []
        });
    };

    const showForm = () => {
        setShowVehicleComponent(true);
        resetCurrentRecord();
    };

    const hideForm = () => {
        setShowVehicleComponent(false);
    };

    const CustomTabBar = ({ state, descriptors, navigation, vehicleRef, driverRef, passengerRef }) => {
        const handleTabPress = async (route, index) => {
            console.log('handleTabPress');
            let canNavigate = true;
    
            // Check which screen is being navigated from
            const currentRouteName = state.routes[state.index].name;
            console.log('currentRouteName ', currentRouteName);
    
            if (currentRouteName === 'Vehicle Details') {
                if (vehicleRef.current?.validate) {
                    canNavigate = await vehicleRef.current.validate();  // Await the result of validate
                }
            } else if (currentRouteName === 'Driver Details') {
                if (driverRef.current?.validate) {
                    canNavigate = await driverRef.current.validate();  // Await the result of validate
                }
            } else if (currentRouteName === 'Passenger Details') {
                if (passengerRef.current?.validate) {
                    canNavigate = await passengerRef.current.validate();  // Await the result of validate
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
                            <Text style={{ fontSize: 15, lineHeight: 15, fontFamily: "ZenKakuGothicAntique-Regular", fontWeight: isFocused ? 'bold' : 'normal' }}>
                                {descriptors[route.key].options.title || route.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };
    
    const handlePassengerBack = () => {
        console.log("in handlePassengerBack");
    
        getPassengersFromDB().then(passengers => {
            // Update the current record with the new passengers data
            const updatedRecord = {
                ...currentRecord,
                passengers,
            };
    
            // Update the records and filteredRecords arrays
            const updatedRecords = records.map(record =>
                record.id === updatedRecord.id ? updatedRecord : record
            );
    
            setRecords(updatedRecords);
            setFilteredRecords(updatedRecords);
    
            // Hide the form
            hideForm();
        });
    };

    const saveRecord = (record, close) => {
        console.log("saveRecord >> ", record);

        console.log(`record.id >> ${record.id}, currentRecord.id >> ${currentRecord.id} `);

        if (record.id && currentRecord.id === record.id) {
            console.log("Updating currentRecord. id >> ", currentRecord.id);

            console.log("record.sequence >> ", record.sequence);
            if (!record.sequence){
                const recordIndex = records.findIndex(v => v.id === record.id);
                console.log("record.index >> ", recordIndex);
                record.sequence = recordIndex + 1;
            }

            const updatedRecord = records.map(v => v.id === record.id ? record : v);
            console.log(updatedRecord);
            setRecords(updatedRecord);
            setFilteredRecords(updatedRecord);
        } else {
            //new record
            record.id = Date.now();
            record.sequence = records.length + 1;

            const updatedRecord = [...records, record];
            setRecords(updatedRecord);
            setFilteredRecords(updatedRecord);
        }

        saveToDB(record);

        console.log(`filteredRecords `, filteredRecords.length);
        ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);

        if (close){
            hideForm();
        }
        
    };

    const saveToDB = (record) => {
        console.log("record >> ", record);
        const recordToSave = {
            ID: record.id,

            /* Vehicle Tab */
            REGISTRATION_NO : record.vehicle.registrationNo.toUpperCase(),
            TYPE_CODE : record.vehicle.selectedVehicleType,
            SPECIAL_PLATE : (record.vehicle.toggleSpecialPlateCheckBox? 1 : 0),
            LOCAL_PLATE : (record.vehicle.toggleLocalVehCheckBox? 1 : 0),
            MAKE_CODE : record.vehicle.selectedVehicleMake,
            MODEL : record.vehicle.vehicleModel,
            COLOR : (record.vehicle.selectedVehicleColor === 99 || record.vehicle.selectedVehicleColor === '99') ? record.vehicle.vehicleColorOthers : null, 
            COLOR_CODE : record.vehicle.selectedVehicleColor,
            CATEGORY_CODE: record.vehicle.selectedVehicleCategory,
            IN_FLAME : (record.vehicle.vehicleOnFire === true? 1 : 0),
            REMARKS_VEHICLE : record.vehicle.remarks,
            VEHICLE_SEQUENCE: record.sequence? record.sequence: null, 

            /* Driver Tab */
            ACCIDENT_REPORT_ID : (accidentReport? accidentReport.ID: ''),
            PERSON_TYPE_ID : 2, // Always 2 for driver
            NAME : (record.driver.driverName !== null && record.driver.driverName !== "" ? record.driver.driverName : "UNKNOWN"),
            ID_TYPE : formatIntegerValueNotNull(record.driver.selectedIdType),  
            IDENTIFICATION_NO : (record.driver.idNo !== null ? record.driver.idNo : ""),
            DATE_OF_BIRTH : record.driver.dateOfBirth? formatDateToString(record.driver.dateOfBirth) : null,
            GENDER_CODE : formatIntegerValue(record.driver.selectedSex),
            LICENSE_TYPE_CODE : formatIntegerValue(record.driver.selectedLicenseType),
            LICENSE_EXPIRY_DATE : record.driver.expiryDate? formatDateToString(record.driver.expiryDate) : null,
            LICENSE_CLASS_CODE : record.driver.selectedDriverLicense,
            BIRTH_COUNTRY : record.driver.selectedCountryType,
            NATIONALITY : record.driver.selectedNationalityType,
            CONTACT_1 : record.driver.contact1,
            CONTACT_2 : record.driver.contact2,
            //REMARKS_IDENTIFICATION : record.driver.remarks,
            REMARKS_DEGREE_INJURY : record.driver.injuryDriver,
            ALCOHOL_BREATH : formatIntegerValue(record.driver.selectedAlcoholicBreath),
            BREATHALYZER_NO : record.driver.breathalyzerNo,
            BREATHALYZER_RESULT : formatIntegerValue(record.driver.selectedBreathalyserResult),
            OTHER_LICENCE : record.driver.otherLicense,

            ADDRESS_TYPE : formatIntegerValue(record.driver.selectedAddressType),
            SAME_AS_REGISTERED : (record.driver.toggleSameAddress? 1:0),
            BLOCK : record.driver.block,
            STREET : record.driver.street,
            FLOOR : record.driver.floor,
            UNIT_NO : record.driver.unitNo,
            BUILDING_NAME : record.driver.buildingName,
            POSTAL_CODE : record.driver.postalCode,
            REMARKS_ADDRESS : record.driver.addressRemarks,

            AMBULANCE_NO : record.driver.ambulanceNo,
            AMBULANCE_AO_ID : record.driver.aoIdentity,
            AMBULANCE_ARRIVAL : record.driver.ambulanceArrivalTime? formatTimeToString(record.driver.ambulanceArrivalTime) : null,
            AMBULANCE_DEPARTURE : record.driver.ambulanceDepartureTime? formatTimeToString(record.driver.ambulanceDepartureTime) : null,
            HOSPITAL_ID : formatIntegerValue(record.driver.selectedHospital),
            HOSPITAL_OTHER : record.driver.others, 
        };

        console.log("recordToSave >> " , recordToSave);
        PartiesInvolved.insert(DatabaseService.db, recordToSave);
    }

    const editRecord = (record) => {
        setCurrentRecord(record);
        console.log("currentRecord >> " , record);
        // setPassengers(record.passengers);
        setShowVehicleComponent(true);
    };

    const deleteRecord = (id) => {
        console.log("deleteRecord ", id);
        const updatedRecords = records.filter(record => record.id !== id);
        setRecords(updatedRecords);
        setFilteredRecords(updatedRecords);
        console.log("updatedRecords size ", updatedRecords.length);

        PartiesInvolved.deletePartiesInvolved(DatabaseService.db, id);
    };

    const confirmDelete = (id) => {
        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this vehicle?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => deleteRecord(id), style: "destructive" }
            ],
            { cancelable: true }
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.PedestrianContainer}>
            <TouchableOpacity 
                onPress={() => editRecord(item)} 
                style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start' }}>                                    
                <Text style={styles.Label}>{item.vehicle.registrationNo}</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: 'center', alignSelf: 'flex-end' }}>
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: 'center', marginRight: 20 }}
                    onPress={() => confirmDelete(item.id)}>
                    <Text style={[styles.DeleteFont]}>Delete</Text>
                    <Image style={{ width: 15, height: 17, alignSelf: 'center' }}  source={require('../../assets/icon/delete-red.png')} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: 'center' }}
                    onPress={() => editRecord(item)}>
                    <Text style={[styles.EditFont]}>Edit</Text>
                    <Image style={{ width: 15, height: 15, alignSelf: 'center' }}  source={require('../../assets/icon/edit.png')} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={[styles.ContainerWhiteBG]} nestedScrollEnabled={true}>
            {!showVehicleComponent && (
                <SafeAreaView style={{height: "100%"}}>
                    <View style={styles.ListComponentFrame}>    
                        <View style={styles.VehicleInvolvedTitle}>
                            <Text style={styles.VehicleInvolvedTitleFontStyle}>Vehicle List</Text>
                        </View>
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
                            style={[styles.ListContainer, {flex: 1, marginBottom: 10}]}
                            data={filteredRecords}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                            ListEmptyComponent={() => (
                                <View style={styles.NoItemsContainer}>
                                    <Text style={styles.NoItemsFont}>No items found.</Text>
                                    <Text style={styles.NoItemsRegularFont}>Tap the button below to add vehicle.</Text>
                                </View>
                            )}
                        />
                        
                        <View style={[styles.ListContainer, {flex:1}]}>
                            <BlueButton title="ADD VEHICLE" customClick={showForm}/>
                            <View style={styles.MarginContainerXSmall} />
                            <BackToHomeButton/>
                        </View>
                        
                    </View>
                </SafeAreaView> 
            )}

            {showVehicleComponent && (
                <SafeAreaView style={{height: "100%"}}>
                    <View style={[styles.ComponentFrame, {marginTop: 15}]}>
                        <View style={styles.VehicleInvolvedTitle}>
                            <Text style={styles.VehicleInvolvedTitleFontStyle}>Vehicle Registration</Text>
                            {Boolean(currentRecord?.vehicle?.registrationNo) && (
                                <View style={styles.VehicleRegistrationNoFrame}>
                                    <Text style={styles.VehicleRegistrationNoFont}>No.</Text>
                                    <View style={styles.VerticalVector}/>
                                    <Text style={[styles.VehicleRegistrationNoFont, {marginLeft: 15}]}>
                                        {currentRecord.vehicle.registrationNo}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.OSIPOTabContainerFrame}>
                            <Tab.Navigator
                                initialRouteName="Vehicle Details"
                                screenOptions={{ labelStyle: { fontSize: 11 }, swipeEnabled: false }}
                                tabBar={(props) => (
                                    <CustomTabBar 
                                        {...props} 
                                        vehicleRef={vehicleRef} 
                                        driverRef={driverRef} 
                                        passengerRef={passengerRef} 
                                    />
                                )}
                            >
                                <Tab.Screen name="Vehicle Details">
                                    {(props) => (
                                        <VehicleDetails
                                            ref={vehicleRef}
                                            vehicle={currentRecord.vehicle}  // Pass your vehicle prop here
                                            saveVehicle={(vehicleDetails) => {
                                                const updatedVehicleRecord = { ...currentRecord, vehicle: vehicleDetails };
                                                setCurrentRecord(updatedVehicleRecord);
                                                //saveRecord(currentRecord, false);
                                                ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
                                            }}
                                            saveRecord={(vehicleDetails) => {
                                                const updatedVehicleRecord = { ...currentRecord, vehicle: vehicleDetails };
                                                setCurrentRecord(updatedVehicleRecord);
                                                saveRecord(updatedVehicleRecord, true);
                                            }}
                                            {...props} 
                                        />
                                    )}
                                </Tab.Screen>
                                <Tab.Screen name="Driver Details">
                                    {(props) => (
                                        <DriverDetails
                                            ref={driverRef}
                                            driver={currentRecord.driver}  // Pass your driver prop here
                                            saveDriver={(driverDetails) => {
                                                console.log("driverDetails ", driverDetails);
                                                const updatedDriverRecord = { ...currentRecord, driver: driverDetails };
                                                setCurrentRecord(updatedDriverRecord);
                                                //saveRecord(currentRecord, false);
                                                ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
                                            }}
                                            saveRecord={(driverDetails) => {
                                                const updatedDriverRecord = { ...currentRecord, driver: driverDetails };
                                                setCurrentRecord(updatedDriverRecord);
                                                saveRecord(updatedDriverRecord, true);
                                            }}
                                            {...props} 
                                        />
                                    )}
                                </Tab.Screen>
                                <Tab.Screen name="Passenger Details">
                                    {(props) => (
                                        <PassengerDetails
                                            ref={passengerRef}
                                            initialPassengers={currentRecord.passengers}  // Pass your initialPassengers prop here
                                            addPassenger={handleAddPassenger}
                                            removePassenger={handleRemovePassenger}
                                            hideForm={handlePassengerBack}
                                            {...props}
                                        />
                                    )}
                                </Tab.Screen>
                            </Tab.Navigator>
                        </View>
                    </View>
                </SafeAreaView>
            )}
        </ScrollView>
    );
});

export default VehiclesInvolved;