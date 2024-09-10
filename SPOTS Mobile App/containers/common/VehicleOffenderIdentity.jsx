import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput, Pressable} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { RadioButton } from 'react-native-paper';
import { formatDateToLocaleString } from '../../utils/Formatter';
import SystemCode from '../../models/SystemCode';
import TIMSCountryCode from '../../models/TIMSCountryCode';
import TIMSNationalityCode from '../../models/TIMSNationalityCode';
import stylesOSI from '../../components/spots-styles';
import CheckBox from '@react-native-community/checkbox';

const VehicleOffenderIdentity = ({
    styles,
    toggleSection,
    expandedSection,

    offenderName,
    setOffenderName,

    idNo,
    setIdNo,

    // ID Type props
    selectedIdType,
    setSelectedIdType,

    // Offender Involvement props
    selectedOffenderInvolvement,
    setSelectedOffenderInvolvement,

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

    contact1,
    setContact1,
    contact2,
    setContact2,

    otherLicense,
    setOtherLicense,

}) => {

    // Fetch ddl options from SQLite database
    useEffect(() => {
        setSexOptions(SystemCode.sex);
        setDriverLicenseOptions(SystemCode.licenseClass);
        setIdTypeList(SystemCode.idTypeCode);
        setLicenseTypeList(SystemCode.licenseType);
        setOffenderInvolvementList(SystemCode.driverType);
        setCountryTypeList(TIMSCountryCode.timsCountryCode);
        setNationalityTypeList(TIMSNationalityCode.timsNationalityCode);
    }, []);

    const [idTypeList, setIdTypeList] = useState([]);
    const [licenseTypeList, setLicenseTypeList] = useState([]);
    const [offenderInvolvementList, setOffenderInvolvementList] = useState([]);

    const [sexOptions, setSexOptions] = useState([]);
    const [driverLicenseOptions, setDriverLicenseOptions] = useState([]);
    const [countryTypeList, setCountryTypeList] = useState([]);
    const [nationalityTypeList, setNationalityTypeList] = useState([]);

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
        if (months < 0 || (months === 0 && days < 0)) {
            years--;
            months += 12;
            if (days < 0) {
                months--;
                days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            }
        }
    
        // Convert years, months, and days to 2 digit format
        const yearsString = String(years).padStart(2, '0');
        const monthsString = String(months).padStart(2, '0');
        const daysString = String(days).padStart(2, '0');
    
        return `${yearsString} Year ${monthsString} Month ${daysString} Days`;
    };

    return (
        <View style={styles.AccordionFrame} >
            <View style={styles.MarginContainerXSmall} />
            <TouchableOpacity style={styles.PedestrianContainerLessPad} onPress={() => toggleSection(1)}>
                <Text style={styles.SubAccordionHeader} >
                    {' '}Identification Information {' '}
                </Text>
                <View style={{marginRight:13}}>
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
                        <Text style={styles.Label}> Offender Name</Text>
                    </Text>
                    <TextInput
                        style={styles.RoundedTextInputWhite}
                        value={offenderName}
                        onChangeText={text => setOffenderName(text)}
                    />
                </View>
                <View style={styles.FrameRow}>
                    <View style={styles.ThirdFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> Offender Involvement</Text>
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
                            data={offenderInvolvementList}
                            value={selectedOffenderInvolvement}
                            onChange={item => {
                                setSelectedOffenderInvolvement(item.value);
                            }}
                        />
                    </View>
                    <View style={styles.ThirdFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> ID Type</Text>
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
                            data={idTypeList}
                            value={selectedIdType}
                            onChange={item => {
                                setSelectedIdType(item.value);
                            }}
                        />
                    </View>
                    <View style={styles.ThirdFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> ID No.</Text>
                            <Text style={styles.LabelImpt}> (*)</Text>
                        </Text>
                        <TextInput
                            style={styles.RoundedTextInputWhite}
                            autoCapitalize='characters'
                            value={idNo}
                            onChangeText={text => setIdNo(text)}
                        />
                    </View>
                </View>
                
                <View style={stylesOSI.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}>Date of Birth </Text>
                            {selectedIdType === 4 || selectedIdType === '4' && <Text style={styles.LabelImpt}> (*)</Text>}
                        </Text>
                        <Pressable  style={styles.RoundedDateInputWhite} onPress={handleOpenDateOfBirth}>
                            <TextInput
                                style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 12 , color : '#000000'}}
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
                                const age = calculateAgeString(dateOfBirth);
                                console.log(age);
                                setAge(age);
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
                    <Text style={[styles.Label, {alignSelf: 'center'}]}>
                        <Text>Sex </Text>
                        {selectedIdType === 4 || selectedIdType === '4' && <Text style={styles.LabelImpt}> (*)</Text>}
                    </Text>
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

                <View style={styles.FrameRow}>
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
                            search
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
                                style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 12, color : '#000000' }}
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
                            onDateChange={(expiryDate) => {
                                console.log("Selected Expiry Date:", expiryDate);
                            }}
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

                <View style={stylesOSI.FullFrame}>
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
                        <Text style={styles.Label}> Other License (13 Characters)</Text>
                    </Text>
                    <TextInput
                        style={styles.RoundedTextInputWhiteFont}
                        value={otherLicense}
                        onChangeText={text => setOtherLicense(text)}
                        maxLength ={13}
                    />
                </View>

                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> Country of Birth </Text>
                            {selectedIdType === 4 || selectedIdType === '4' && <Text style={styles.LabelImpt}> (*)</Text>}
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
                        <Text>
                            <Text style={styles.Label}> Nationality </Text>
                            {selectedIdType === 4 || selectedIdType === '4' && <Text style={styles.LabelImpt}> (*)</Text>}
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

            </View>
            )}
        </View>
    );
};

export default VehicleOffenderIdentity;
