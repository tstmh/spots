import React, { useContext, useState, useEffect, useRef, forwardRef } from 'react';
import { TouchableOpacity, Image, View, Text, Alert, SafeAreaView, ToastAndroid } from 'react-native';
import styles from '../../components/spots-styles';
import Passenger from './Passenger';
import WhiteButton from '../../components/common/WhiteButton';
import BlueButton from '../../components/common/BlueButton';
import PartiesInvolved from '../../models/PartiesInvolved';
import { AccidentReportContext } from '../../context/accidentReportContext';
import { formatIntegerValueNotNull, formatIntegerValue, formatDateToString, formatTimeToString } from '../../utils/Formatter';
import DatabaseService from '../../utils/DatabaseService';

const PassengerDetails = forwardRef(({ initialPassengers, addPassenger, removePassenger, hideForm }, ref) => {

    const [updatedPassengers, setUpdatedPassengers] = useState(initialPassengers);
    const { accidentReport } = useContext(AccidentReportContext);
    const passengerRefs = useRef([]);

    // Expose the validate function
    React.useImperativeHandle(ref, () => ({
        validate: async () => await handleSave(false),
    }));

    useEffect(() => {
        console.log("changed initialPassengers! " , initialPassengers);
        setUpdatedPassengers(initialPassengers);
    }, [initialPassengers]);

    const handleSave = async (hide) => {
        console.log("in handleSave, handleBack? ", hide);
        let passengerData = [];

        if (validateAllPassengers()) {
            passengerRefs.current.forEach((ref, index) => {
                console.log("ref > " , ref);
                if (ref) {
                    passengerData.push(ref.getForm());
                }
            });

            console.log('Passenger data:', passengerData);
            savePassengersToDB(passengerData);

            ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);

            if (hide){
                hideForm();
            }

            return true;
        } else {
            return false;
        }
        
    };

    const validateAllPassengers = () => {
        for (const ref of passengerRefs.current) {
            console.log('ref' , ref);
            if (ref) {
                const validation = ref.validateForm();
                console.log('ref valid?' , validation);
                if (!validation) {
                    return false;
                }
            }
        }
        return true;
    };

    const savePassengersToDB = (passengerList) => {
        console.log("savePassengersToDB: passengerList >> ", passengerList);

        passengerList.forEach(passenger => {

            console.log('passenger ' , passenger);

            const passengerToSave = {
                
                ID: passenger.id,
                ACCIDENT_REPORT_ID: accidentReport?.ID || '',
                PERSON_TYPE_ID: 3, // Always 3 for passenger

                /* We need to store the reg_no in passenger so we can identify that this passenger belongs to this reg_no */
                REGISTRATION_NO: passenger.registrationNo,
                VEHICLE_SEQUENCE: passenger.sequence? passenger.sequence : null, 

                NAME: passenger.pedestrianName,
                INVOLVEMENT_ID: formatIntegerValue(passenger.selectedInvolvementType),
                ID_TYPE: formatIntegerValueNotNull(passenger.selectedIdType),
                IDENTIFICATION_NO: passenger.idNo,
                DATE_OF_BIRTH: passenger.dateOfBirth? formatDateToString(passenger.dateOfBirth) : null,
                GENDER_CODE: formatIntegerValue(passenger.selectedSex),
                CONTACT_1: passenger.contact1,
                CONTACT_2: passenger.contact2,
                BIRTH_COUNTRY: passenger.selectedCountryType,
                NATIONALITY: passenger.selectedNationalityType,
                REMARKS_IDENTIFICATION: passenger.remarks,
                REMARKS_DEGREE_INJURY: passenger.injury,

                ADDRESS_TYPE : formatIntegerValue(passenger.selectedAddressType),
                SAME_AS_REGISTERED : (passenger.toggleSameAddress? 1:0),
                BLOCK : passenger.block,
                STREET : passenger.street,
                FLOOR : passenger.floor,
                UNIT_NO : passenger.unitNo,
                BUILDING_NAME : passenger.buildingName,
                POSTAL_CODE : passenger.postalCode,
                REMARKS_ADDRESS : passenger.addressRemarks,

                AMBULANCE_NO : passenger.ambulanceNo,
                AMBULANCE_AO_ID : passenger.aoIdentity,
                AMBULANCE_ARRIVAL : passenger.ambulanceArrivalTime? formatTimeToString(passenger.ambulanceArrivalTime) : null,
                AMBULANCE_DEPARTURE : passenger.ambulanceDepartureTime? formatTimeToString(passenger.ambulanceDepartureTime) : null,
                HOSPITAL_ID : formatIntegerValue(passenger.selectedHospital),
                HOSPITAL_OTHER : passenger.others, 
            };
    
            console.log("passengerToSave >> ", passengerToSave);
            PartiesInvolved.insertPassenger(DatabaseService.db, passengerToSave)
        });
    };

    const handleRemovePassenger = (id) => {
        const index = updatedPassengers.findIndex(p => p.id === id);
        if (index !== -1) {
            removePassenger(id);
        }
    };

    const confirmDelete = (id) => {
        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this passenger?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => handleRemovePassenger(id),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.ContainerWhiteBG}>
            <SafeAreaView>
                <View style={styles.ListComponentFrame}>    
                    <View style={styles.PassengerTitle}>
                        <Text style={styles.VehicleInvolvedTitleFontStyle}>  Passenger List ({updatedPassengers.length})</Text>
                        <TouchableOpacity style={[styles.MainButtonStyle3, {marginRight: 15}]} onPress={addPassenger}>
                            <Text style={styles.Add}>Add</Text>
                            <Image
                                source={require('../../assets/icon/add-white.png')}
                                style={{ width: 12, height: 12, alignSelf:"center" }}
                            />
                        </TouchableOpacity>
                    </View>
                    {updatedPassengers.map((passengerData, index) => (
                        <View 
                            style={styles.ContainerWhiteBG} 
                            key={passengerData.id}>
                            <Passenger 
                                ref={el => passengerRefs.current[index] = el}
                                index={index}
                                passengerData={passengerData}
                                onRemovePassenger={confirmDelete}
                            />
                        </View>
                    ))}
                </View>
                <View style={styles.FullFrame}>
                    <View style={styles.MarginContainerXSmall} />
                    <WhiteButton title="SAVE AS DRAFT" customClick={() => handleSave(false)} />
                    <View style={styles.MarginContainerXSmall} />
                    <BlueButton title="BACK TO LIST" customClick={() => handleSave(true)} />
                </View>
                <View style={{height: 125}} />
            </SafeAreaView>
        </View>
    );
});

export default PassengerDetails;
