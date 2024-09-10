import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, Image, View, Text, Alert, SafeAreaView, FlatList } from 'react-native';
import styles from '../../components/spots-styles';
import OffenderIdentity from '../common/OffenderIdentity';
import Address from '../common/Address';
import OffenceModal from '../common/OffenceDetailsModal';
import { validateDateIsFutureDate, validateIdNo } from '../../utils/Validator';
import Offences from '../../models/Offences';
import DatabaseService from '../../utils/DatabaseService';

const Offender = forwardRef(({ index, offenderData, onRemoveOffender }, ref) => {

    console.log('offender', offenderData);
    console.log('offender.offence', offenderData.offences);

    useImperativeHandle(ref, () => ({
        validateForm() {
            return validateForm();
        },
        getForm() {
            const data = {
                id: offenderData.id,
                name: name,
                idNo: idNo,
                contact1: contact1,
                contact2: contact2,
                remarks: remarks,

                block: block,
                street: street,
                floor: floor,
                unitNo: unitNo,
                buildingName: buildingName,
                postalCode: postalCode,
                addressRemarks: addressRemarks,
                toggleSameAddress: toggleSameAddress,
                
                dateOfBirth: dateOfBirth,
                selectedInvolvementType: selectedInvolvementType,
                selectedIdType: selectedIdType,
                selectedSex: selectedSex,
                selectedAddressType: selectedAddressType,
                selectedCountryType: selectedCountryType,
                selectedNationalityType: selectedNationalityType,

                offences: offences
            }

            return data;
        }
    }));

    const [expandedSectionOffender, setExpandedSectionOffender] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    
    const toggleSection = (sectionNumber) => {
        setExpandedSection(sectionNumber === expandedSection ? null : sectionNumber);
    };
    const toggleSectionOffender = () => {
        setExpandedSectionOffender(!expandedSectionOffender);
    };

    const [name, setName] = useState(offenderData.name);
    const [idNo, setIdNo] = useState(offenderData.idNo);
    const [contact1, setContact1] = useState(offenderData.contact1);
    const [contact2, setContact2] = useState(offenderData.contact2)
    const [remarks, setRemarks] = useState(offenderData.remarks);
    const [age, setAge] = useState('');

    const [block, setBlock] = useState(offenderData.block);
    const [street, setStreet] = useState(offenderData.street);
    const [floor, setFloor] = useState(offenderData.floor);
    const [unitNo, setUnitNo] = useState(offenderData.unitNo);
    const [buildingName, setBuildingName] = useState(offenderData.buildingName);
    const [postalCode, setPostalCode] = useState(offenderData.postalCode);
    const [addressRemarks, setAddressRemarks] = useState(offenderData.addressRemarks);
    const [toggleSameAddress, setToggleSameAddress] = useState(offenderData.toggleSameAddress);
    
    const [selectedInvolvementType, setSelectedInvolvementType] = useState(offenderData.selectedInvolvementType);
    const [selectedIdType, setSelectedIdType] = useState(offenderData.selectedIdType);
    const [selectedSex, setSelectedSex] = useState(offenderData.selectedSex);
    const [selectedAddressType, setSelectedAddressType] = useState(offenderData.selectedAddressType);
    const [selectedCountryType, setSelectedCountryType] = useState(offenderData.selectedCountryType);
    const [selectedNationalityType, setSelectedNationalityType] = useState(offenderData.selectedNationalityType);
    const [dateOfBirth, setDateOfBirth] = useState(offenderData.dateOfBirth);
    const [openDateOfBirth, setOpenDateOfBirth] = useState(false);
    const handleOpenDateOfBirth = () => { setOpenDateOfBirth(true); };

    const [offences, setOffences] = useState(offenderData.offences);
    const [selectedOffence, setSelectedOffence] = useState(null);
    const [showOffenceModal, setShowOffenceModal] = useState(false);  

    const validateForm = () => {
        // if (!name) {
        //     Alert.alert('Validation Error', `Please enter Name for Offender ${index + 1}.`);
        //     return false;
        // }

        if (!selectedInvolvementType) {
            Alert.alert('Validation Error', `Please select Offender Involvement for Offender ${index + 1}.`);
            return false;
        }

        if (!selectedIdType) {
            Alert.alert('Validation Error', `Please select ID Type for Offender ${index + 1}.`);
            return false;
        }

        if (!idNo){
            Alert.alert('Validation Error', `Please enter ID Number for Offender ${index + 1}.`);
            return false;
        }
        
        if (!validateIdNo(selectedIdType, idNo)) {
            Alert.alert('Validation Error', `Invalid ID Number for Offender ${index + 1}.`);
            return false;
        }

        if ( selectedIdType === 4 || selectedIdType === '4' ){
            if (!selectedCountryType){
                Alert.alert('Validation Error', `Please select Birth Country for Offender ${index + 1}.`);
                return false;
            }
            if (!selectedNationalityType){
                Alert.alert('Validation Error', `Please select Nationality for Offender ${index + 1}.`);
                return false;
            }
        }

        if (dateOfBirth){
            if (validateDateIsFutureDate(dateOfBirth)){
                Alert.alert('Validation Error', `Date of Birth cannot be future date for Offender ${index + 1}.`);
                return false;
            }
        }

        if (!toggleSameAddress){
            if (!selectedAddressType){
                Alert.alert('Validation Error', `Please select Address Type for Offender ${index + 1}.`);
                return false;
            }
            if (!block){
                Alert.alert('Validation Error', `Please enter Block/House No. for Offender ${index + 1}.`);
                return false;
            }
            if (!street){
                Alert.alert('Validation Error', `Please enter Street for Offender ${index + 1}.`);
                return false;
            }
            if (!floor){
                Alert.alert('Validation Error', `Please enter Floor for Offender ${index + 1}.`);
                return false;
            }
            if (!unitNo){
                Alert.alert('Validation Error', `Please enter Unit No. for Offender ${index + 1}.`);
                return false;
            }
            if (!postalCode){
                Alert.alert('Validation Error', `Please enter Postal Code for Offender ${index + 1}.`);
                return false;
            }
        }

        //validate offences, date/time selected??
        console.log('validateForm offences' , offences);
        
        for (let i = 0; i < offences.length; i++) {
            const element = offences[i];
            console.log('each offence', element);
            if (!element.offenceDate || element.offenceDate == '') {
                console.log('invalid offenceDate');
                Alert.alert('Validation Error', `Please select Offence Date & Time for Offender ${index + 1}.`);
                return false;  
            }
        }

        return true;
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

    const handleSelectOffence = (offence) => {
        console.log('handleSelectOffence offence' , offence);
        console.log('handleSelectOffence offences' , offences);
    
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
    
        console.log('offences' , offences);
    };

    const handleRemoveOffence = (id, index) => {
        const newOffenceList = offences.filter((_, i) => i !== index);
        setOffences(newOffenceList);

        Offences.deleteOffences(DatabaseService.db, id)
        .then(() => {
            console.log(`Offence with ID ${id} deleted from the database.`);
        })
        .catch(error => {
            console.log(`Error deleting offence with ID ${id} from the database:`, error);
        });
    };
    
    const confirmDelete = (id, index) => {
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
                    onPress: () => handleRemoveOffence(id, index),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const renderOffenceModal = () => (
        <OffenceModal
            visible={showOffenceModal}
            onClose={() => setShowOffenceModal(false)}
            onSelectOffence={handleSelectOffence}
            offence={selectedOffence}
            isVehicle={false}
        />
    );

    const renderOffences = ({ item, index }) => (
        <View style={styles.OffenceFrameRow} >
            <TouchableOpacity style={styles.OffenceDescContainer} onPress={() => handleEdit(item)}>
                <Text style={styles.LabelNormal}>{item.selectedOffence?.caption}</Text>
            </TouchableOpacity>
            <View style={styles.OffenceActionsContainer}>
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginRight: 35 }}
                    onPress={() => confirmDelete(item.id, index)}>
                    <Image style={{ width: 17, height: 20, alignSelf: 'center' }}  source={require('../../assets/icon/delete-red.png')} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginRight: 10 }}
                    onPress={() => handleEdit(item)}>
                    <Image style={{ width: 18, height: 18, alignSelf: 'center' }}  source={require('../../assets/icon/edit.png')} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.ContainerWhiteBG}>
            <SafeAreaView>
                <View style={styles.AccordionFrame}>
                    {renderOffenceModal()}
                    <View style={styles.PedestrianContainerWhite} >
                        <TouchableOpacity onPress={toggleSectionOffender}>
                            <Text style={styles.AccordionHeader} >
                                Offender {index + 1} {' '}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: 'center', alignSelf: 'flex-end' }}>
                            <TouchableOpacity 
                                style={{ flexDirection: "row", justifyContent: 'center' }} 
                                onPress={() => onRemoveOffender(offenderData.id)}>
                                <Text style={[styles.DeleteFont]}>Delete</Text>
                                <Image style={{ width: 13, height: 15 }}  source={require('../../assets/icon/delete-red.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{ flexDirection: "row", alignItems: 'center' }}
                                onPress={toggleSectionOffender}>
                                <Text style={[styles.ViewFont, { marginRight: 5, marginLeft: 20, alignSelf: 'center' }]}>View</Text>
                                {expandedSectionOffender ? (
                                    <Image source={require('../../assets/icon/arrow-up.png')}/>
                                ) : (
                                    <Image source={require('../../assets/icon/arrow-down.png')}/>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    { expandedSectionOffender && (
                    <View style={styles.ContainerGreyBG}>
                        <OffenderIdentity
                            styles={styles}
                            toggleSection={toggleSection} 
                            expandedSection={expandedSection} 
                            name={name}
                            setName={setName}
                            idNo={idNo}
                            setIdNo={setIdNo}
                            contact1={contact1}
                            setContact1={setContact1}
                            contact2={contact2}
                            setContact2={setContact2}
                            remarks={remarks}
                            setRemarks={setRemarks}
                            selectedIdType={selectedIdType}
                            setSelectedIdType={setSelectedIdType}
                            selectedInvolvementType={selectedInvolvementType}
                            setSelectedInvolvementType={setSelectedInvolvementType}
                            selectedCountryType={selectedCountryType}
                            setSelectedCountryType={setSelectedCountryType}
                            selectedNationalityType={selectedNationalityType}
                            setSelectedNationalityType={setSelectedNationalityType}
                            dateOfBirth={dateOfBirth}
                            setDateOfBirth={setDateOfBirth}
                            openDateOfBirth={openDateOfBirth} 
                            setOpenDateOfBirth={setOpenDateOfBirth}
                            handleOpenDateOfBirth={handleOpenDateOfBirth}
                            age={age}
                            setAge={setAge}
                            selectedSex={selectedSex}
                            handleSexRadioButtonChange={setSelectedSex}
                        />
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

                        <View style={styles.PedestrianContainerLessPad}>
                            <Text style={styles.SubAccordionHeader}> Offence List ({offences? offences.length : 0})</Text>
                            <TouchableOpacity style={[styles.MainButtonStyle3, { marginRight: 15 }]} onPress={() => handleAdd()}>
                            <Text style={styles.Add}>Add</Text>
                            <Image
                                source={require('../../assets/icon/add-white.png')}
                                style={{ width: 12, height: 12, alignSelf: "center" }}
                            />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            style={{height: '75%'}}
                            data={offences}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderOffences}
                        />
                    </View>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
});

export default Offender;