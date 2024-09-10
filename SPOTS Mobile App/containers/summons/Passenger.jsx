import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, Image, View, Text, Alert, SafeAreaView, FlatList } from 'react-native';
import styles from '../../components/spots-styles';
import PassengerIdentity from '../common/PassengerIdentity';
import Address from '../common/Address';
import OffenceModal from '../common/OffenceDetailsModal';
import { validateDateIsFutureDate, validateIdNo } from '../../utils/Validator';

const Passenger = forwardRef(({ index, passengerData, onRemovePassenger }, ref) => {

    useImperativeHandle(ref, () => ({
        validateForm() {
            return validateForm();
        },
        getForm() {
            const data = {
                id: passengerData.id,
                registrationNo: passengerData.registrationNo? passengerData.registrationNo : '',
                sequence: passengerData.sequence? passengerData.sequence : '',

                name: name,
                idNo: idNo,
                contact1: contact1,
                contact2: contact2,
                injury: injury,
                remarks: remarks,
                block: block,
                street: street,
                floor: floor,
                unitNo: unitNo,
                buildingName: buildingName,
                postalCode: postalCode,
                addressRemarks: addressRemarks,
                toggleSameAddress: toggleSameAddress,
                
                selectedIdType: selectedIdType,
                selectedSex: selectedSex,
                selectedAddressType: selectedAddressType,
                selectedInvolvementType: selectedInvolvementType,
                selectedCountryType: selectedCountryType,
                selectedNationalityType: selectedNationalityType,
                dateOfBirth: dateOfBirth,

                offences: offences
            }

            return data;
        }
    }));

    const [expandedSectionPassenger, setExpandedSectionPassenger] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    
    const toggleSection = (sectionNumber) => {
        setExpandedSection(sectionNumber === expandedSection ? null : sectionNumber);
    };
    const toggleSectionPassenger = () => {
        setExpandedSectionPassenger(!expandedSectionPassenger);
    };

    const [name, setName] = useState(passengerData.name);
    const [idNo, setIdNo] = useState(passengerData.idNo);
    const [contact1, setContact1] = useState(passengerData.contact1);
    const [contact2, setContact2] = useState(passengerData.contact2);
    const [injury, setInjury] = useState(passengerData.injury);
    const [remarks, setRemarks] = useState(passengerData.remarks);
    const [age, setAge] = useState(passengerData.age);

    const [block, setBlock] = useState(passengerData.block);
    const [street, setStreet] = useState(passengerData.street);
    const [floor, setFloor] = useState(passengerData.floor);
    const [unitNo, setUnitNo] = useState(passengerData.unitNo);
    const [buildingName, setBuildingName] = useState(passengerData.buildingName);
    const [postalCode, setPostalCode] = useState(passengerData.postalCode);
    const [addressRemarks, setAddressRemarks] = useState(passengerData.addressRemarks);
    const [toggleSameAddress, setToggleSameAddress] = useState(passengerData.toggleSameAddress);
    
    const [selectedIdType, setSelectedIdType] = useState(passengerData.selectedIdType);
    const [selectedSex, setSelectedSex] = useState(passengerData.selectedSex);
    const [selectedAddressType, setSelectedAddressType] = useState(passengerData.selectedAddressType);
    const [selectedInvolvementType, setSelectedInvolvementType] = useState(passengerData.selectedInvolvementType);
    const [selectedCountryType, setSelectedCountryType] = useState(passengerData.selectedCountryType);
    const [selectedNationalityType, setSelectedNationalityType] = useState(passengerData.selectedNationalityType);
    
    const [dateOfBirth, setDateOfBirth] = useState(passengerData.dateOfBirth);
    const [openDateOfBirth, setOpenDateOfBirth] = useState(false);
    const handleOpenDateOfBirth = () => { setOpenDateOfBirth(true); };

    const [offences, setOffences] = useState(passengerData.offences || []);
    const [selectedOffence, setSelectedOffence] = useState(null);
    const [showOffenceModal, setShowOffenceModal] = useState(false);  

    const validateForm = () => {
        // if (!name) {
        //     Alert.alert('Validation Error', `Please enter Name for Passenger ${index + 1}.`);
        //     return false;
        // }

        if (!selectedIdType) {
            Alert.alert('Validation Error', `Please select ID Type for Passenger ${index + 1}.`);
            return false;
        }

        if (!idNo) {
            Alert.alert('Validation Error', `Please enter ID No. for Passenger ${index + 1}.`);
            return false;
        }
        
        if (!validateIdNo(selectedIdType, idNo)) {
            Alert.alert('Validation Error', `Invalid ID Number for Passenger ${index + 1}.`);
            return false;
        }

        if (!selectedInvolvementType){
            Alert.alert('Validation Error', `Please select Involvement for Passenger ${index + 1}.`);
            return false;
        }

        if ( selectedIdType === 4 || selectedIdType === '4' ){
            if (!selectedCountryType){
                Alert.alert('Validation Error', `Please select Birth Country for Passenger ${index + 1}.`);
                return false;
            }
            if (!selectedNationalityType){
                Alert.alert('Validation Error', `Please select Nationality for Passenger ${index + 1}.`);
                return false;
            }
        }

        if (dateOfBirth){
            if (validateDateIsFutureDate(dateOfBirth)){
                Alert.alert('Validation Error', `Date of Birth cannot be future date for Passenger ${index + 1}.`);
                return false;
            }
        }

        if (!toggleSameAddress){
            if (!selectedAddressType){
                Alert.alert('Validation Error', `Please select Address Type for Passenger ${index + 1}.`);
                return false;
            }
            if (!block){
                Alert.alert('Validation Error', `Please enter Block/House No. for Passenger ${index + 1}.`);
                return false;
            }
            if (!street){
                Alert.alert('Validation Error', `Please enter Street for Passenger ${index + 1}.`);
                return false;
            }
            if (!floor){
                Alert.alert('Validation Error', `Please enter Floor for Passenger ${index + 1}.`);
                return false;
            }
            if (!unitNo){
                Alert.alert('Validation Error', `Please enter Unit No. for Passenger ${index + 1}.`);
                return false;
            }
            if (!postalCode){
                Alert.alert('Validation Error', `Please enter Postal Code for Passenger ${index + 1}.`);
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
        console.log('handleSelectOffence' , offence);
    
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
                    <Image style={{ width: 17, height: 20, alignSelf: 'center' }}  source={require('../../assets/icon/delete-red.png')} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginRight: 10 }}
                    onPress={() => handleEdit(item)}>
                    <Image style={{ width: 17, height: 17, alignSelf: 'center' }}  source={require('../../assets/icon/edit.png')} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.ContainerWhiteBG}>
            <SafeAreaView>
                <View style={styles.AccordionFrame}>
                    {renderOffenceModal()}
                    <View style={styles.PedestrianContainerWhite}>
                        <TouchableOpacity onPress={toggleSectionPassenger}>
                            <Text style={styles.AccordionHeader} >
                                Passenger {index + 1} {' '}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: 'center', alignSelf: 'flex-end' }}>
                            <TouchableOpacity 
                                style={{ flexDirection: "row", justifyContent: 'center' }} 
                                onPress={() => onRemovePassenger(passengerData.id)}>
                                <Text style={[styles.DeleteFont]}>Delete</Text>
                                <Image style={{ width: 13, height: 15 }}  source={require('../../assets/icon/delete-red.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{ flexDirection: "row", alignItems: 'center', marginLeft: 20 }}
                                onPress={toggleSectionPassenger}>
                                <Text style={[styles.ViewFont, { marginRight: 5 }, { alignSelf: 'center' }]}>View</Text>
                                {expandedSectionPassenger ? (
                                    <Image source={require('../../assets/icon/arrow-up.png')}/>
                                ) : (
                                    <Image source={require('../../assets/icon/arrow-down.png')}/>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    { expandedSectionPassenger && (
                    <View style={styles.ContainerGreyBG}>
                        <PassengerIdentity
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
                            hasInjury={false}
                            remarks={remarks}
                            setRemarks={setRemarks}
                            selectedIdType={selectedIdType}
                            setSelectedIdType={setSelectedIdType}
                            dateOfBirth={dateOfBirth}
                            setDateOfBirth={setDateOfBirth}
                            openDateOfBirth={openDateOfBirth} 
                            setOpenDateOfBirth={setOpenDateOfBirth}
                            handleOpenDateOfBirth={handleOpenDateOfBirth}
                            age={age}
                            setAge={setAge}
                            selectedSex={selectedSex}
                            handleSexRadioButtonChange={setSelectedSex}
                            selectedInvolvementType={selectedInvolvementType}
                            setSelectedInvolvementType={setSelectedInvolvementType}
                            selectedCountryType={selectedCountryType}
                            setSelectedCountryType={setSelectedCountryType}
                            selectedNationalityType={selectedNationalityType}
                            setSelectedNationalityType={setSelectedNationalityType}
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

export default Passenger;