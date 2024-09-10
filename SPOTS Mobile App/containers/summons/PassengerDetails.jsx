import React, { useState, useEffect, useContext, useRef, forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput, SafeAreaView, Alert } from 'react-native';
import styles from '../../components/spots-styles';
import WhiteButton from '../../components/common/WhiteButton';
import BlueButton from '../../components/common/BlueButton';
import { SummonsContext } from '../../context/summonsContext';
import Passenger from './Passenger';

const PassengerDetails = forwardRef(({ initialPassengers }, ref) => {
    console.log('PassengerDetails passengerData', initialPassengers);

    const [updatedPassengers, setUpdatedPassengers] = useState(initialPassengers? initialPassengers : []);
    const passengerRefs = useRef([]);

    useImperativeHandle(ref, () => ({
        validateForm() {
            return validateAllPassengers();
        },
        getPassengersData () {
            let passengerData = [];
            passengerRefs.current.forEach((ref, index) => {
                console.log("ref > " , ref);
                if (ref) {
                    passengerData.push(ref.getForm());
                }
            });
            console.log(`returned passengerData ${passengerData.length} >>`, passengerData);
            return passengerData;
        }
    }));
    
    const validateAllPassengers = () => {
        return passengerRefs.current.every(ref => ref.validateForm());
    };

    const handleAddPassenger = () => {
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
            selectedIdType: null,
            selectedAddressType: null,
            selectedInvolvementType: null,
            selectedCountryType: null,
            selectedNationalityType: null,
            toggleSameAddress: false,
            dateOfBirth: null,
            selectedSex: null,
            selectedHospital: null,
            ambulanceArrivalTime: null,
            ambulanceDepartureTime: null,
            offences: []
        };

        setUpdatedPassengers(prevState => [...prevState, newPassenger]);
    };

    const handleRemovePassenger = (id) => {
        console.log('handleRemovePassenger', id);
        setUpdatedPassengers((prevState) => prevState.filter((p) => p.id !== id));
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
                        <Text style={styles.VehicleInvolvedTitleFontStyle}>  Passenger List ({updatedPassengers?.length})</Text>
                        <TouchableOpacity style={[styles.MainButtonStyle3, {marginRight: 15}]} onPress={handleAddPassenger}>
                            <Text style={styles.Add}>Add</Text>
                            <Image
                                source={require('../../assets/icon/add-white.png')}
                                style={{ width: 12, height: 12, alignSelf:"center" }}
                            />
                        </TouchableOpacity>
                    </View>
                    {updatedPassengers.map((updatedPassengers, index) => (
                        <View 
                            style={styles.ContainerWhiteBG} 
                            key={updatedPassengers.id}>
                            <Passenger 
                                ref={el => passengerRefs.current[index] = el}
                                index={index}
                                passengerData={updatedPassengers}
                                onRemovePassenger={confirmDelete}
                            />
                        </View>
                    ))}
                </View>
            </SafeAreaView>
        </View>
    );
});

export default PassengerDetails;
