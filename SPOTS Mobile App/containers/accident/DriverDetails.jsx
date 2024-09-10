import React, { useState, useEffect, forwardRef } from 'react';
import { View, SafeAreaView, Alert } from 'react-native';
import styles from '../../components/spots-styles';
import DriverIdentity from '../common/DriverIdentity';
import Address from '../common/Address';
import Treatment from '../common/Treatment';
import WhiteButton from '../../components/common/WhiteButton';
import BlueButton from '../../components/common/BlueButton';
import { validateDateIsFutureDate, validateIdNo } from '../../utils/Validator';

const DriverDetails = forwardRef(({ navigation, driver, saveDriver, saveRecord }, ref) => {

    const [expandedSection, setExpandedSection] = useState(null);
    const toggleSection = (sectionNumber) => { setExpandedSection(sectionNumber === expandedSection ? null : sectionNumber); };

    const [selectedIdType, setSelectedIdType] = useState('');
    const [selectedLicenseType, setSelectedLicenseType] = useState('');
    const [selectedCountryType, setSelectedCountryType] = useState('');
    const [selectedNationalityType, setSelectedNationalityType] = useState('');
    const [selectedAddressType, setSelectedAddressType] = useState('');
    const [selectedHospital, setSelectedHospital] = useState('');
    const [toggleSameAddress, setToggleSameAddress] = useState(false);
    const [age, setAge] = useState("");

    //date picker Expiry Date
    const [openExpiryDate, setOpenExpiryDate] = useState(false);
    const [expiryDate, setExpiryDate] = useState(null);
    const handleOpenExpiryDate = () => { setOpenExpiryDate(true); };

    //date picker Date Of Birth
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [openDateOfBirth, setOpenDateOfBirth] = useState(false);
    const handleOpenDateOfBirth = () => { setOpenDateOfBirth(true); };

    //radio button Sex
    const [selectedSex, setSelectedSex] = useState(null);
    const handleSexRadioButtonChange = (value) => { setSelectedSex(value); };
    
    //radio button Driver License
    const [selectedDriverLicense, setSelectedDriverLicense] = useState([]);
    const handleDriverLicenseChange = (value) => {
        setSelectedDriverLicense((prevSelected) =>
            prevSelected.includes(value)
                ? prevSelected.filter((item) => item !== value)
                : [...prevSelected, value]
        );
    };
    
    const [selectedAlcoholicBreath, setSelectedAlcoholicBreath] = useState('');
    const handleAlcoholicBreathChange = (value) => { setSelectedAlcoholicBreath(value); };

    const [selectedBreathalyserResult, setSelectedBreathalyserResult] = useState('');
    const handleBreathalyserResultChange = (value) => { setSelectedBreathalyserResult(value); };

    //date picker Ambulance Arrival Time
    const [ambulanceArrivalTime, setAmbulanceArrivalTime] = useState(null);
    const [openAmbulanceArrivalTime, setOpenAmbulanceArrivalTime] = useState(false);
    const handleOpenAmbulanceArrivalTime = () => { setOpenAmbulanceArrivalTime(true);};

    //date picker Ambulance Departure Time
    const [ambulanceDepartureTime, setAmbulanceDepartureTime] = useState(null);
    const [openAmbulanceDepartureTime, setOpenAmbulanceDepartureTime] = useState(false);
    const handleOpenAmbulanceDepartureTime = () => { setOpenAmbulanceDepartureTime(true); };

    //Identity Input
    const [driverName, setDriverName] = useState('');
    const [idNo, setIdNo] = useState('');
    const [otherLicense, setOtherLicense] = useState('');
    const [breathalyzerNo, setBreathalyzerNo] = useState('');
    const [injuryDriver, setInjuryDriver] = useState('');
    const [contact1, setContact1] = useState('');
    const [contact2, setContact2] = useState('');

    //Address Input
    const [block, setBlock] = useState('');
    const [street, setStreet] = useState('');
    const [floor, setFloor] = useState('');
    const [unitNo, setUnitNo] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [addressRemarks, setAddressRemarks] = useState('');

    //Treatment Input
    const [ambulanceNo, setAmbulanceNo] = useState('');
    const [aoIdentity, setAoIdentity] = useState('');
    const [others, setOthers] = useState('');

    React.useImperativeHandle(ref, () => ({
        validate: async () => await handleSave(false),
    }));

    useEffect(() => {
        if (driver) {
            console.log("driver >> " , driver);

            setDriverName(driver.driverName || '');
            setIdNo(driver.idNo || '');
            setOtherLicense(driver.otherLicense || '');
            setBreathalyzerNo(driver.breathalyzerNo || '');
            setInjuryDriver(driver.injuryDriver || '');
            setContact1(driver.contact1 || '');
            setContact2(driver.contact2 || '');
            setBlock(driver.block || '');
            setStreet(driver.street || "");
            setFloor(driver.floor || '');
            setUnitNo(driver.unitNo || '');
            setBuildingName(driver.buildingName || '');
            setPostalCode(driver.postalCode || '');
            setAddressRemarks(driver.addressRemarks || '');
            setAmbulanceNo(driver.ambulanceNo || '');
            setAoIdentity(driver.aoIdentity || '');
            setOthers(driver.others || '');

            setSelectedIdType(driver.selectedIdType || '');
            setSelectedLicenseType(driver.selectedLicenseType || '');
            setSelectedCountryType(driver.selectedCountryType || '');
            setSelectedNationalityType(driver.selectedNationalityType || '');
            setSelectedAlcoholicBreath(driver.selectedAlcoholicBreath || '');
            setSelectedAddressType(driver.selectedAddressType || '');
            setSelectedBreathalyserResult(driver.selectedBreathalyserResult || '');
            setExpiryDate(driver.expiryDate || '');
            setToggleSameAddress(driver.toggleSameAddress || '');
            setDateOfBirth(driver.dateOfBirth || '');
            setSelectedSex(driver.selectedSex || '');
            setSelectedDriverLicense(driver.selectedDriverLicense || []);
            setSelectedHospital(driver.selectedHospital || '');
            setAmbulanceArrivalTime(driver.ambulanceArrivalTime || '');
            setAmbulanceDepartureTime(driver.ambulanceDepartureTime || '');
        }
    }, [driver]);

    // Calculate age when dateOfBirth changes
    useEffect(() => {
        if (dateOfBirth) {
            const ageString = calculateAgeString(dateOfBirth);
            setAge(ageString);
        }
    }, [dateOfBirth]);

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

    const validateForm = () => {

        if (!selectedIdType) {
            Alert.alert('Validation Error', `Please select ID Type.`);
            return false;
        }

        if (!idNo) {
            Alert.alert('Validation Error', `Please enter ID No.`);
            return false;
        }
        
        if (!validateIdNo(selectedIdType, idNo)) {
            Alert.alert('Validation Error', `Invalid ID Number.`);
            return false;
        }

        if (!selectedLicenseType) {
            Alert.alert('Validation Error', `Please select License Type.`);
            return false;
        }

        if (dateOfBirth){
            if (validateDateIsFutureDate(dateOfBirth)){
                Alert.alert('Validation Error', `Date of Birth cannot be future date.`);
                return false;
            }
        }

        if (!toggleSameAddress) {
            if (!selectedAddressType){
                Alert.alert('Validation Error', `Please select Address Type.`);
                return false;
            }
            if (!block){
                Alert.alert('Validation Error', `Please enter Block/House No.`);
                return false;
            }
            if (!street){
                Alert.alert('Validation Error', `Please enter Street.`);
                return false;
            }
            if (!floor){
                Alert.alert('Validation Error', `Please enter Floor.`);
                return false;
            }
            if (!unitNo){
                Alert.alert('Validation Error', `Please enter Unit No.`);
                return false;
            }
            if (!postalCode){
                Alert.alert('Validation Error', `Please enter Postal Code.`);
                return false;
            }
        }

        return true;
    };

    const handleSave = async (isBackToList = false) => {

        if (!validateForm()){
            return false;
        }

        const updatedDriver = {
            ...driver,
            driverName,
            idNo,
            otherLicense,
            breathalyzerNo,
            injuryDriver,
            contact1,
            contact2,
            block,
            street,
            floor,
            unitNo,
            buildingName,
            postalCode,
            addressRemarks,
            ambulanceNo,
            aoIdentity,
            others,
            selectedIdType,
            selectedLicenseType,
            selectedCountryType,
            selectedNationalityType,
            selectedAlcoholicBreath,
            selectedBreathalyserResult,
            selectedAddressType,
            expiryDate,
            toggleSameAddress,
            dateOfBirth,
            selectedSex,
            selectedDriverLicense,
            selectedHospital,
            ambulanceArrivalTime,
            ambulanceDepartureTime,
        };

        console.log(`handleSave >> backToList? ${isBackToList}; updatedDriver >>` , updatedDriver);

        if (isBackToList) {
            saveRecord(updatedDriver);
        } else {
            saveDriver(updatedDriver);
        }

        return true;
    };

    return (
        <View style={styles.ContainerGreyBG}>
            <SafeAreaView>
                <View style={styles.ComponentFrame}> 

                    <DriverIdentity
                        styles={styles} 
                        toggleSection={toggleSection} 
                        expandedSection={expandedSection} 

                        driverName={driverName}
                        setDriverName={setDriverName}

                        idNo={idNo}
                        setIdNo={setIdNo}

                        otherLicense={otherLicense}
                        setOtherLicense={setOtherLicense}

                        breathalyzerNo={breathalyzerNo}
                        setBreathalyzerNo={setBreathalyzerNo}

                        injuryDriver={injuryDriver}
                        setInjuryDriver={setInjuryDriver}

                        contact1={contact1}
                        setContact1={setContact1}

                        contact2={contact2}
                        setContact2={setContact2}

                        // ID Type props
                        selectedIdType={selectedIdType}
                        setSelectedIdType={setSelectedIdType}

                        // License Type props
                        selectedLicenseType={selectedLicenseType}
                        setSelectedLicenseType={setSelectedLicenseType}

                        // Expiry Date props
                        expiryDate={expiryDate}
                        setExpiryDate={setExpiryDate}
                        handleOpenExpiryDate={handleOpenExpiryDate}
                        setOpenExpiryDate={setOpenExpiryDate}
                        openExpiryDate={openExpiryDate}

                        // Date of Birth props
                        dateOfBirth={dateOfBirth}
                        setDateOfBirth={setDateOfBirth}
                        handleOpenDateOfBirth={handleOpenDateOfBirth}
                        setOpenDateOfBirth={setOpenDateOfBirth}
                        openDateOfBirth={openDateOfBirth}

                        // Age props
                        age={age}
                        setAge={setAge}

                        // Sex props
                        selectedSex={selectedSex}
                        handleSexRadioButtonChange={handleSexRadioButtonChange}

                        // Driver License Class props
                        selectedDriverLicense={selectedDriverLicense}
                        handleDriverLicenseChange={handleDriverLicenseChange}

                        // Country Type props
                        selectedCountryType={selectedCountryType}
                        setSelectedCountryType={setSelectedCountryType}

                        // Nationality Type props
                        selectedNationalityType={selectedNationalityType}
                        setSelectedNationalityType={setSelectedNationalityType}

                        // Alcoholic Breath props
                        selectedAlcoholicBreath={selectedAlcoholicBreath}
                        setSelectedAlcoholicBreath={setSelectedAlcoholicBreath}
                        handleAlcoholicBreathChange={handleAlcoholicBreathChange}

                        // Breathalyser Result props
                        selectedBreathalyserResult={selectedBreathalyserResult}
                        setSelectedBreathalyserResult={setSelectedBreathalyserResult}
                        handleBreathalyserResultChange={handleBreathalyserResultChange}
                    />   

                    {/* Section 2 */}
                    <Address
                        styles={styles} 
                        toggleSection={toggleSection} 
                        expandedSection={expandedSection} 

                        block={block}
                        setBlock={setBlock}

                        street={street}
                        setStreet={setStreet}

                        floor={floor}
                        setFloor={setFloor}

                        unitNo={unitNo}
                        setUnitNo={setUnitNo}

                        buildingName={buildingName}
                        setBuildingName={setBuildingName}

                        postalCode={postalCode}
                        setPostalCode={setPostalCode}
                        
                        addressRemarks={addressRemarks}
                        setAddressRemarks={setAddressRemarks}
                        
                        // Address Type props
                        selectedAddressType={selectedAddressType}
                        setSelectedAddressType={setSelectedAddressType}

                        // Same Address props
                        toggleSameAddress={toggleSameAddress}
                        setToggleSameAddress={setToggleSameAddress}
                    />

                    {/* Section 3 */}
                    <Treatment
                        styles={styles} 
                        toggleSection={toggleSection} 
                        expandedSection={expandedSection} 

                        ambulanceNo={ambulanceNo}
                        setAmbulanceNo={setAmbulanceNo}

                        aoIdentity={aoIdentity}
                        setAoIdentity={setAoIdentity}
                        
                        others={others}
                        setOthers={setOthers}
                        
                        // Same Address props
                        toggleSameAddress={toggleSameAddress}
                        setToggleSameAddress={setToggleSameAddress}

                        // Hospital props
                        selectedHospital={selectedHospital}
                        setSelectedHospital={setSelectedHospital}

                        // Ambulance Arrival props
                        openAmbulanceArrivalTime={openAmbulanceArrivalTime} 
                        ambulanceArrivalTime={ambulanceArrivalTime}
                        handleOpenAmbulanceArrivalTime={handleOpenAmbulanceArrivalTime}
                        setOpenAmbulanceArrivalTime={setOpenAmbulanceArrivalTime}
                        setAmbulanceArrivalTime={setAmbulanceArrivalTime}

                        // Ambulance Departure props
                        openAmbulanceDepartureTime={openAmbulanceDepartureTime} 
                        ambulanceDepartureTime={ambulanceDepartureTime}
                        handleOpenAmbulanceDepartureTime={handleOpenAmbulanceDepartureTime}
                        setOpenAmbulanceDepartureTime={setOpenAmbulanceDepartureTime}
                        setAmbulanceDepartureTime={setAmbulanceDepartureTime}
                    />
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

export default DriverDetails;