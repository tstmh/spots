import React, { useState, useContext, useEffect } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput, SafeAreaView, FlatList, Alert, ScrollView, ToastAndroid } from 'react-native';
import WhiteButton from '../../components/common/WhiteButton';
import BlueButton from '../../components/common/BlueButton';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import styles from '../../components/spots-styles';
import PedestrianIdentity from '../common/PedestrianIdentity';
import Address from '../common/Address';
import Treatment from '../common/Treatment';
import PartiesInvolved from '../../models/PartiesInvolved';
import DatabaseService from '../../utils/DatabaseService';
import { AccidentReportContext } from '../../context/accidentReportContext';
import { validateDateIsFutureDate, validateIdNo } from '../../utils/Validator';
import { formatTimeToString, formatIntegerValue, parseStringToDate, parseStringToTime, formatIntegerValueNotNull, formatDateToString } from '../../utils/Formatter';

const PedestrianInvolved = React.forwardRef((props, ref) => {
    const { accidentReport } = useContext(AccidentReportContext);
    const [searchInput, setSearchInput] = useState('');
    const [filteredRecords, setFilteredRecords] = useState(pedestrians);

    // Expose the validate function
    React.useImperativeHandle(ref, () => ({
        validate: validateAndSave,
    }));

    const validateAndSave = () => {
        console.log('validateAndSave showPedestrianComponent', showPedestrianComponent);
        if (showPedestrianComponent){
            //Alert.alert('Validation', 'Please go back to Pedestrian List to save this form.');
            return handleBackToList();
        }
        return !showPedestrianComponent;
    }

    useEffect(() => {
        const newFilteredRecords = pedestrians.filter(record =>
            record.pedestrianName.toUpperCase().includes(searchInput.toUpperCase())
        );
        console.log("newFilteredRecords " , newFilteredRecords.length);
        setFilteredRecords(newFilteredRecords);
    }, [searchInput]);

    useEffect(() => {
        console.log("setFilteredRecords with pedestrians " , pedestrians.length);
        setFilteredRecords(pedestrians);
    }, [pedestrians]);

    useEffect(() => {
        const fetchPedestrians = async () => {
            try {
                const accidentReportId = accidentReport.ID;
                const data = await PartiesInvolved.getPartiesInvolvedByAccIDPerson(DatabaseService.db, accidentReportId, 1);
                
                console.log("fetchPedestrians data >> " , data);

                const mappedData = data.map(row => ({
                    id: row.ID,
                    pedestrianName: row.NAME,
                    selectedIdType: row.ID_TYPE?.toString(),
                    idNo: row.IDENTIFICATION_NO,
                    dateOfBirth: row.DATE_OF_BIRTH? parseStringToDate(row.DATE_OF_BIRTH) : null,
                    selectedSex: row.GENDER_CODE?.toString(),
                    contact1: row.CONTACT_1,
                    contact2: row.CONTACT_2,
                    remarks: row.REMARKS_IDENTIFICATION,
                    injury: row.REMARKS_DEGREE_INJURY,
                    selectedAddressType: row.ADDRESS_TYPE?.toString(),
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
                    selectedHospital: row.HOSPITAL_ID?.toString(),
                    others: row.HOSPITAL_OTHER
                }));
                console.log("fetchPedestrians mappedData >> " , mappedData);
                setPedestrians(mappedData);
                setFilteredRecords(mappedData);
            } catch (error) {
                console.error("Error fetching pedestrians:", error);
            }
        };

        fetchPedestrians();
    }, []);
    
    const [showPedestrianComponent, setShowPedestrianComponent] = useState(false);
    const [pedestrians, setPedestrians] = useState([]);
    const [currentPedestrian, setCurrentPedestrian] = useState(null);
    const [expandedSection, setExpandedSection] = useState(null);

    // Pedestrian form state variables
    const [pedestrianName, setPedestrianName] = useState('');
    const [idNo, setIdNo] = useState('');
    const [contact1, setContact1] = useState('');
    const [contact2, setContact2] = useState('');
    const [injury, setInjury] = useState('');
    const [remarks, setRemarks] = useState('');
    const [selectedIdType, setSelectedIdType] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [openDateOfBirth, setOpenDateOfBirth] = useState(false);
    const [age, setAge] = useState('');
    const [selectedSex, setSelectedSex] = useState(null);
    const [selectedAddressType, setSelectedAddressType] = useState('');
    const [toggleSameAddress, setToggleSameAddress] = useState(false);
    const [block, setBlock] = useState('');
    const [street, setStreet] = useState('');
    const [floor, setFloor] = useState('');
    const [unitNo, setUnitNo] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [addressRemarks, setAddressRemarks] = useState('');
    const [ambulanceNo, setAmbulanceNo] = useState('');
    const [aoIdentity, setAoIdentity] = useState('');
    const [others, setOthers] = useState('');
    const [selectedHospital, setSelectedHospital] = useState('');
    const [ambulanceArrivalTime, setAmbulanceArrivalTime] = useState(null);
    const [openAmbulanceArrivalTime, setOpenAmbulanceArrivalTime] = useState(false);
    const [ambulanceDepartureTime, setAmbulanceDepartureTime] = useState(null);
    const [openAmbulanceDepartureTime, setOpenAmbulanceDepartureTime] = useState(false);

    const showForm = () => {
        setShowPedestrianComponent(true);
    };

    const hideForm = () => {
        setShowPedestrianComponent(false);
        resetForm();
    };

    const toggleSection = (sectionNumber) => {
        setExpandedSection(sectionNumber === expandedSection ? null : sectionNumber);
    };

    const resetForm = () => {
        setPedestrianName('');
        setIdNo('');
        setContact1('');
        setContact2('');
        setInjury('');
        setRemarks('');
        setSelectedIdType('');
        setDateOfBirth(null);
        setOpenDateOfBirth(false);
        setAge('');
        setSelectedSex(null);
        setSelectedAddressType('');
        setToggleSameAddress(false);
        setBlock('');
        setStreet('');
        setFloor('');
        setUnitNo('');
        setBuildingName('');
        setPostalCode('');
        setAddressRemarks('');
        setAmbulanceNo('');
        setAoIdentity('');
        setOthers('');
        setSelectedHospital('');
        setAmbulanceArrivalTime(null);
        setOpenAmbulanceArrivalTime(false);
        setAmbulanceDepartureTime(null);
        setOpenAmbulanceDepartureTime(false);
        setCurrentPedestrian(null);
    };

    const validateForm = () => {

        if (!selectedIdType) {
            Alert.alert('Validation Error', 'Please select ID Type.');
            return false;
        };

        if (!idNo){
            Alert.alert('Validation Error', 'Please enter ID Number.');
            return false;
        }
        
        if (!validateIdNo(selectedIdType, idNo)) {
            Alert.alert('Validation Error', 'Invalid ID Number');
            return;
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

        return true;
    }

    const saveData = () => {
        const pedestrian = {
            id: currentPedestrian ? currentPedestrian.id : Date.now(),
            pedestrianName, selectedIdType, idNo,
            contact1, contact2, dateOfBirth,
            injury, remarks, age, selectedSex,
            selectedAddressType, toggleSameAddress, block, street, floor, unitNo,
            buildingName, postalCode, addressRemarks,
            ambulanceNo, aoIdentity, others, selectedHospital,
            ambulanceArrivalTime, ambulanceDepartureTime
        };
        if (currentPedestrian) {
            const updatedPedestrians = pedestrians.map(p => p.id === pedestrian.id ? pedestrian : p);
            setPedestrians(updatedPedestrians);
            setFilteredRecords(updatedPedestrians);
        } else {
            const updatedPedestrians = [...pedestrians, pedestrian];
            setPedestrians(updatedPedestrians);
            setFilteredRecords(updatedPedestrians);
        }
        setCurrentPedestrian(pedestrian);
        console.log("pedestrian " , pedestrian);

        const pedestrianToSave = {
            ID: pedestrian.id,
            ACCIDENT_REPORT_ID: accidentReport.ID,
            PERSON_TYPE_ID: 1, // Always 1 for Pedestrian
            NAME: pedestrian.pedestrianName,
            ID_TYPE: formatIntegerValueNotNull(pedestrian.selectedIdType),
            IDENTIFICATION_NO: pedestrian.idNo,
            DATE_OF_BIRTH: pedestrian.dateOfBirth? formatDateToString(pedestrian.dateOfBirth) : null,
            GENDER_CODE: formatIntegerValue(pedestrian.selectedSex),
            CONTACT_1: pedestrian.contact1,
            CONTACT_2: pedestrian.contact2,
            REMARKS_IDENTIFICATION: pedestrian.remarks,
            REMARKS_DEGREE_INJURY: pedestrian.injury,

            ADDRESS_TYPE: formatIntegerValue(pedestrian.selectedAddressType),
            SAME_AS_REGISTERED: pedestrian.toggleSameAddress? 1: 0,
            BLOCK: pedestrian.block,
            STREET: pedestrian.street,
            FLOOR: pedestrian.floor,
            UNIT_NO: pedestrian.unitNo,
            BUILDING_NAME: pedestrian.buildingName,
            POSTAL_CODE: pedestrian.postalCode,
            REMARKS_ADDRESS: pedestrian.addressRemarks,

            AMBULANCE_NO: pedestrian.ambulanceNo,
            AMBULANCE_AO_ID: pedestrian.aoIdentity,
            AMBULANCE_ARRIVAL: pedestrian.ambulanceArrivalTime? formatTimeToString(pedestrian.ambulanceArrivalTime) : null,
            AMBULANCE_DEPARTURE: pedestrian.ambulanceDepartureTime? formatTimeToString(pedestrian.ambulanceDepartureTime) : null,
            HOSPITAL_ID: formatIntegerValue(pedestrian.selectedHospital),
            HOSPITAL_OTHER: others
        }

        console.log("pedestrianToSave >> ", pedestrianToSave);
        PartiesInvolved.insertPedestrian(DatabaseService.db, pedestrianToSave);

        ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
    };

    const handleSaveDraft = () => {
        if (validateForm()) {
            saveData(); 
        }
    };

    const handleBackToList = () => {
        if (validateForm()) {
            saveData();
            hideForm();
            return true;
        }
        return false;
    };

    const editPedestrian = (pedestrian) => {
        setCurrentPedestrian(pedestrian);
        setPedestrianName(pedestrian.pedestrianName);
        setIdNo(pedestrian.idNo);
        setContact1(pedestrian.contact1);
        setContact2(pedestrian.contact2);
        setInjury(pedestrian.injury);
        setRemarks(pedestrian.remarks);
        setSelectedIdType(pedestrian.selectedIdType);
        setDateOfBirth(pedestrian.dateOfBirth);
        setAge(pedestrian.age);
        setSelectedSex(pedestrian.selectedSex);
        setSelectedAddressType(pedestrian.selectedAddressType);
        setToggleSameAddress(pedestrian.toggleSameAddress);
        setBlock(pedestrian.block);
        setStreet(pedestrian.street);
        setFloor(pedestrian.floor);
        setUnitNo(pedestrian.unitNo);
        setBuildingName(pedestrian.buildingName);
        setPostalCode(pedestrian.postalCode);
        setAddressRemarks(pedestrian.addressRemarks);
        setAmbulanceNo(pedestrian.ambulanceNo);
        setAoIdentity(pedestrian.aoIdentity);
        setOthers(pedestrian.others);
        setSelectedHospital(pedestrian.selectedHospital);
        setAmbulanceArrivalTime(pedestrian.ambulanceArrivalTime);
        setAmbulanceDepartureTime(pedestrian.ambulanceDepartureTime);
        showForm();
    };

    const confirmDelete = (pedestrianId) => {
        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this pedestrian?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => deletePedestrian(pedestrianId),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const deletePedestrian = (pedestrianId) => {
        const updatedPedestrians = pedestrians.filter(p => p.id !== pedestrianId);
        setPedestrians(updatedPedestrians);
        setFilteredRecords(updatedPedestrians);
        PartiesInvolved.deletePartiesInvolved(DatabaseService.db, pedestrianId);
    };

    return (
        <ScrollView style={styles.ContainerWhiteBG}>
            {!showPedestrianComponent && (
                <SafeAreaView style={{height: "100%"}}>
                    <View style={styles.ListComponentFrame}>
                        <View style={styles.VehicleInvolvedTitle}>
                            <Text style={styles.VehicleInvolvedTitleFontStyle}>Pedestrian Involved</Text>
                        </View>
                        <View style={styles.RoundedDateInput}>
                            <TextInput
                                style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 12 }}
                                placeholder="Search Pedestrian"
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
                        <View style={styles.MarginContainerSmall} />
                        <FlatList
                            style={[styles.ListContainer, {flex: 1, marginBottom: 10}]}
                            data={filteredRecords}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.PedestrianContainer}>
                                    <TouchableOpacity 
                                        onPress={() => editPedestrian(item)} 
                                        style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start' }}>                                    
                                        <Text style={styles.Label}>{item.pedestrianName}</Text>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: "row", alignSelf: 'flex-end' }}>
                                        <TouchableOpacity 
                                            style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
                                            onPress={() => confirmDelete(item.id)}>
                                            <Text style={[styles.DeleteFont]}>Delete</Text>
                                            <Image style={{ width: 15, height: 17, alignSelf: 'center' }}  source={require('../../assets/icon/delete-red.png')} />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => editPedestrian(item)}>
                                            <Text style={[styles.EditFont]}>Edit</Text>
                                            <Image style={{ width: 15, height: 15, alignSelf: 'center' }}  source={require('../../assets/icon/edit.png')} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={() => (
                                <View style={styles.NoItemsContainer}>
                                    <Text style={styles.NoItemsFont}>No items found. </Text>
                                    <Text style={styles.NoItemsRegularFont}>Tap the button below to add pedestrian.</Text>
                                </View>
                            )}
                        />

                        <View style={[styles.ListContainer, {flex:1}]}>
                            <BlueButton title="ADD PEDESTRIAN" customClick={showForm}/>
                            <View style={styles.MarginContainerXSmall} />
                            <BackToHomeButton/>
                        </View>
                        <View style={{height: 50}} />

                    </View>
                </SafeAreaView>
            )}

            {showPedestrianComponent && (
                <View style={styles.ContainerGreyBG}>
                    <SafeAreaView style={{height: "100%"}}>
                        <View style={styles.ComponentFrame}>

                            {/* Section 1 */}
                            <PedestrianIdentity
                                styles={styles}
                                toggleSection={toggleSection}
                                expandedSection={expandedSection}
                                pedestrianName={pedestrianName}
                                setPedestrianName={setPedestrianName}
                                idNo={idNo}
                                setIdNo={setIdNo}
                                contact1={contact1}
                                setContact1={setContact1}
                                contact2={contact2}
                                setContact2={setContact2}
                                injury={injury}
                                setInjury={setInjury}
                                selectedIdType={selectedIdType}
                                setSelectedIdType={setSelectedIdType}
                                dateOfBirth={dateOfBirth}
                                setDateOfBirth={setDateOfBirth}
                                handleOpenDateOfBirth={() => setOpenDateOfBirth(true)}
                                setOpenDateOfBirth={setOpenDateOfBirth}
                                openDateOfBirth={openDateOfBirth}
                                age={age}
                                setAge={setAge}
                                selectedSex={selectedSex}
                                handleSexRadioButtonChange={setSelectedSex}
                                remarks={remarks}
                                setRemarks={setRemarks}
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
                            <Treatment
                                styles={styles}
                                toggleSection={toggleSection}
                                expandedSection={expandedSection}
                                ambulanceNo={ambulanceNo}
                                setAmbulanceNo={setAmbulanceNo}
                                aoIdentity={aoIdentity}
                                setAoIdentity={setAoIdentity}
                                others={others}
                                setOthers={setOthers}
                                selectedHospital={selectedHospital}
                                setSelectedHospital={setSelectedHospital}
                                openAmbulanceArrivalTime={openAmbulanceArrivalTime}
                                ambulanceArrivalTime={ambulanceArrivalTime}
                                handleOpenAmbulanceArrivalTime={() => setOpenAmbulanceArrivalTime(true)}
                                setOpenAmbulanceArrivalTime={setOpenAmbulanceArrivalTime}
                                setAmbulanceArrivalTime={setAmbulanceArrivalTime}
                                openAmbulanceDepartureTime={openAmbulanceDepartureTime}
                                ambulanceDepartureTime={ambulanceDepartureTime}
                                handleOpenAmbulanceDepartureTime={() => setOpenAmbulanceDepartureTime(true)}
                                setOpenAmbulanceDepartureTime={setOpenAmbulanceDepartureTime}
                                setAmbulanceDepartureTime={setAmbulanceDepartureTime}
                            />

                            <View style={styles.TextInputContainer}>
                                <View style={styles.MarginContainerXSmall} />
                                <WhiteButton title="SAVE AS DRAFT" customClick={handleSaveDraft}/>
                                <View style={styles.MarginContainerXSmall} />
                                <BlueButton title="BACK TO LIST" customClick={handleBackToList}/>
                                {/* <View style={styles.MarginContainer} /> */}
                                {/* <BackToHomeButton /> */}
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            )}
        </ScrollView>
    );
});

export default PedestrianInvolved;
