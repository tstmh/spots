import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, Image, View, Text, Alert, SafeAreaView, FlatList } from 'react-native';
import styles from '../../components/spots-styles';
import VehicleInformation from '../common/VehicleInformation';
import VehicleSpeedingDetails from './VehicleSpeedingDetails';
import OffenceModal from '../common/OffenceDetailsModal';
import Offences from '../../models/Offences';
import DatabaseService from '../../utils/DatabaseService';
import { validateRegNo } from '../../utils/Validator';

const Vehicle = forwardRef(({ index, vehicleData, onRemoveVehicle }, ref) => {

    console.log('vehicleData', vehicleData);
    console.log('vehicleData.offence', vehicleData.offences);

    useImperativeHandle(ref, () => ({
        validateForm() {
            return validateForm();
        },
        getForm() {
            const data = {
                id: vehicleData.id,
                registrationNo: registrationNo,
                selectedOperationType: selectedOperationType,
                selectedVehicleType: selectedVehicleType,
                selectedVehicleCategory: selectedVehicleCategory,
                toggleLocalVehCheckBox: toggleLocalVehCheckBox,
                toggleSpecialPlateCheckBox: toggleSpecialPlateCheckBox,
                selectedVehicleTransmission: selectedVehicleTransmission,
                selectedClass3CEligibility: selectedClass3CEligibility,
                selectedVehicleMake: selectedVehicleMake,
                vehicleUnladenWeight: vehicleUnladenWeight,
                selectedVehicleColor: selectedVehicleColor,
                vehicleColorOthers: vehicleColorOthers,
                
                selectedSpeedDevice: selectedSpeedDevice,
                vehicleSpeedingClocked: vehicleSpeedingClocked,
                vehicleSpeedLimit: vehicleSpeedLimit,
                roadSpeedLimit: roadSpeedLimit,
                selectedSpeedLimiterRequired: selectedSpeedLimiterRequired,
                selectedSpeedLimiterInstalled: selectedSpeedLimiterInstalled,
                selectedSentForInspection: selectedSentForInspection,

                offences: offences
            }
            return data;
        }
    }));

    const [expandedSectionVehicle, setExpandedSectionVehicle] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    
    const toggleSection = (sectionNumber) => {
        setExpandedSection(sectionNumber === expandedSection ? null : sectionNumber);
    };
    const toggleSectionVehicle = () => {
        setExpandedSectionVehicle(!expandedSectionVehicle);
    };

    //Vehicle Information
    const [registrationNo, setRegistrationNo] = useState(vehicleData.registrationNo? vehicleData.registrationNo : '');
    const [selectedOperationType, setSelectedOperationType] = useState(vehicleData.selectedOperationType? vehicleData.selectedOperationType : null);
    const [selectedVehicleType, setSelectedVehicleType] = useState(vehicleData.selectedVehicleType? vehicleData.selectedVehicleType : null);
    const [selectedVehicleMake, setSelectedVehicleMake] = useState(vehicleData.selectedVehicleMake? vehicleData.selectedVehicleMake : null);
    const [selectedVehicleCategory, setSelectedVehicleCategory] = useState(vehicleData.selectedVehicleCategory? vehicleData.selectedVehicleCategory : null);
    const [toggleLocalVehCheckBox, setToggleLocalVehCheckBox] = useState(vehicleData.toggleLocalVehCheckBox? vehicleData.toggleLocalVehCheckBox : false);
    const [toggleSpecialPlateCheckBox, setToggleSpecialPlateCheckBox] = useState(vehicleData.toggleSpecialPlateCheckBox? vehicleData.toggleSpecialPlateCheckBox : false);
    const [selectedVehicleTransmission, setSelectedVehicleTransmission] = useState(vehicleData.selectedVehicleTransmission? vehicleData.selectedVehicleTransmission : null);
    const [selectedClass3CEligibility, setSelectedClass3CEligibility] = useState(vehicleData.selectedClass3CEligibility? vehicleData.selectedClass3CEligibility : null);
    const [vehicleUnladenWeight, setVehicleUnladenWeight] = useState(vehicleData.vehicleUnladenWeight? vehicleData.vehicleUnladenWeight : '');
    const [selectedVehicleColor, setSelectedVehicleColor] = useState(vehicleData.selectedVehicleColor? vehicleData.selectedVehicleColor : null);
    const [vehicleColorOthers, setVehicleColorOthers] = useState(vehicleData.vehicleColorOthers? vehicleData.vehicleColorOthers : '');
    
    //Vehicle Speeding Details
    const [selectedSpeedDevice, setSelectedSpeedDevice] = useState(vehicleData.selectedSpeedDevice? vehicleData.selectedSpeedDevice : null);
    const [vehicleSpeedingClocked, setVehicleSpeedingClocked] = useState(vehicleData.vehicleSpeedingClocked? vehicleData.vehicleSpeedingClocked : '');
    const [vehicleSpeedLimit, setVehicleSpeedLimit] = useState(vehicleData.vehicleSpeedLimit? vehicleData.vehicleSpeedLimit : '');
    const [roadSpeedLimit, setRoadSpeedLimit] = useState(vehicleData.roadSpeedLimit? vehicleData.roadSpeedLimit : '');
    const [selectedSpeedLimiterRequired, setSelectedSpeedLimiterRequired] = useState(vehicleData.selectedSpeedLimiterRequired? vehicleData.selectedSpeedLimiterRequired : null);
    const handleSpeedLimiterRequiredRadioButtonChange = (value) => { setSelectedSpeedLimiterRequired(value); };
    const [selectedSpeedLimiterInstalled, setSelectedSpeedLimiterInstalled] = useState(vehicleData.selectedSpeedLimiterInstalled? vehicleData.selectedSpeedLimiterInstalled : null);
    const handleSpeedLimiterInstalledRadioButtonChange = (value) => { setSelectedSpeedLimiterInstalled(value); };
    const [selectedSentForInspection, setSelectedSentForInspection] = useState(vehicleData.selectedSentForInspection? vehicleData.selectedSentForInspection : null);
    const handleSentForInspectionRadioButtonChange = (value) => { setSelectedSentForInspection(value); };

    //Offences
    const [offences, setOffences] = useState(vehicleData.offences? vehicleData.offences : []);
    const [selectedOffence, setSelectedOffence] = useState(null);
    const [showOffenceModal, setShowOffenceModal] = useState(false);  

    const validateForm = () => {
        if (!registrationNo) {
            Alert.alert('Validation Error', `Please enter Registration for Vehicle ${index + 1}.`);
            return false;
        }

        //validate
        if (toggleLocalVehCheckBox && !toggleSpecialPlateCheckBox){
            if (!validateRegNo(registrationNo)) {
                Alert.alert('Validation Error', `Invalid Registration Number.`);
                return false;
            }
        }

        if (!selectedOperationType) {
            Alert.alert('Validation Error', `Please select Operation Type for Vehicle ${index + 1}.`);
            return false;
        }

        if (!selectedVehicleType) {
            Alert.alert('Validation Error', `Please select Vehicle Type for Vehicle ${index + 1}.`);
            return false;
        }

        //TODO fnCheckSpeedingOffence

        //validate offences, date/time selected??
        console.log('validateForm offences' , offences);
        for (let i = 0; i < offences.length; i++) {
            const element = offences[i];
            console.log('each offence', element);
            if (!element.offenceDate || element.offenceDate == '') {
                console.log('invalid offenceDate');
                Alert.alert('Validation Error', `Please select Offence Date & Time for Vehicle ${index + 1}.`);
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

        Offences.deleteOffences(DatabaseService.db, id);
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
            isVehicle={true}
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
                    <View style={styles.PedestrianContainerWhite} >
                        <TouchableOpacity onPress={toggleSectionVehicle}>
                            <Text style={styles.AccordionHeader} >
                                Vehicle {index + 1} {' '}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: 'center', alignSelf: 'flex-end' }}>
                            <TouchableOpacity 
                                style={{ flexDirection: "row", justifyContent: 'center' }} 
                                onPress={() => onRemoveVehicle(vehicleData.id)}>
                                <Text style={[styles.DeleteFont]}>Delete</Text>
                                <Image style={{ width: 13, height: 15 }}  source={require('../../assets/icon/delete-red.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{ flexDirection: "row", alignItems: 'center' }}
                                onPress={toggleSectionVehicle}>
                                <Text style={[styles.ViewFont, { marginRight: 5, marginLeft: 20, alignSelf: 'center' }]}>View</Text>
                                {expandedSectionVehicle ? (
                                    <Image source={require('../../assets/icon/arrow-up.png')}/>
                                ) : (
                                    <Image source={require('../../assets/icon/arrow-down.png')}/>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    { expandedSectionVehicle && (
                    <View style={styles.ContainerGreyBG}>
                        <VehicleInformation
                            styles={styles}
                            toggleSection={toggleSection} 
                            expandedSection={expandedSection} 
                            registrationNo={registrationNo}
                            setRegistrationNo={setRegistrationNo}
                            selectedOperationType={selectedOperationType}
                            setSelectedOperationType={setSelectedOperationType}
                            selectedVehicleType={selectedVehicleType}
                            setSelectedVehicleType={setSelectedVehicleType}
                            selectedVehicleCategory={selectedVehicleCategory}
                            setSelectedVehicleCategory={setSelectedVehicleCategory}
                            toggleLocalVehCheckBox={toggleLocalVehCheckBox}
                            setToggleLocalVehCheckBox={setToggleLocalVehCheckBox}
                            toggleSpecialPlateCheckBox={toggleSpecialPlateCheckBox}
                            setToggleSpecialPlateCheckBox={setToggleSpecialPlateCheckBox}
                            selectedVehicleTransmission={selectedVehicleTransmission}
                            setSelectedVehicleTransmission={setSelectedVehicleTransmission}
                            selectedClass3CEligibility={selectedClass3CEligibility}
                            setSelectedClass3CEligibility={setSelectedClass3CEligibility}
                            selectedVehicleMake={selectedVehicleMake}
                            setSelectedVehicleMake={setSelectedVehicleMake}
                            vehicleUnladenWeight={vehicleUnladenWeight}
                            setVehicleUnladenWeight={setVehicleUnladenWeight}
                            selectedVehicleColor={selectedVehicleColor}
                            setSelectedVehicleColor={setSelectedVehicleColor}
                            vehicleColorOthers={vehicleColorOthers}
                            setVehicleColorOthers={setVehicleColorOthers}
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

export default Vehicle;