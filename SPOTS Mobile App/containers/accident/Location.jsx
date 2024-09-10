import React, { useState, useEffect, useContext, forwardRef} from 'react';
import { View, Text, TextInput, SafeAreaView, Alert, ToastAndroid } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { RadioButton } from 'react-native-paper';
import WhiteButton from '../../components/common/WhiteButton';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import styles from '../../components/spots-styles';
import AccidentReport from '../../models/AccidentReport';
import SystemCode from '../../models/SystemCode';
import TIMSLocationCode from '../../models/TIMSLocationCode';
import { formatIntegerValue } from '../../utils/Formatter';
import DatabaseService from '../../utils/DatabaseService';
import { AccidentReportContext } from '../../context/accidentReportContext';

const Location = forwardRef((props, ref) => {
    const { accidentReport, updateAccidentReport } = useContext(AccidentReportContext);

     // Expose the validate function
    React.useImperativeHandle(ref, () => ({
        validate: save_as_draft,
    }));

    useEffect(() => {
        setIncidentOccuredData(SystemCode.incidentOccured);
        setRoad1List(TIMSLocationCode.timsLocationCode);
        setRoad2List(TIMSLocationCode.timsLocationCode);

        if (accidentReport && accidentReport.INCIDENT_OCCURED) {
            setSelectedIncidentOccured(accidentReport.INCIDENT_OCCURED.toString());
        }
    }, [accidentReport]);

    const [selectedSpecialZoneValue, setSelectedSpecialZoneValue] = useState(accidentReport.SPECIAL_ZONE || 0);
    const [incidentOccuredData, setIncidentOccuredData] = useState([]);
    const [selectedIncidentOccured, setSelectedIncidentOccured] = useState(accidentReport.INCIDENT_OCCURED || '1');
    const [road1List, setRoad1List] = useState([]);
    const [selectedRoad1, setSelectedRoad1] = useState(accidentReport.LOCATION_CODE || '');
    const [road2List, setRoad2List] = useState([]);
    const [selectedRoad2, setSelectedRoad2] = useState(accidentReport.LOCATION_CODE_2 || '');

    //save as draft
    const [remarks, setRemarks] = useState(accidentReport.REMARKS_LOCATION || '');
    const [schoolName, setSchoolName] = useState(accidentReport.SCHOOL_NAME || '');

    const save_as_draft = async () => {
        if (!selectedIncidentOccured) {
            Alert.alert('Validation Error', 'Please select Incident Occurred');
            return false;
        }

        if (!selectedRoad1) {
            Alert.alert('Validation Error', 'Please select Road 1');
            return false;
        }

        if (selectedIncidentOccured === '2' || selectedIncidentOccured === '3' || selectedIncidentOccured === '4') {
            if (!selectedRoad2) {
                Alert.alert('Validation Error', 'Please select Road 2');
                return false;
            };
        }

        if (selectedSpecialZoneValue === 2 || selectedSpecialZoneValue === 3) {
            if (!schoolName) {
                Alert.alert('Validation Error', 'Please enter School Name');
                return false;
            };
        }

        const updatedReport = {
            ...accidentReport,
            INCIDENT_OCCURED: formatIntegerValue(selectedIncidentOccured),
            SPECIAL_ZONE: selectedSpecialZoneValue,
            LOCATION_CODE: selectedRoad1,
            LOCATION_CODE_2: selectedRoad2,
            REMARKS_LOCATION: remarks,
            SCHOOL_NAME: schoolName,
        };

        console.log("start saving Location ", updatedReport);
        AccidentReport.insert(DatabaseService.db, updatedReport);
        updateAccidentReport(updatedReport);
        ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
        return true;
    };

    return (
        <View style={styles.ContainerWhiteBG}>
            <SafeAreaView>
                <View style={[styles.ComponentFrame, {marginTop: 15}]}>
                    <View style={[styles.TextInputContainer, {marginBottom: 0, marginTop: 10}]}>
                        <Text style={[styles.Label, {paddingLeft: 5}]}>Special Zone</Text>
                    </View>
                    <View style={styles.Frame2893081}>
                        <View style={styles.RadioButtonContainer}>
                            <RadioButton
                                value="0"
                                status={selectedSpecialZoneValue === 0 ?
                                        'checked' : 'unchecked'}
                                onPress={() => setSelectedSpecialZoneValue(0)}
                                color="#00163E"
                            />
                            <Text style={styles.RadioButtonText}>
                                N/A
                            </Text>
                        </View>
                        <View style={styles.RadioButtonContainer}>
                            <RadioButton
                                value="1"
                                status={selectedSpecialZoneValue === 1 ?
                                        'checked' : 'unchecked'}
                                onPress={() => setSelectedSpecialZoneValue(1)}
                                color="#00163E"
                            />
                            <Text style={styles.RadioButtonText}>
                                Silver Zone
                            </Text>
                        </View>
                        <View style={styles.RadioButtonContainer}>
                            <RadioButton
                                value="2"
                                status={selectedSpecialZoneValue === 2 ?
                                        'checked' : 'unchecked'}
                                onPress={() => setSelectedSpecialZoneValue(2)}
                                color="#00163E"
                            />
                            <Text style={styles.RadioButtonText}>
                                School Zone
                            </Text>
                        </View>
                        <View style={styles.RadioButtonContainer}>
                            <RadioButton
                                value="3"
                                status={selectedSpecialZoneValue === 3 ?
                                        'checked' : 'unchecked'}
                                onPress={() => setSelectedSpecialZoneValue(3)}
                                color="#00163E"
                            />
                            <Text style={styles.RadioButtonText}>
                                School Zone with Flashing Lights on
                            </Text>
                        </View>
                    </View>
                    <View style={styles.FrameTopMargin}>
                        <View style={styles.TextInputContainer}>
                            <Text>
                                <Text style={styles.Label}> Incident Occurred </Text>
                                <Text style={styles.LabelImpt}> (*)</Text>
                            </Text>
                            <Dropdown
                                style={styles.DropdownRoundedTextInputFont}
                                placeholderStyle={styles.Placeholder}
                                selectedTextStyle={styles.Placeholder}
                                itemTextStyle={styles.Placeholder}
                                labelField="label"
                                valueField="value"
                                placeholder="Select item"
                                searchPlaceholder="Search..."
                                data={incidentOccuredData}
                                value={selectedIncidentOccured}
                                onChange={item => {
                                    setSelectedIncidentOccured(item.value);
                                }}
                            />
                        </View>

                        <View style={styles.TextInputContainer}>
                            <Text>
                                <Text style={styles.Label}> Road 1 Name</Text>
                                <Text style={styles.LabelImpt}> (*)</Text>
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
                                data={road1List}
                                value={selectedRoad1}
                                onChange={item => {
                                    setSelectedRoad1(item.value);
                                }}
                            />
                        </View>

                        {selectedIncidentOccured === '2' || selectedIncidentOccured === '3' || selectedIncidentOccured === '4' ? (
                            <View style={styles.TextInputContainer}>
                                <Text>
                                    <Text style={styles.Label}> Road 2 Name</Text>
                                    <Text style={styles.LabelImpt}> (*)</Text>
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
                                    data={road2List}
                                    value={selectedRoad2}
                                    onChange={item => {
                                        setSelectedRoad2(item.value);
                                    }}
                                />
                            </View>
                        ) : null}

                        {(selectedSpecialZoneValue === 2 || selectedSpecialZoneValue === 3)  ? (
                            <View style={styles.TextInputContainer}>
                                <Text>
                                    <Text style={styles.Label}> School Name</Text>
                                    <Text style={styles.LabelImpt}> (*)</Text>
                                </Text>
                                <TextInput
                                    style={styles.RoundedTextInputFont}
                                    value={schoolName}
                                    maxLength={150}
                                    onChangeText={(value) => setSchoolName(value)}
                                />
                            </View>
                        ) : null}

                        <View style={styles.TextInputContainer}>
                            <Text>
                                <Text style={styles.Label}> Remarks </Text>
                                <Text style={styles.LabelThin}> (255 Characters)</Text>
                            </Text>
                            <View style={styles.TextInputWrapper}>
                                <TextInput
                                    style={styles.RoundedLongTextInputMediumWhiteFont}
                                    multiline
                                    editable
                                    textAlignVertical="top"
                                    onChangeText={(value) => setRemarks(value)}
                                    maxLength={255}
                                    value={remarks}
                                />
                                <Text style={styles.CharCounter}>{remarks.length}/255</Text>
                            </View>
                        </View>

                        <View style={styles.TextInputContainer}>
                            <View style={styles.MarginContainer} />
                            <WhiteButton title="SAVE AS DRAFT" customClick={() => save_as_draft()}/>
                            <View style={styles.MarginContainer} />
                            <BackToHomeButton/>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
});

export default Location;