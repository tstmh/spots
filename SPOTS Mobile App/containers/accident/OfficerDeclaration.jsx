import React, { useState, useEffect, useContext, forwardRef } from 'react';
import { View, Text, TextInput, SafeAreaView, Pressable, TouchableOpacity, Image, ScrollView, Alert, ToastAndroid } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import BlueButton from '../../components/common/BlueButton';
import WhiteButton from '../../components/common/WhiteButton';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import styles from '../../components/spots-styles';
import SystemCode from '../../models/SystemCode';
import { formatIntegerValue, formatDateTimeToLocaleString, formatDateTimeToString, parseStringToDateTimeObject } from '../../utils/Formatter';
import AccidentReport from '../../models/AccidentReport';
import DatabaseService from '../../utils/DatabaseService';
import { AccidentReportContext } from '../../context/accidentReportContext';
import { OfficerContext } from '../../context/officerContext';
import { submitOSI } from '../../utils/SubmitHelper';
import LoadingModal from '../common/Loading';

const OfficerDeclaration = forwardRef((props, ref) => {
    const navigation = useNavigation();
    
    const { accidentReport, updateAccidentReport, resetAccidentReport } = useContext(AccidentReportContext);
    const { officer } = useContext(OfficerContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setWeatherList(SystemCode.weatherCode);
        setRoadSurfaceList(SystemCode.roadSurface);
        setTrafficVolume(SystemCode.trafficVolume);
    }, []);

    //date picker Arrival Date
    const initialArrivalDate = accidentReport.PO_ARRIVAL_TIME ? parseStringToDateTimeObject(accidentReport.PO_ARRIVAL_TIME) : null;
    const [arrivalDate, setArrivalDate] = useState(initialArrivalDate);
    const [openArrivalDate, setOpenArrivalDate] = useState(false);
    const handleOpenArrivalDate = () => { setOpenArrivalDate(true); };

    //date picker Resume Date
    const initialResumeDate = accidentReport.PO_RESUME_DUTY_TIME ? parseStringToDateTimeObject(accidentReport.PO_RESUME_DUTY_TIME) : null;
    const [resumeDate, setResumeDate] = useState(initialResumeDate);
    const [openResumeDate, setOpenResumeDate] = useState(false);
    const handleOpenResumeDate = () => { setOpenResumeDate(true); };

    //date picker Preserve Date
    const initialPreserveDate = accidentReport.PRESERVE_DATE ? parseStringToDateTimeObject(accidentReport.PRESERVE_DATE) : null;
    const [preserveDate, setPreserveDate] = useState(initialPreserveDate);
    const [openPreserveDate, setOpenPreserveDate] = useState(false);
    const handleOpenPreserveDate = () => { setOpenPreserveDate(true); };

    //drop down Weather
    const [weatherList, setWeatherList] = useState([]);
    const [selectedWeather, setSelectedWeather] = useState(accidentReport.WEATHER_CODE?.toString() || null);

    //drop down Road Surface
    const [roadSurfaceList, setRoadSurfaceList] = useState([]);
    const [selectedRoadSurface, setSelectedRoadSurface] = useState(accidentReport.ROAD_SURFACE_CODE?.toString() || null);
    
    //drop down Traffic Volume
    const [trafficVolumeList, setTrafficVolume] = useState([]);
    const [selectedTrafficVolume, setSelectedTrafficVolume] = useState(accidentReport.TRAFFIC_VOLUME_CODE?.toString() || null);

    const [officerRank, setOfficerRank] = useState(accidentReport.OFFICER_RANK || '');
    const [division, setDivision] = useState(accidentReport.DIVISION || '');
    const [weatherOtherCode, setWeatherOtherCode] = useState(accidentReport.WEATHER_OTHER_CODE || '');  
    const [roadSurfaceOther, setRoadSurfaceOther] = useState(accidentReport.ROAD_SURFACE_OTHER || '');

    const validateForm = () => {
        console.log(accidentReport);
        
        if (!arrivalDate) {
            Alert.alert('Validation Error', 'Please select Arrival Date.');
            return false;
        };
        if (!resumeDate) {
            Alert.alert('Validation Error', 'Please select Resume Date');
            return false;
        }
        console.log("selectedWeather >> " , selectedWeather);
        if (!selectedWeather) {
            Alert.alert('Validation Error', 'Please select Weather');
            return false;
        }
        console.log("selectedRoadSurface >> " , selectedRoadSurface);
        if (!selectedRoadSurface) {
            Alert.alert('Validation Error', 'Please select Road Surface');
            return false;
        }
        console.log("selectedTrafficVolume >> " , selectedTrafficVolume);
        if (!selectedTrafficVolume) {
            Alert.alert('Validation Error', 'Please select Traffic Volume');
            return false;
        }
        if (selectedWeather === 3 || selectedWeather === '3' ){
            if (!weatherOtherCode){
                Alert.alert('Validation Error', 'Please enter Other Weather');
                return false;
            }
        }
        if (selectedRoadSurface === 3 || selectedRoadSurface === '3' ){
            if (!roadSurfaceOther){
                Alert.alert('Validation Error', 'Please enter Other Road Surface');
                return false;
            }
        }

        return true;
    };

    // Expose the validate function
    React.useImperativeHandle(ref, () => ({
        validate: save_as_draft,
    }));

    const save_as_draft = async () => {
        if (!validateForm()){
            return false;
        }

        const updatedReport = {
            ...accidentReport,
            PO_ARRIVAL_TIME: formatDateTimeToString(arrivalDate),
            PO_RESUME_DUTY_TIME: formatDateTimeToString(resumeDate),
            PRESERVE_DATE: formatDateTimeToString(preserveDate),
            WEATHER_CODE: formatIntegerValue(selectedWeather),
            WEATHER_OTHER_CODE: weatherOtherCode,
            ROAD_SURFACE_CODE: formatIntegerValue(selectedRoadSurface),
            ROAD_SURFACE_OTHER: roadSurfaceOther,
            TRAFFIC_VOLUME_CODE: formatIntegerValue(selectedTrafficVolume),
            OFFICER_RANK: officerRank,
            DIVISION: division
        };

        console.log("start saving OfficerDeclaration ", updatedReport);
        AccidentReport.insert(DatabaseService.db, updatedReport);
        updateAccidentReport(updatedReport);

        ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
        return true;
    };

    const submit = async () => {
        if (!validateForm()){
            return;
        }
        setLoading(true);

        const success = await submitOSI(accidentReport.ID, officer.OFFICER_ID);
        console.log('submitOSI success?', success);
        
        setLoading(false);

        if (success){
            resetAccidentReport();
            navigation.navigate('Dashboard');
        }
    };

    return (
        <ScrollView style={styles.ContainerWhiteBG}>
            <SafeAreaView style={{height: "100%"}}>
                <View style={styles.ComponentFrame}>
                    <View style={styles.FullFrame}>
                        <Text>
                            <Text style={styles.Label}> I arrived at the scene at </Text>
                            <Text style={styles.LabelImpt}> (*)</Text>
                        </Text>
                        <Pressable  style={styles.RoundedDateInput} onPress={handleOpenArrivalDate}>
                            <TextInput
                                style={styles.DateTextInputWhiteFont}
                                placeholder="Select... (DD/MM/YYYY, hh:mm)"
                                editable={false}
                                value={arrivalDate? formatDateTimeToLocaleString(arrivalDate): ""}
                            />
                            <TouchableOpacity onPress={handleOpenArrivalDate}>
                                <Image
                                    source={require('../../assets/icon/calendar.png')}
                                    style={{ width: 29, height: 29 }}
                                />
                            </TouchableOpacity>
                        </Pressable>
                        <DatePicker
                            modal
                            textColor="black"
                            open={openArrivalDate}
                            maximumDate={new Date()}
                            date={arrivalDate? new Date(arrivalDate) : new Date()}
                            onConfirm={(date) => {
                                setOpenArrivalDate(false);
                                setArrivalDate(date);
                            }}
                            onCancel={() => {
                                setOpenArrivalDate(false);
                            }}
                        />
                    </View>

                    <View style={styles.FullFrame}>
                        <Text style={styles.LabelNormal}> On my arrival, I established the following vehicle/s involved in the accident.</Text>
                    </View>

                    <View style={styles.FullFrame}>
                        <Text>
                            <Text style={styles.Label}> I resumed my patrol duty at </Text>
                            <Text style={styles.LabelImpt}> (*)</Text>
                        </Text>
                        <Pressable  style={styles.RoundedDateInput} onPress={handleOpenResumeDate}>
                            <TextInput
                                style={styles.DateTextInputWhiteFont}
                                placeholder="Select... (DD/MM/YYYY, hh:mm)"
                                editable={false}
                                value={resumeDate? formatDateTimeToLocaleString(resumeDate): ""}
                            />
                            <TouchableOpacity onPress={handleOpenResumeDate}>
                                <Image
                                    source={require('../../assets/icon/calendar.png')}
                                    style={{ width: 28, height: 28 }}
                                />
                            </TouchableOpacity>
                        </Pressable>
                        <DatePicker
                            modal
                            open={openResumeDate}
                            maximumDate={new Date()}
                            date={resumeDate? new Date(resumeDate) : new Date()}
                            onConfirm={(date) => {
                                setOpenResumeDate(false);
                                setResumeDate(date);
                            }}
                            onCancel={() => {
                                setOpenResumeDate(false);
                            }}
                        />
                    </View>

                    <View style={styles.DeclarationFrame}>
                        <Text style={styles.Label}>
                            At the time of my arrival, I observed
                        </Text>
                        <View style={styles.MarginContainerXSmall}/>

                        <View style={styles.ContainerGreyDeclaration}>

                            <View style={styles.FrameRow}>
                                <View style={selectedWeather === 3 || selectedWeather === '3' 
                                    ? styles.HalfFrameContainer 
                                    : styles.FullFrame}>
                                    <Text>
                                        <Text style={styles.Label}> Weather </Text>
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
                                        data={weatherList}
                                        value={selectedWeather}
                                        onChange={item => {
                                            setSelectedWeather(item.value);
                                        }}
                                    />
                                </View>
                                {(selectedWeather === 3 || selectedWeather === '3') && (
                                <View style={styles.HalfFrameContainer}>
                                    <Text>
                                        <Text style={styles.Label}> Other Weather </Text>
                                    </Text>
                                    <TextInput
                                        style={styles.RoundedTextInputWhiteFont}
                                        editable={selectedWeather === 3 || selectedWeather ==='3'}
                                        value={weatherOtherCode}
                                        maxLength={28}
                                        onChangeText={setWeatherOtherCode}
                                    />
                                </View>
                                )}
                            </View>

                            <View style={styles.FrameRow}>
                                <View style={selectedRoadSurface === 3 || selectedRoadSurface === '3' 
                                    ? styles.HalfFrameContainer 
                                    : styles.FullFrame}>
                                    <Text>
                                        <Text style={styles.Label}> Road Surface </Text>
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
                                        data={roadSurfaceList}
                                        value={selectedRoadSurface}
                                        onChange={item => {
                                            setSelectedRoadSurface(item.value);
                                        }}
                                    />
                                </View>
                                {(selectedRoadSurface === 3 || selectedRoadSurface === '3') && (
                                    <View style={styles.HalfFrameContainer}>
                                        <Text>
                                            <Text style={styles.Label}> Other Road Surface </Text>
                                        </Text>
                                        <TextInput
                                            style={styles.RoundedTextInputWhiteFont}
                                            editable={selectedRoadSurface === 3 || selectedRoadSurface ==='3'}
                                            value={roadSurfaceOther}
                                            maxLength={50}
                                            onChangeText={
                                                (text) => setRoadSurfaceOther(text)
                                            }
                                        />
                                    </View>
                                )}
                            </View>

                            <View style={styles.FrameRow}>
                                <View style={styles.FullFrame}>
                                    <Text>
                                        <Text style={styles.Label}> Traffic Volume </Text>
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
                                        data={trafficVolumeList}
                                        value={selectedTrafficVolume}
                                        onChange={item => {
                                            setSelectedTrafficVolume(item.value);
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={styles.FrameRow}>
                                <View style={styles.FullFrame}>
                                    <View style={styles.HorizontalVector} />
                                    <View style={styles.MarginContainerXSmall} />
                                    <Text>
                                        <Text style={styles.Label}> I preserved the scene till arrival of </Text>
                                    </Text>
                                    <TextInput
                                        style={styles.RoundedTextInputWhiteFont}
                                        placeholder='RANK NO. AND NAME'
                                        onChangeText={setOfficerRank}
                                        value={officerRank}
                                        maxLength={66}
                                    />
                                </View>
                            </View>

                            <View style={styles.FrameRow}>
                                <View style={styles.HalfFrameContainer}>
                                    <Text>
                                        <Text style={styles.Label}> From </Text>
                                    </Text>
                                    <TextInput
                                        style={styles.RoundedTextInputWhiteFont}
                                        placeholder='DIV/NPC/NPP'
                                        onChangeText={setDivision}
                                        value={division}
                                        maxLength={4}
                                    />
                                </View>
                                <View style={styles.HalfFrameContainer}>
                                    <Text>
                                        <Text style={styles.Label}> at </Text>
                                    </Text>
                                    <Pressable  style={styles.RoundedDateInputWhite} onPress={handleOpenPreserveDate}>
                                        <TextInput
                                            style={styles.DateTextInputWhiteFont}
                                            editable={false}
                                            value={preserveDate? formatDateTimeToLocaleString(preserveDate): ""}
                                        />
                                        <TouchableOpacity onPress={handleOpenPreserveDate}>
                                            <Image
                                                source={require('../../assets/icon/calendar.png')}
                                                style={{ width: 28, height: 28 }}
                                            />
                                        </TouchableOpacity>
                                    </Pressable>
                                    <DatePicker
                                        modal
                                        open={openPreserveDate}
                                        date={preserveDate? new Date(preserveDate) : new Date()}
                                        onDateChange={(preserveDate) => {
                                            console.log("Selected Preserve Date:", preserveDate);
                                        }}
                                        onConfirm={(date) => {
                                            setOpenPreserveDate(false);
                                            setPreserveDate(date);
                                        }}
                                        onCancel={() => {
                                            setOpenPreserveDate(false);
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.FullFrame}>
                                <Text style={styles.LabelSmall}>
                                    I handed over the case, the vehicle and the removable items to him/her.
                                </Text>
                                <View style={styles.MarginContainerXSmall} />
                                <View style={styles.HorizontalVector} />
                                <Text style={styles.DeclarationFont}>
                                    *I declare that this statement is true to the best knowledge and belief and I make it knowing that, if it is tendered in evidence, I may be liable to prosecution if I have wilfully stated in it anything which I know to be false or do not believe to be true.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.FullFrame}>                        
                            <View style={styles.MarginContainerXSmall} />
                            <WhiteButton title="SAVE AS DRAFT" customClick={() => save_as_draft()}/>                        
                            <View style={styles.MarginContainerXSmall} />
                            <BlueButton title="SUBMIT" customClick={() => submit()}/>
                            <View style={styles.MarginContainerXSmall} />
                            <BackToHomeButton/>
                        </View>
                    </View>
                </View>
                <LoadingModal visible={loading} />
                <View style={{height: 125}} />
            </SafeAreaView>
        </ScrollView>
    );
});

export default OfficerDeclaration;