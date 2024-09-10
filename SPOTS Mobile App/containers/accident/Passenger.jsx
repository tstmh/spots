import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, Image, View, Text, Alert, SafeAreaView } from 'react-native';
import styles from '../../components/spots-styles';
import Address from '../common/Address';
import Treatment from '../common/Treatment';
import { validateIdNo } from '../../utils/Validator';
import PassengerIdentity from '../common/PassengerIdentity';

const Passenger = forwardRef(({ index, passengerData, onRemovePassenger }, ref) => {

    useImperativeHandle(ref, () => ({
        validateForm() {
            return validateForm();
        },
        getForm() {
            const data = {
                id: passengerData.id,
                registrationNo: passengerData.registrationNo,
                sequence: passengerData.sequence,

                pedestrianName: name,
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
                ambulanceNo: ambulanceNo,
                aoIdentity: aoIdentity,
                others: others,
                
                selectedInvolvementType: selectedInvolvementType,
                selectedIdType: selectedIdType,
                selectedCountryType: selectedCountryType,
                selectedNationalityType: selectedNationalityType,
                selectedSex: selectedSex,
                selectedAddressType: selectedAddressType,
                selectedHospital: selectedHospital,
                dateOfBirth: dateOfBirth,
                ambulanceArrivalTime: ambulanceArrivalTime,
                ambulanceDepartureTime: ambulanceDepartureTime
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

    const [name, setName] = useState(passengerData.pedestrianName);
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

    const [ambulanceNo, setAmbulanceNo] = useState(passengerData.ambulanceNo);
    const [aoIdentity, setAoIdentity] = useState(passengerData.aoIdentity);
    const [others, setOthers] = useState(passengerData.others);
    
    const [selectedInvolvementType, setSelectedInvolvementType] = useState(passengerData.selectedInvolvementType);
    const [selectedIdType, setSelectedIdType] = useState(passengerData.selectedIdType);
    const [selectedCountryType, setSelectedCountryType] = useState(passengerData.selectedCountryType);
    const [selectedNationalityType, setSelectedNationalityType] = useState(passengerData.selectedNationalityType);
    const [selectedSex, setSelectedSex] = useState(passengerData.selectedSex);
    const [selectedAddressType, setSelectedAddressType] = useState(passengerData.selectedAddressType);
    const [selectedHospital, setSelectedHospital] = useState(passengerData.selectedHospital);
    const [dateOfBirth, setDateOfBirth] = useState(passengerData.dateOfBirth);
    const [ambulanceArrivalTime, setAmbulanceArrivalTime] = useState(passengerData.ambulanceArrivalTime);
    const [ambulanceDepartureTime, setAmbulanceDepartureTime] = useState(passengerData.ambulanceDepartureTime);

    const [openDateOfBirth, setOpenDateOfBirth] = useState(false);
    const [openAmbulanceArrivalTime, setOpenAmbulanceArrivalTime] = useState(false);
    const [openAmbulanceDepartureTime, setOpenAmbulanceDepartureTime] = useState(false);
    const handleOpenDateOfBirth = () => { setOpenDateOfBirth(true); };
    const handleOpenAmbulanceArrivalTime = () => { setOpenAmbulanceArrivalTime(true); };
    const handleOpenAmbulanceDepartureTime = () => { setOpenAmbulanceDepartureTime(true); };

    const validateForm = () => {

        if (!selectedIdType) {
            Alert.alert('Validation Error', `Please select ID Type for Passenger ${index + 1}.`);
            return false;
        }
        
        if (!validateIdNo(selectedIdType, idNo)) {
            Alert.alert('Validation Error', `Invalid ID Number for Passenger ${index + 1}.`);
            return false;
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
    };

    return (
        <View style={styles.ContainerWhiteBG}>
            <SafeAreaView>
                <View style={styles.AccordionFrame}>
                    <View style={styles.PedestrianContainerWhite} >
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
                            hasInjury={true}
                            injury={injury}
                            setInjury={setInjury}
                            remarks={remarks}
                            setRemarks={setRemarks}
                            selectedIdType={selectedIdType}
                            setSelectedIdType={setSelectedIdType}
                            selectedCountryType={selectedCountryType}
                            setSelectedCountryType={setSelectedCountryType}
                            selectedNationalityType={selectedNationalityType}
                            setSelectedNationalityType={setSelectedNationalityType}
                            selectedInvolvementType={selectedInvolvementType}
                            setSelectedInvolvementType={setSelectedInvolvementType}
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
                            ambulanceArrivalTime={ambulanceArrivalTime}
                            setAmbulanceArrivalTime={setAmbulanceArrivalTime}
                            openAmbulanceArrivalTime={openAmbulanceArrivalTime}
                            setOpenAmbulanceArrivalTime={setOpenAmbulanceArrivalTime}
                            handleOpenAmbulanceArrivalTime={handleOpenAmbulanceArrivalTime}
                            ambulanceDepartureTime={ambulanceDepartureTime}
                            setAmbulanceDepartureTime={setAmbulanceDepartureTime}
                            openAmbulanceDepartureTime={openAmbulanceDepartureTime}
                            setOpenAmbulanceDepartureTime={setOpenAmbulanceDepartureTime}
                            handleOpenAmbulanceDepartureTime={handleOpenAmbulanceDepartureTime}
                        />
                    </View>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
});

export default Passenger;