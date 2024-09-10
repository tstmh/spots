import React, { useState, useContext, useEffect } from 'react';
import { TouchableOpacity, Image, View, Text, ScrollView, SafeAreaView, FlatList, Alert, TextInput, ToastAndroid } from 'react-native';
import WhiteButton from '../../components/common/WhiteButton';
import BlueButton from '../../components/common/BlueButton';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import styles from '../../components/spots-styles';
import WitnessIdentity from '../common/WitnessIdentity';
import Address from '../common/Address';
import PartiesInvolved from '../../models/PartiesInvolved';
import DatabaseService from '../../utils/DatabaseService';
import { AccidentReportContext } from '../../context/accidentReportContext';
import { formatDateTimeToString, formatIntegerValue, parseStringToDate, formatDateToString, formatIntegerValueNotNull, toStringOrEmpty } from '../../utils/Formatter';
import { validateDateIsFutureDate, validateIdNo } from '../../utils/Validator';

const Witnesses = React.forwardRef((props, ref) => {
    const { accidentReport } = useContext(AccidentReportContext);
    const [searchInput, setSearchInput] = useState('');
    const [filteredRecords, setFilteredRecords] = useState(witnesses);

    // Expose the validate function
    React.useImperativeHandle(ref, () => ({
        validate: validateAndSave,
    }));

    const validateAndSave = () => {
        console.log('validateAndSave showWitnessComponent', showWitnessComponent);
        if (showWitnessComponent){
            //Alert.alert('Validation', 'Please go back to Witness List to save this form.');
            return handleBackToList();
        }
        return !showWitnessComponent;
    }

    useEffect(() => {
        const newFilteredRecords = witnesses.filter(record =>
            record.witnessName.toUpperCase().includes(searchInput.toUpperCase())
        );
        console.log("newFilteredRecords " , newFilteredRecords.length);
        setFilteredRecords(newFilteredRecords);
    }, [searchInput]);

    useEffect(() => {
        setFilteredRecords(witnesses);
    }, [witnesses]);

    useEffect(() => {
        const fetchWitnesses = async () => {
            try {
                const accidentReportId = accidentReport.ID;
                const data = await PartiesInvolved.getPartiesInvolvedByAccIDPerson(DatabaseService.db, accidentReportId, 4);
                
                console.log("fetchWitnesses data >> " , data);

                const mappedData = data.map(row => ({
                    id: row.ID,
                    witnessName: row.NAME,
                    selectedIdType: toStringOrEmpty(row.ID_TYPE),
                    idNo: row.IDENTIFICATION_NO,
                    dateOfBirth: row.DATE_OF_BIRTH ? parseStringToDate(row.DATE_OF_BIRTH) : null,
                    selectedSex: toStringOrEmpty(row.GENDER_CODE),
                    contact1: row.CONTACT_1,
                    contact2: row.CONTACT_2,
                    selectedAddressType: toStringOrEmpty(row.ADDRESS_TYPE),
                    toggleSameAddress: row.SAME_AS_REGISTERED === 1,
                    block: row.BLOCK,
                    street: row.STREET,
                    floor: row.FLOOR,
                    unitNo: row.UNIT_NO,
                    buildingName: row.BUILDING_NAME,
                    postalCode: row.POSTAL_CODE,
                    addressRemarks: row.REMARKS_ADDRESS || ''
                }));
                console.log("fetchWitnesses mappedData >> " , mappedData);
                setWitnesses(mappedData);
                setFilteredRecords(mappedData);
            } catch (error) {
                console.error("Error fetching witnessses:", error);
            }
        };

        fetchWitnesses();
    }, []);

    const [showWitnessComponent, setShowWitnessComponent] = useState(false);
    const [witnesses, setWitnesses] = useState([]);
    const [currentWitness, setCurrentWitness] = useState(null);
    const [expandedSection, setExpandedSection] = useState(null);

    // Witness form state variables
    const [witnessName, setWitnessName] = useState('');
    const [idNo, setIdNo] = useState('');
    const [contact1, setContact1] = useState('');
    const [contact2, setContact2] = useState('');
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

    const showForm = () => {
        setShowWitnessComponent(true);
    };

    const hideForm = () => {
        setShowWitnessComponent(false);
        resetForm();
    };

    const toggleSection = (sectionNumber) => {
        setExpandedSection(sectionNumber === expandedSection ? null : sectionNumber);
    };

    const resetForm = () => {
        setWitnessName('');
        setIdNo('');
        setContact1('');
        setContact2('');
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
        setCurrentWitness(null);
    };

    const validateForm = () => {
        // if (!witnessName) {
        //     Alert.alert('Validation Error', 'Please enter Name.');
        //     return false;
        // };

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
        const witness = {
            id: currentWitness ? currentWitness.id : formatDateTimeToString(new Date()),
            witnessName, selectedIdType, idNo, contact1, contact2, age, selectedSex,
            selectedAddressType, toggleSameAddress, block, street, floor, unitNo,
            buildingName, postalCode, addressRemarks, dateOfBirth
        };

        if (currentWitness) {
            const updatedWitnesses = witnesses.map(w => w.id === witness.id ? witness : w)
            setWitnesses(updatedWitnesses);
            setFilteredRecords(updatedWitnesses);
        } else {
            const updatedWitnesses = [...witnesses, witness]
            setWitnesses(updatedWitnesses);
            setFilteredRecords(updatedWitnesses);
        }
        setCurrentWitness(witness);

        console.log("witnesses" , witnesses);
        console.log("witness" , witness);

        const witnessToSave = {
            ID: witness.id,
            ACCIDENT_REPORT_ID: accidentReport? accidentReport.ID: '',
            PERSON_TYPE_ID: 4, // 4 for Witnesses
            NAME: witness.witnessName, 
            ID_TYPE: formatIntegerValueNotNull(selectedIdType),
            IDENTIFICATION_NO: witness.idNo,
            DATE_OF_BIRTH: witness.dateOfBirth? formatDateToString(witness.dateOfBirth) : null,
            GENDER_CODE: formatIntegerValue(witness.selectedSex),
            CONTACT_1: witness.contact1,
            CONTACT_2: witness.contact2,
            ADDRESS_TYPE: formatIntegerValue(witness.selectedAddressType),
            SAME_AS_REGISTERED: witness.toggleSameAddress ? 1 : 0,
            BLOCK: witness.block,
            STREET: witness.street,
            FLOOR: witness.floor,
            UNIT_NO: witness.unitNo,
            BUILDING_NAME: witness.buildingName,
            POSTAL_CODE: witness.postalCode,
            REMARKS_ADDRESS: witness.addressRemarks,
        };

        PartiesInvolved.insertWitness(DatabaseService.db, witnessToSave);
        
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

    const editWitness = (witness) => {
        console.log("editWitness " , witness);
        setCurrentWitness(witness);
        setWitnessName(witness.witnessName);
        setIdNo(witness.idNo?.toUpperCase());
        setContact1(witness.contact1);
        setContact2(witness.contact2);
        setSelectedIdType(witness.selectedIdType);
        setDateOfBirth(witness.dateOfBirth? new Date(witness.dateOfBirth) : null);
        setAge(witness.age);
        setSelectedSex(witness.selectedSex);
        setSelectedAddressType(witness.selectedAddressType);
        setToggleSameAddress(witness.toggleSameAddress);
        setBlock(witness.block);
        setStreet(witness.street);
        setFloor(witness.floor);
        setUnitNo(witness.unitNo);
        setBuildingName(witness.buildingName);
        setPostalCode(witness.postalCode);
        setAddressRemarks(witness.addressRemarks);
        showForm();
    };

    const confirmDelete = (witnessId) => {
        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this witness?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => deleteWitness(witnessId),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const deleteWitness = (witnessId) => {
        const updatedWitnesses = witnesses.filter(p => p.id !== witnessId)
        setWitnesses(updatedWitnesses);
        setFilteredRecords(updatedWitnesses);
        PartiesInvolved.deletePartiesInvolved(DatabaseService.db, witnessId);
    };

    return (
        <ScrollView style={styles.ContainerWhiteBG}>
            {!showWitnessComponent && (
                <SafeAreaView style={{height: "100%"}}>
                    <View style={styles.ListComponentFrame}>    
                        <View style={styles.VehicleInvolvedTitle}>
                            <Text style={styles.VehicleInvolvedTitleFontStyle}>Witness List</Text>
                        </View>
                        <View style={styles.RoundedDateInput}>
                            <TextInput
                                style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 12 }}
                                placeholder="Search Witness/es"
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
                            style={[styles.ListContainer, {flex:1, marginBottom: 10}]}
                            data={filteredRecords}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.PedestrianContainer}>
                                    <TouchableOpacity 
                                        onPress={() => editWitness(item)} 
                                        style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start' }}>                                    
                                        <Text style={styles.Label}>{item.witnessName}</Text>
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
                                            onPress={() => editWitness(item)}>
                                            <Text style={[styles.EditFont]}>Edit</Text>
                                            <Image style={{ width: 15, height: 15, alignSelf: 'center' }}  source={require('../../assets/icon/edit.png')} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={() => (
                                <View style={styles.NoItemsContainer}>
                                    <Text style={styles.NoItemsFont}>No items found. </Text>
                                    <Text style={styles.NoItemsRegularFont}>Tap the button below to add witnesses.</Text>
                                </View>
                            )}
                        />

                        <View style={[styles.ListContainer, {flex:1}]}>
                            <BlueButton title="ADD WITNESS" customClick={showForm}/>
                            <View style={styles.MarginContainerXSmall} />
                            <BackToHomeButton/>
                        </View>
                        
                    </View>
                </SafeAreaView> 
            )}

            {showWitnessComponent && (
                <View style={styles.ContainerGreyBG}>
                    <SafeAreaView style={{height: "100%"}}>
                        <View style={styles.ComponentFrame}>

                            {/* Section 1 */}
                            <WitnessIdentity
                                styles={styles} 
                                toggleSection={toggleSection} 
                                expandedSection={expandedSection} 
                                witnessName={witnessName}
                                setWitnessName={setWitnessName}
                                idNo={idNo}
                                setIdNo={setIdNo}
                                contact1={contact1}
                                setContact1={setContact1}
                                contact2={contact2}
                                setContact2={setContact2}
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

                            <View style={styles.TextInputContainer}>
                                <View style={styles.MarginContainerXSmall} />
                                <WhiteButton title="SAVE AS DRAFT" customClick={handleSaveDraft}/>
                                <View style={styles.MarginContainerXSmall} />
                                <BlueButton title="BACK TO LIST" customClick={handleBackToList}/>
                                <View style={styles.MarginContainer} />
                                <BackToHomeButton/>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            )}
        </ScrollView>
    );
});

export default Witnesses;
