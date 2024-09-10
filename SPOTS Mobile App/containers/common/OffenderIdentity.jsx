import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { RadioButton } from 'react-native-paper';
import { formatDateToLocaleString } from '../../utils/Formatter';
import SystemCode from '../../models/SystemCode';
import stylesOSI from '../../components/spots-styles';
import TIMSCountryCode from '../../models/TIMSCountryCode';
import TIMSNationalityCode from '../../models/TIMSNationalityCode';

const OffenderIdentity = ({
    styles,
    toggleSection,
    expandedSection,

    name,
    setName,

    idNo,
    setIdNo,

    contact1,
    setContact1,
    contact2,
    setContact2,

    remarks,
    setRemarks,
    
    // Age props
    age,
    setAge,

    // Sex props
    selectedSex,
    handleSexRadioButtonChange,

    // ID Type props
    selectedIdType,
    setSelectedIdType,

    // Involvement Type props
    selectedInvolvementType,
    setSelectedInvolvementType,

    // Country Type props
    selectedCountryType,
    setSelectedCountryType,

    // Nationality Type props
    selectedNationalityType,
    setSelectedNationalityType,

    // Date of Birth props
    dateOfBirth,
    setDateOfBirth,
    handleOpenDateOfBirth,
    setOpenDateOfBirth,
    openDateOfBirth,
}) => {

    // Fetch ddl options from SQLite database
    useEffect(() => {
        console.log("sex:" , SystemCode.sex);
        setSexOptions(SystemCode.sex);
        setIdTypeList(SystemCode.idTypeCode);
        setInvolvementTypeList(SystemCode.pedestrianType);
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
    
    const [idTypeList, setIdTypeList] = useState([]);
    const [involvementTypeList, setInvolvementTypeList] = useState([]);
    const [countryTypeList, setCountryTypeList] = useState([]);
    const [nationalityTypeList, setNationalityTypeList] = useState([]);
    const [sexOptions, setSexOptions] = useState([]);
    
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
                        <Text style={styles.Label}> Offender Name</Text>
                    </Text>
                    <TextInput
                        style={styles.RoundedTextInputWhiteFont}
                        value={name}
                        onChangeText={text => setName(text)}
                    />
                </View>

                <View style={styles.FrameRow}>
                    <View style={stylesOSI.ThirdFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> Offender Involvement </Text>
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
                            data={involvementTypeList}
                            value={selectedInvolvementType}
                            onChange={item => {
                                setSelectedInvolvementType(item.value);
                            }}
                        />
                    </View>
                    <View style={stylesOSI.ThirdFrameContainer}>
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
                    <View style={stylesOSI.ThirdFrameContainer}>
                        <Text>
                            <Text style={styles.Label}>ID No. </Text>
                            <Text style={styles.LabelImpt}> (*)</Text>
                        </Text>
                        <TextInput
                            style={styles.RoundedTextInputWhiteFont}
                            autoCapitalize='characters'
                            value={idNo}
                            onChangeText={(text) => setIdNo(text)}
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
                            textColor="black"
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

                <View style={styles.FrameRow}>
                    <View style={styles.HalfFrameContainer}>
                        <Text>
                            <Text style={styles.Label}> Birth Country </Text>
                            { (selectedIdType === 4 || selectedIdType === '4') && (
                                <Text style={styles.LabelImpt}> (*)</Text>
                            )}
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
                            { (selectedIdType === 4 || selectedIdType === '4') && (
                                <Text style={styles.LabelImpt}> (*)</Text>
                            )}
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

                <View style={styles.FullFrame}>
                    <Text>
                        <Text style={styles.Label}> Remarks </Text>
                        <Text style={styles.LabelThin}> (255 Characters) </Text>
                    </Text>
                    <View style={styles.TextInputWrapper}>
                        <TextInput
                            style={styles.RoundedLongTextInputMediumWhiteFont}
                            multiline
                            editable
                            textAlignVertical="top"
                            value={remarks}
                            onChangeText={text => setRemarks(text)}
                            maxLength={255}
                        />
                        <Text style={styles.CharCounter}>{remarks?.length}/255</Text>
                    </View>
                </View>
            </View>
            )}
        </View>
    );
};

export default OffenderIdentity;
