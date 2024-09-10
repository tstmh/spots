import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import CheckBox from '@react-native-community/checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import { RadioButton } from 'react-native-paper';
import { formatDateToLocaleString } from '../../utils/Formatter';
import SystemCode from '../../models/SystemCode';
import TIMSCountryCode from '../../models/TIMSCountryCode';
import TIMSNationalityCode from '../../models/TIMSNationalityCode';

const DriverIdentity = ({
    styles,
    toggleSection,
    expandedSection,

    driverName,
    setDriverName,

    idNo,
    setIdNo,

    contact1,
    setContact1,
    contact2,
    setContact2,

    otherLicense,
    setOtherLicense,

    breathalyzerNo,
    setBreathalyzerNo,

    injuryDriver,
    setInjuryDriver,

    // ID Type props
    selectedIdType,
    setSelectedIdType,

    // License Type props
    selectedLicenseType,
    setSelectedLicenseType,

    // Expiry Date props
    expiryDate,
    setExpiryDate,
    handleOpenExpiryDate,
    setOpenExpiryDate,
    openExpiryDate,

    // Date of Birth props
    dateOfBirth,
    setDateOfBirth,
    handleOpenDateOfBirth,
    setOpenDateOfBirth,
    openDateOfBirth,

    // Age props
    age,
    setAge,

    // Sex props
    selectedSex,
    handleSexRadioButtonChange,

    // Driver License Class props
    selectedDriverLicense,
    handleDriverLicenseChange,

    // Country Type props
    selectedCountryType,
    setSelectedCountryType,

    // Nationality Type props
    selectedNationalityType,
    setSelectedNationalityType,

    // Alcoholic Breath props
    selectedAlcoholicBreath,
    handleAlcoholicBreathChange,

    // Breathalyser Result props
    selectedBreathalyserResult,
    handleBreathalyserResultChange,

}) => {

    // Fetch ddl options from SQLite database
    useEffect(() => {
        setSexOptions(SystemCode.sex);
        setDriverLicenseOptions(SystemCode.licenseClass);
        setIdTypeList(SystemCode.idTypeCode);
        setLicenseTypeList(SystemCode.licenseType);
        setAlcoholicBreathList(SystemCode.yesNo);
        setBreathalyserResultList(SystemCode.breathalyserResult);
        setCountryTypeList(TIMSCountryCode.timsCountryCode);
        setNationalityTypeList(TIMSNationalityCode.timsNationalityCode);
        
    }, []);

    // Calculate age when dateOfBirth changes
    useEffect(() => {
        if (dateOfBirth) {
            const ageString = calculateAgeString(dateOfBirth);
            setAge(ageString);
        }
    }, [dateOfBirth]);
    
    //drop down ID Type
    const [idTypeList, setIdTypeList] = useState([]);

    //drop down License Type
    const [licenseTypeList, setLicenseTypeList] = useState([]);

    //drop down Country Type
    const [countryTypeList, setCountryTypeList] = useState([]);

    //drop down Nationality Type
    const [nationalityTypeList, setNationalityTypeList] = useState([]);

    //drop down Alcoholic Breath
    const [alcoholicBreathList, setAlcoholicBreathList] = useState([]);

    // drop down Breathalyser Result
    const [breathalyserResultList, setBreathalyserResultList] = useState([]);

    //radio button Sex
    const [sexOptions, setSexOptions] = useState([]);

    //radio button Driver License
    const [driverLicenseOptions, setDriverLicenseOptions] = useState([]);

    /**
     * Calculate age based on the given date of birth (DOB) and return it as a string.
     * @param {Date | string} dob - The date of birth. It can be either a Date object or a string in a format recognized by the Date constructor.
     * @returns {string} The age in the format "XX Years, XX Months, XX Days".
     */
    const calculateAgeString = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
    
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();
    
        // Adjust for negative months and days
        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
    
        // Convert years, months, and days to 2 digit format
        const yearsString = String(years).padStart(2, '0');
        const monthsString = String(months).padStart(2, '0');
        const daysString = String(days).padStart(2, '0');
    
        return `${yearsString} Year ${monthsString} Month ${daysString} Days`;
    };

    return (
        <View style={styles.AccordionFrame} >
            <TouchableOpacity style={styles.PedestrianContainerLessPad} onPress={() => toggleSection(1)}>
                <Text style={styles.SubAccordionHeader} > Identification Information {' '} </Text>
                <View style={{marginRight: 13}}>
                {expandedSection === 1 ? (
                    <Image source={require('../../assets/icon/arrow-up.png')}/>
                ) : (
                    <Image source={require('../../assets/icon/arrow-down.png')}/>
                )}
                </View>
            </TouchableOpacity>

            {expandedSection === 1 && (
            <View style={styles.AccordionFrame} >
                <View style={styles.FullFrame}>
                    <Text>
                        <Text style={styles.Label}> Driver Name</Text>
                    </Text>
                    <TextInput
                        style={styles.RoundedTextInputWhiteFont}
                        value={driverName}
                        onChangeText={text => setDriverName(text)}
                    />
                </View>

                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> ID Type </Text>
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
                            data={idTypeList}
                            value={selectedIdType}
                            onChange={item => {
                                setSelectedIdType(item.value);
                            }}
                        />
                    </View>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}>ID No. </Text>
                            <Text style={styles.LabelImpt}> (*)</Text>
                        </Text>
                        <TextInput
                            style={styles.RoundedTextInputWhiteFont}
                            autoCapitalize='characters'
                            value={idNo}
                            onChangeText={text => setIdNo(text)}
                        />
                    </View>
                </View>

                <View style={[styles.FrameRow]}>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> License Type </Text>
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
                            data={licenseTypeList}
                            value={selectedLicenseType}
                            onChange={item => {
                                setSelectedLicenseType(item.value);
                            }}
                        />
                    </View>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> Expiry Date </Text>
                        </Text>
                        <Pressable  style={styles.RoundedDateInputWhite} onPress={handleOpenExpiryDate}>
                            <TextInput
                                style={styles.DateTextInputWhiteFont}
                                placeholder="Select Date (DD/MM/YYYY)"
                                editable={false}
                                value={expiryDate? formatDateToLocaleString(expiryDate): ""}
                            />
                            <TouchableOpacity onPress={handleOpenExpiryDate}>
                                <Image
                                    source={require('../../assets/icon/calendar.png')}
                                    style={{ width: 28, height: 28 }}
                                />
                            </TouchableOpacity>
                        </Pressable>
                        <DatePicker
                            modal
                            mode="date"
                            textColor="black"
                            open={openExpiryDate}
                            date={expiryDate? new Date(expiryDate) : new Date()}
                            onConfirm={(date) => {
                                setOpenExpiryDate(false);
                                setExpiryDate(date);
                            }}
                            onCancel={() => {
                                setOpenExpiryDate(false);
                            }}
                        />
                    </View>
                </View>

                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text style={styles.Label}>Date of Birth </Text>
                        <Pressable  style={styles.RoundedDateInputWhite} onPress={handleOpenDateOfBirth}>
                            <TextInput
                                style={styles.DateTextInputWhiteFont}
                                placeholder="Select Date (DD/MM/YYYY)"
                                editable={false}
                                value={dateOfBirth? formatDateToLocaleString(dateOfBirth) : ""}
                            />
                            <TouchableOpacity onPress={handleOpenDateOfBirth}>
                                <Image
                                    source={require('../../assets/icon/calendar.png')}
                                    style={{ width: 28, height: 28 }}
                                />
                            </TouchableOpacity>
                        </Pressable>
                        <DatePicker
                            modal
                            mode="date"
                            open={openDateOfBirth}
                            maximumDate={new Date()} 
                            date={dateOfBirth? new Date(dateOfBirth) : new Date()}
                            onConfirm={(dateOfBirth) => {
                                setOpenDateOfBirth(false);
                                setDateOfBirth(dateOfBirth);
                                setAge(calculateAgeString(dateOfBirth));
                            }}
                            onCancel={() => {
                                setOpenDateOfBirth(false);
                            }}
                        />
                    </View>
                    <View style={styles.HalfFrameContainer}>
                        <Text style={styles.Label}>Age </Text>
                        {age ? (
                            <Text style={styles.Label} >{age}</Text>
                        ) : (
                            <Text style={styles.Label} > 0 Years 0 Months 0 Days</Text>
                        )}
                    </View>
                </View>

                <View style={styles.FullFrameNoPad}>
                    <Text style={[styles.Label, {alignSelf: 'center'}]}>Sex </Text>
                    <View style={styles.FrameRowWrap}>
                        {sexOptions.length > 0 ? (
                            sexOptions.map((option) => (
                                <View key={option.value} style={styles.RadioButtonContainer}>
                                    <RadioButton
                                        color="#00163E"
                                        value={option.value}
                                        status={selectedSex === option.value ? 'checked' : 'unchecked'}
                                        onPress={() => handleSexRadioButtonChange(option.value)}
                                    />
                                    <Text style={styles.RadioButtonText}>{option.label}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.LabelNormal}>No options available</Text>
                        )}
                    </View>
                </View>

                <View style={styles.FullFrame}>
                    <Text style={styles.Label}>Driver License Class</Text>
                    <View style={styles.RadioFrameRowWrap}>
                        {driverLicenseOptions.length > 0 ? (
                            driverLicenseOptions.map((option) => (
                                <View key={option.value} style={styles.RadioButtonContainerFlex}>
                                    <CheckBox
                                        value={selectedDriverLicense.includes(option.value)}
                                        onValueChange={() => handleDriverLicenseChange(option.value)}
                                        tintColors={{ true: '#00163E' }}
                                    />
                                    <Text style={[styles.RadioButtonTextTight, { marginRight: 15 }]}>
                                        {option.label}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.LabelNormal}>No options available</Text>
                        )}
                    </View>
                </View>

                <View style={styles.FullFrameFlexNoPad}>
                    <Text>
                        <Text style={styles.Label}> Other License (18 Characters)</Text>
                    </Text>
                    <TextInput
                        style={styles.RoundedTextInputWhiteFont}
                        value={otherLicense}
                        onChangeText={text => setOtherLicense(text)}
                        maxLength ={18}
                    />
                </View>

                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> Country of Birth </Text>
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
                            data={countryTypeList}
                            value={selectedCountryType}
                            onChange={item => {
                                setSelectedCountryType(item.value);
                            }}
                        />
                    </View>
                    <View style={styles.HalfFrameContainer}>
                        <Text style={styles.Label}> Nationality </Text>
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
                            data={nationalityTypeList}
                            value={selectedNationalityType}
                            onChange={item => {
                                setSelectedNationalityType(item.value);
                            }}
                        />
                    </View>
                </View>

                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> Contact Information 1 </Text>
                        </Text>
                        <TextInput
                            style={styles.RoundedTextInputWhiteFont}
                            value={contact1} 
                            onChangeText={text => setContact1(text)}
                        />
                    </View>
                    <View style={styles.HalfFrameContainer}>
                        <Text style={styles.Label}> Contact Information 2 </Text>
                        <TextInput
                            style={styles.RoundedTextInputWhiteFont}
                            value={contact2} 
                            onChangeText={text => setContact2(text)}
                        />
                    </View>
                </View>

                <View style={styles.FullFrame}>
                    <Text>
                        <Text style={styles.Label}> Driver/Rider’s Degree of Injury (255 Characters) </Text>
                    </Text>
                    <View style={styles.TextInputWrapper}>
                        <TextInput
                            style={styles.RoundedLongTextInputMediumWhiteFont}
                            multiline
                            editable
                            textAlignVertical="top"
                            onChangeText={(text) => setInjuryDriver(text)}
                            maxLength={255}
                            value={injuryDriver}
                        />
                        <Text style={styles.CharCounter}>{injuryDriver.length}/255</Text>
                    </View>
                </View>

                <View style={[styles.FullFrameRowCenter, {padding: 0}]}>
                    <Text style={[styles.Label, {paddingLeft: 15, width: 200}]}>Alcoholic Breath?</Text>
                    <View style={styles.RadioFrameRowWrap}>
                        {alcoholicBreathList.length > 0 ? (
                            alcoholicBreathList.map((option) => (
                                <View key={option.value} style={styles.RadioButtonContainerFlex}>
                                    <CheckBox
                                        value={selectedAlcoholicBreath.includes(option.value)}
                                        onValueChange={() => handleAlcoholicBreathChange(option.value)}
                                        tintColors={{ true: '#00163E' }}
                                    />
                                    <Text style={[styles.RadioButtonTextTight, { marginRight: 15 }]}>
                                        {option.label}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.LabelNormal}>No options available</Text>
                        )}
                    </View>
                </View>

                <View style={[styles.FullFrameRowCenter, {padding: 0}]}>
                    <Text style={[styles.Label, {paddingLeft: 15, width: 200}]}>Breathalyser Results</Text>
                    <View style={styles.RadioFrameRowWrap}>
                        {breathalyserResultList.length > 0 ? (
                            breathalyserResultList.map((option) => (
                                <View key={option.value} style={styles.RadioButtonContainerFlex}>
                                    <CheckBox
                                        value={selectedBreathalyserResult.includes(option.value)}
                                        onValueChange={() => handleBreathalyserResultChange(option.value)}
                                        tintColors={{ true: '#00163E' }}
                                    />
                                    <Text style={[styles.RadioButtonTextTight, { marginRight: 15 }]}>
                                        {option.label}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.LabelNormal}>No options available</Text>
                        )}
                    </View>
                </View>

                <View style={styles.FrameRow}>
                    <View style={styles.FullFrame}>
                        <Text style={styles.Label}> Breathalyzer No. </Text>
                        <TextInput
                            style={styles.RoundedTextInputWhiteFont}
                            value={breathalyzerNo} 
                            onChangeText={text => setBreathalyzerNo(text)}
                        />
                    </View>
                </View>
            </View>
            )}
        </View>
    );
};

export default DriverIdentity;
