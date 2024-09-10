import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput, SafeAreaView, Pressable, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import styles from '../../components/spots-styles';
import BlueButton from '../../components/common/BlueButton';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import HeaderBanner from '../../components/common/HeaderBanner';
import dbService from '../../utils/DatabaseService';
import AccidentReport from '../../models/AccidentReport';
import IOList from '../../models/IOList';
import { formatDateTimeToLocaleString, formatDateTimeToString, formatTimeStamp } from '../../utils/Formatter'; 
import { AccidentReportContext } from '../../context/accidentReportContext';
import { OfficerContext } from '../../context/officerContext';
import { validateDateIsFutureDate } from '../../utils/Validator';

const AccidentAddAccidentScreen = ({ navigation }) => {
    const { accidentReport, updateAccidentReport } = useContext(AccidentReportContext);
    const { officer } = useContext(OfficerContext);
    const { resetAccidentReport } = useContext(AccidentReportContext);

    // State for input fields
    const [incidentNo, setIncidentNo] = useState('');
    const [ioExtensionNo, setIoExtensionNo] = useState('');

    useEffect(() => {
        setIOList(IOList.ioList);
        resetAccidentReport();
        console.log(accidentReport);
    }, []);

    //drop down IOList
    const [selectedIoList, setSelectedIoList] = useState('');
    const [ioList, setIOList] = useState([]);

    //date picker Accident DateTime
    const [accidentDate, setAccidentDate] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => { setOpen(true); };

    // Function to save accident report as draft
    const save_as_draft = async () => {

        if (!incidentNo) {
            Alert.alert('Validation Error', 'Please enter Incident No.');
            return;
        }
        
        if (!selectedIoList) {
            Alert.alert('Validation Error', 'Please select IO Name');
            return;
        }

        if (!ioExtensionNo) {
            Alert.alert('Validation Error', 'Please enter Extension No.');
            return;
        }

        if (!accidentDate) {
            Alert.alert('Validation Error', 'Please select Accident Date and Time.');
            return;
        } else {
            if (validateDateIsFutureDate(accidentDate)){
                Alert.alert('Validation Error', 'Accident Date and Time cannot be future date.');
                return;
            }
        }

        // Construct accident report object
        const timestamp = formatTimeStamp();
        
        const updatedReport = {
            ...accidentReport,
            ID: timestamp,
            INCIDENT_NO: incidentNo,
            IO_NAME: selectedIoList,
            IO_EXTENSION_NO: ioExtensionNo,
            ACCIDENT_TIME: formatDateTimeToString(accidentDate),
            CREATED_AT: timestamp,
            OFFICER_ID: officer.OFFICER_ID,
        };

        console.log("start saving AddAccidentScreen ", updatedReport);

        // Insert accident report into database
        AccidentReport.insert(dbService.db, updatedReport);
        updateAccidentReport(updatedReport);
        
        // Navigate to AccidentMainScreen
        navigation.navigate('AccidentMainScreen');
    };

    return (
        <View>
            <HeaderBanner title="On-Scene Investigation Report" officerName={officer.OFFICER_NAME} navigation={navigation} />

            <View style={styles.ContainerGrey}>
                <View style={styles.ContainerWhite}>
                    <SafeAreaView style={styles.TextContainer}>
                        <View style={styles.TextInputContainer}>
                            <Text>
                                <Text style={styles.Label}> Enter Incident Number </Text>
                                <Text style={styles.LabelImpt}> (*)</Text>
                            </Text>
                            <TextInput
                                style={styles.RoundedTextInput}
                                autoCapitalize='characters'
                                onChangeText={(text) => setIncidentNo(text)}
                                value={incidentNo}
                                maxLength={25}
                            />
                        </View>

                        <View style={styles.TextInputContainer}>
                            <Text>
                                <Text style={styles.Label}> IO Name </Text>
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
                                data={ioList? ioList : IOList.ioList}
                                value={selectedIoList}
                                onChange={item => {
                                    setSelectedIoList(item.value);
                                }}
                            />
                        </View>

                        <View style={styles.TextInputContainer}>
                            <Text>
                                <Text style={styles.Label}> Extension No. </Text>
                                <Text style={styles.LabelImpt}> (*)</Text>
                            </Text>
                            <TextInput
                                style={styles.RoundedTextInput}
                                keyboardType='numeric'
                                maxLength={5}
                                onChangeText={(text) => setIoExtensionNo(text)}
                                value={ioExtensionNo}
                            />
                        </View>

                        <View style={styles.TextInputContainer}>
                            <Text>
                                <Text style={styles.Label}> Accident Date and Time </Text>
                                <Text style={styles.LabelImpt}> (*)</Text>
                            </Text>
                            <Pressable  style={styles.RoundedDateInput} onPress={handleOpen}>
                                <TextInput
                                    style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 12, color: 'black' }}
                                    placeholder="Select... (DD/MM/YYYY, hh:mm)"
                                    editable={false}
                                    value={accidentDate ? formatDateTimeToLocaleString(accidentDate) : ""} 
                                />
                                <TouchableOpacity onPress={handleOpen}>
                                    <Image
                                        source={require('../../assets/icon/calendar.png')}
                                        style={{ width: 29, height: 29 }}
                                    />
                                </TouchableOpacity>
                            </Pressable >
                            <DatePicker
                                modal
                                textColor="black"
                                open={open}
                                maximumDate={new Date()} 
                                date={accidentDate? new Date(accidentDate) : new Date()}
                                onConfirm={(date) => {
                                    setOpen(false);
                                    setAccidentDate(date);
                                }}
                                onCancel={() => {
                                    setOpen(false);
                                }}
                            />
                        </View>
                        <View style={styles.MarginContainerMedium} />
                        <BlueButton title="ADD DRAFT" customClick={() => save_as_draft()} />
                        <View style={styles.MarginContainerXSmall} />
                        <BackToHomeButton/>
                    </SafeAreaView>
                </View>
            </View>
        </View>
    );
};

export default AccidentAddAccidentScreen;