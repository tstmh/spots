import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, Text, TextInput,Alert, ToastAndroid } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import CheckBox from '@react-native-community/checkbox';
import { RadioButton } from 'react-native-paper';
import styles from '../../components/spots-styles';
import WhiteButton from '../../components/common/WhiteButton';
import BlueButton from '../../components/common/BlueButton';
import TIMSVehicleType from '../../models/TIMSVehicleType';
import TIMSVehicleColor from '../../models/TIMSVehicleColor';
import TIMSVehicleMake from '../../models/TIMSVehicleMake';
import SystemCode from '../../models/SystemCode';
import { validateRegNo } from '../../utils/Validator';

const VehiclesDetails = forwardRef(({ navigation, vehicle, saveVehicle, saveRecord }, ref) => {

    const [registrationNo, setRegistrationNo] = useState('');
    const [selectedVehicleType, setSelectedVehicleType] = useState(null);
    const [selectedVehicleCategory, setSelectedVehicleCategory] = useState(null);
    const [toggleLocalVehCheckBox, setToggleLocalVehCheckBox] = useState(true);
    const [toggleSpecialPlateCheckBox, setToggleSpecialPlateCheckBox] = useState(false);
    const [selectedVehicleMake, setSelectedVehicleMake] = useState(null);
    const [vehicleModel, setVehicleModel] = useState('');
    const [selectedVehicleColor, setSelectedVehicleColor] = useState(null);
    const [vehicleColorOthers, setVehicleColorOthers] = useState("");
    const [vehicleOnFire, setVehicleOnFire] = useState(null);
    const [remarks, setRemarks] = useState('');

    // Expose the validate function
    React.useImperativeHandle(ref, () => ({
        validate: async () => await handleSave(false),
    }));

    useEffect(() => {
        if (vehicle) {
            console.log('updating vehicle');
            setRegistrationNo(vehicle.registrationNo || '');
            setSelectedVehicleType(vehicle.selectedVehicleType || null);
            setSelectedVehicleCategory(vehicle.selectedVehicleCategory || null);
            setToggleLocalVehCheckBox(vehicle.toggleLocalVehCheckBox || false);
            setToggleSpecialPlateCheckBox(vehicle.toggleSpecialPlateCheckBox || false);
            setSelectedVehicleMake(vehicle.selectedVehicleMake || null);
            setVehicleModel(vehicle.vehicleModel || '');
            setSelectedVehicleColor(vehicle.selectedVehicleColor || null);
            setVehicleColorOthers(vehicle.vehicleColorOthers || "");
            setVehicleOnFire(vehicle.vehicleOnFire !== undefined ? vehicle.vehicleOnFire : null);
            setRemarks(vehicle.remarks || '');
        }
    }, [vehicle]);

    // Fetch ddl options from SQLite database
    useEffect(() => {
        setVehicleTypeList(TIMSVehicleType.timsVehicleType);
        setVehicleMakeList(TIMSVehicleMake.timsVehicleMake);
        setVehicleColorList(TIMSVehicleColor.timsVehicleColor); 
        setVehicleCategoryList(SystemCode.vehicleCategory);
    }, []);

    const [vehicleTypeList, setVehicleTypeList] = useState([]);
    const [vehicleCategoryList, setVehicleCategoryList] = useState([]);
    const [vehicleMakeList, setVehicleMakeList] = useState([]);
    const [vehicleColorList, setVehicleColorList] = useState([]);
    const handleRadioButtonChange = (value) => { setVehicleOnFire(value); };

    const validateForm = () => {
        if (!registrationNo) {
            Alert.alert('Validation Error', `Please enter Registration No.`);
            return false;
        }

        if (toggleLocalVehCheckBox  && !toggleSpecialPlateCheckBox){
            if (!validateRegNo(registrationNo)) {
                Alert.alert('Validation Error', `Invalid Registration Number.`);
                return false;
            }
        }
        
        return true;
    };

    const handleSave = async (isBackToList = false) => {

        if (!validateForm()){
            return false;
        }

        const updatedVehicle = {
            ...vehicle,
            registrationNo,
            selectedVehicleType,
            selectedVehicleCategory,
            toggleLocalVehCheckBox,
            toggleSpecialPlateCheckBox,
            selectedVehicleMake,
            vehicleModel,
            selectedVehicleColor,
            vehicleColorOthers,
            vehicleOnFire,
            remarks
        };

        console.log('updatedVehicle', updatedVehicle);

        if (isBackToList) {
            saveRecord(updatedVehicle);
        } else {
            saveVehicle(updatedVehicle);
        }
        return true;
    };

    return (
        <View style={styles.ContainerGreyBG}>
            <View style={styles.ComponentFrame}>

                <View style={styles.FullFrame}>
                </View>
                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> Registration No.</Text>
                            <Text style={styles.LabelImpt}> (*)</Text>
                        </Text>
                        <TextInput
                            style={styles.RoundedTextInputWhiteFont}
                            autoCapitalize='characters'
                            value={registrationNo}
                            onChangeText={setRegistrationNo}
                            maxLength={66}
                        />
                    </View>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}>Vehicle Type </Text>
                            <Text style={styles.LabelImpt}>(*)</Text>
                        </Text>
                        <Dropdown
                            style={styles.DropdownRoundedTextInputFont}
                            placeholderStyle={styles.Placeholder}
                            selectedTextStyle={styles.Placeholder}
                            itemTextStyle={styles.Placeholder}
                            search
                            labelField="label"
                            valueField="value"
                            placeholder="Select item"
                            searchPlaceholder="Search..."
                            data={vehicleTypeList}
                            value={selectedVehicleType}
                            onChange={item => {
                                setSelectedVehicleType(item.value);
                            }}
                        />
                    </View>
                </View>

                <View style={styles.FrameRow}>
                    <CheckBox
                        disabled={false}
                        value={toggleLocalVehCheckBox}
                        onValueChange={setToggleLocalVehCheckBox}
                        tintColors={{ true: 'rgba(9,62,160,1)', false: 'rgba(9,62,160,1)' }}
                        style={{marginLeft: 8}}
                    />
                    <Text style={[styles.LabelNormal, {alignItems:'center'}]}>Local Vehicle (Uncheck if Other Vehicle) </Text>
                </View>

                <View style={styles.FrameRow}>
                    <CheckBox
                        disabled={false}
                        value={toggleSpecialPlateCheckBox}
                        onValueChange={setToggleSpecialPlateCheckBox}
                        tintColors={{ true: 'rgba(9,62,160,1)', false: 'rgba(9,62,160,1)' }}
                        style={{marginLeft: 8}}
                    />
                    <Text style={[styles.LabelNormal, {alignItems:'center'}]}>Special/Foreign/Partial Plate Vehicle Number </Text>
                </View>

                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text style={styles.Label}>Vehicle Make </Text>
                        <Dropdown
                            style={styles.DropdownRoundedTextInputFont}
                            placeholderStyle={styles.Placeholder}
                            selectedTextStyle={styles.Placeholder}
                            itemTextStyle={styles.Placeholder}
                            search
                            labelField="label"
                            valueField="value"
                            placeholder="Select item"
                            searchPlaceholder="Search..."
                            data={vehicleMakeList}
                            value={selectedVehicleMake}
                            onChange={item => {
                                setSelectedVehicleMake(item.value);
                            }}
                        />
                    </View>
                    <View style={styles.HalfFrameContainer}>
                        <Text style={styles.Label}>Vehicle Model </Text>
                        <TextInput
                            style={styles.RoundedTextInputWhiteFont}
                            value={vehicleModel}
                            onChangeText={setVehicleModel}
                        />
                    </View>
                </View>

                <View style={styles.FrameRow}>
                    <View style={selectedVehicleColor === '99' ? styles.HalfFrameContainer : styles.FullFrame}>
                        <Text style={styles.Label}>Vehicle Color </Text>
                        <Dropdown
                            style={styles.DropdownRoundedTextInputFont}
                            placeholderStyle={styles.Placeholder}
                            selectedTextStyle={styles.Placeholder}
                            itemTextStyle={styles.Placeholder}
                            search
                            labelField="label"
                            valueField="value"
                            placeholder="Select item"
                            searchPlaceholder="Search..."
                            data={vehicleColorList}
                            value={selectedVehicleColor}
                            onChange={item => {
                                setSelectedVehicleColor(item.value);
                            }}
                        />
                    </View>
                    {selectedVehicleColor === '99' ? (
                        <View style={styles.HalfFrameContainer}>
                            <Text style={styles.Label}>Vehicle Color (For Others) </Text>
                            <TextInput
                                style={styles.RoundedTextInputWhiteFont}
                                value={vehicleColorOthers}
                                editable={selectedVehicleColor === '99'}
                                onChangeText={setVehicleColorOthers}
                                maxLength={20}
                            />
                        </View>
                    ) : null}
                </View>

                <View style={styles.FrameRow}>
                    <Text style={[styles.Label, {marginLeft: 13}]}>Did the vehicle catch fire? </Text>
                    <View style={styles.RadioButtonContainer}>
                        <RadioButton.Android
                            value={true} 
                            status={vehicleOnFire == true ? 'checked' : 'unchecked'} 
                            onPress={() => handleRadioButtonChange(true)} 
                            color="#00163E"
                        />
                        <Text style={styles.RadioButtonText}> Yes </Text>
                    </View>
                    <View style={styles.RadioButtonContainer}>
                        <RadioButton.Android
                            value={false} 
                            status={vehicleOnFire == false ? 'checked' : 'unchecked'} 
                            onPress={() => handleRadioButtonChange(false)} 
                            color="#00163E"
                        />
                        <Text style={styles.RadioButtonText}> No </Text>
                    </View>
                </View>
                
                <View style={styles.FullFrame}>
                    <Text >
                        <Text style={styles.Label}> Remarks (255 Characters)</Text>
                    </Text>
                    <View style={styles.TextInputWrapper}>
                        <TextInput
                            style={styles.RoundedLongTextInputMediumWhiteFont}
                            multiline
                            editable
                            textAlignVertical="top"
                            onChangeText={(text) => setRemarks(text)}
                            maxLength={255}
                            value={remarks}
                        />
                        <Text style={styles.CharCounter}>{remarks.length}/255</Text>
                    </View>
                </View> 

                <View style={styles.FullFrame}>
                    <View style={styles.MarginContainerXSmall} />
                    <WhiteButton title="SAVE AS DRAFT" customClick={() => handleSave(false)} />
                    <View style={styles.MarginContainerXSmall} />
                    <BlueButton title="BACK TO LIST" customClick={() => handleSave(true)} />
                </View>
            </View>
            <View style={{height: 125}} />
        </View>
    );
});

export default VehiclesDetails;