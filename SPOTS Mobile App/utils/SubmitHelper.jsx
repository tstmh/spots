import AccidentReport from "../models/AccidentReport";
import Images from "../models/Images";
import PartiesInvolved from "../models/PartiesInvolved";
import { submitAccidentReportAPI, submitImagesAPI, submitOffenceAPI, submitOffenderAPI, submitPartiesInvolvedAPI, submitSummonsAPI } from "./ApiService";
import DatabaseService from "./DatabaseService";
import { formatToUpperCase, formatBased64, formatTimeStamp } from "./Formatter";
import { Alert } from "react-native";
import { fetch } from "@react-native-community/netinfo";
import { validateIsFutureDate } from "./Validator";
import Summons from "../models/Summons";
import Offenders from "../models/Offenders";
import Offences from "../models/Offences";
import TIMSOffenceCode from "../models/TIMSOffenceCode";

const defaultStatus = 1;
const statusAccReport = 2; 
const statusParties = 3;
const statusImage = 4;

const validateAccidentReport = (data) => {
    console.log('validateAccidentReport' , data);

    //Location Page
    if (!data.INCIDENT_NO || data.INCIDENT_NO.trim() === "") {
        throw new Error("Invalid Incident Number");
    }
    if (!data.LOCATION_CODE || data.LOCATION_CODE.trim() === "") {
        throw new Error("Invalid Road 1");
    }
    if (data.INCIDENT_NO === '2' || data.INCIDENT_NO === '3' || data.INCIDENT_NO === '4') {
        if (!data.LOCATION_CODE || data.LOCATION_CODE.trim() === "") {
            throw new Error("Invalid Road 2");
        }
    }
    if (data.INCIDENT_NO === '2' || data.INCIDENT_NO === '3' || data.INCIDENT_NO === '4') {
        if (!data.LOCATION_CODE || data.LOCATION_CODE.trim() === "") {
            throw new Error("Invalid Road 2");
        }
    }
    if (data.SPECIAL_ZONE === 2 || data.SPECIAL_ZONE === 3) {
        if (!data.SCHOOL_NAME) {
            throw new Error("Invalid School Name");
        };
    }

    //Officer Declaration
    if (!data.PO_ARRIVAL_TIME || data.PO_ARRIVAL_TIME.trim() === "") {
        throw new Error("Invalid PO Arrival Date Time");
    }
    if (!data.PO_RESUME_DUTY_TIME || data.PO_RESUME_DUTY_TIME.trim() === "") {
        throw new Error("Invalid Resume Patrol Duty Date Time");
    }
    if (!data.WEATHER_CODE) {
        throw new Error("Invalid Weather");
    }
    if (!data.ROAD_SURFACE_CODE) {
        throw new Error("Invalid Road Surface");
    }
    if (!data.TRAFFIC_VOLUME_CODE) {
        throw new Error("Invalid Traffic Volume");
    }
    if (data.WEATHER_CODE === 3){
        if (!data.WEATHER_OTHER_CODE){
            throw new Error("Invalid Other Weather");
        }
    }
    if (data.ROAD_SURFACE_CODE === 3){
        if (!data.ROAD_SURFACE_OTHER){
            throw new Error("Invalid Other Road Surface");
        }
    }

    if (validateIsFutureDate(data.PO_ARRIVAL_TIME)){
        throw new Error("Invalid PO Arrival Date Time");
    }
    if (validateIsFutureDate(data.PO_RESUME_DUTY_TIME)){
        throw new Error("Invalid Resume Patrol Duty Date Time");
    }
    if (validateIsFutureDate(data.PRESERVE_DATE)){
        throw new Error("Invalid Preserved Date Time");
    }

    //validate INCIDENT_NO?
    return true;
};

const validatePartiesInvolved = (data) => {
    console.log('validatePartiesInvolved' , data.length);

    if (data.length == 0){
        return true;
    }

    data.forEach(data => {
        console.log('data', data);
    });

    /*ADDITIONAL VALIDATION IF ID TYPE IS PASSPORT OR OTHERS*/
    return true;
};

const validateImages = (data) => {
    // Add your validation logic here
    return true;
};

const fetchAndValidateData = async (ID) => {
    try {
        const accidentReportData = await AccidentReport.getAccidentsById(DatabaseService.db, ID);
        if (!validateAccidentReport(accidentReportData)) {
            throw new Error("Invalid accident report data");
        }

        const partiesInvolvedData = await PartiesInvolved.getPartiesInvolvedByAccidentID(DatabaseService.db, ID);
        if (!validatePartiesInvolved(partiesInvolvedData)) {
            throw new Error("Invalid parties involved data");
        }

        const imagesData = await Images.getImagesByAccidentID(DatabaseService.db, ID);
        if (!validateImages(imagesData)) {
            throw new Error("Invalid images data");
        }

        const incidentNo = accidentReportData?.INCIDENT_NO;

        return {
            accidentReportData,
            partiesInvolvedData,
            imagesData,
            incidentNo
        };
    } catch (error) {
        console.error("Validation failed:", error);
        Alert.alert("Validation Error", error.message);
        return null;
    }
};

const validateSummons = (data) => {
    console.log('validateSummons' , data);

    //Location Page
    if (!data.INCIDENT_NO || data.INCIDENT_NO.trim() === "") {
        throw new Error("Invalid Incident Number");
    }
    if (!data.LOCATION_CODE || data.LOCATION_CODE.trim() === "") {
        throw new Error("Invalid Road 1");
    }
    if (data.INCIDENT_NO === '2' || data.INCIDENT_NO === '3' || data.INCIDENT_NO === '4') {
        if (!data.LOCATION_CODE || data.LOCATION_CODE.trim() === "") {
            throw new Error("Invalid Road 2");
        }
    }
    if (data.INCIDENT_NO === '2' || data.INCIDENT_NO === '3' || data.INCIDENT_NO === '4') {
        if (!data.LOCATION_CODE || data.LOCATION_CODE.trim() === "") {
            throw new Error("Invalid Road 2");
        }
    }
    if (data.SPECIAL_ZONE === 2 || data.SPECIAL_ZONE === 3) {
        if (!data.SCHOOL_NAME) {
            throw new Error("Invalid School Name");
        };
    }

    //validate INCIDENT_NO?
    return true;
};

export const submitOSI = async (ID, officerID) => {

    const validatedData = await fetchAndValidateData(ID);
    console.log("submitOSI validatedData ", validatedData);
    if (!validatedData) return;

    console.log("submitOSI with ", ID);
    //_fnProcessAccidentReport, _fnProcessPartiesInvolved, _fnProcessImages

    //check network connectivity
    const state = await fetch();
        
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);

    if (state.isConnected === false){
        console.log('No network connectivity');
        Alert.alert("Connection failed.", "No network connectivity.");
        return false; // Exit the submit function
    } 

    try {
        const { accidentReportData, partiesInvolvedData, imagesData, incidentNo } = validatedData;

        const accidentReportId = await submitAccidentReport(accidentReportData);
        console.log('accidentReportId', accidentReportId);

        if (!accidentReportId) {
            console.log('Failed to submit accident report');
            Alert.alert("Submit Error on Accident Report.", "Cannot connect to the server.");
            return false;
        }

        console.log('submitPartiesInvolved ', ID, incidentNo, officerID, partiesInvolvedData);
        const partiesInvolvedResult = await submitPartiesInvolved(ID, incidentNo, officerID, partiesInvolvedData);
        console.log('partiesInvolvedResult ', partiesInvolvedResult);

        if (!partiesInvolvedResult) {
            console.log('Failed to submit parties involved');
            Alert.alert("Submit Error on Accident Report.", "Error submitting parties involved.");
            return false;
        }

        console.log('submitImage ', ID, incidentNo, officerID, imagesData);
        const imageSubmissionResult = await submitImage(ID, incidentNo, officerID, imagesData);
        console.log('imageSubmissionResult ', imageSubmissionResult);

        if (!imageSubmissionResult) {
            console.log('Failed to submit images');
            Alert.alert("Submit Error on Accident Report.", "Error submitting images.");
            return false;
        }

        console.log('All submissions completed successfully');
        Alert.alert('Submit Successfully', `Incident ${incidentNo} has been successfully submitted`);
        return true

    } catch (error) {
        console.error('Error in submitOSI:', error);
        Alert.alert("Submit Error on Accident Report", "Cannot connect to the server.");
        return false;
    }
};

export const submitAccidentReport = async (data) => {

    //const data = await AccidentReport.getAccidentsById(DatabaseService.db, ID);
    console.log(`retrieved AccidentReport`, data);

    const newData = {
        ID : data.ID,
        INCIDENT_NO : formatToUpperCase(data.INCIDENT_NO),
        DEVICE_ID : '',
        OFFICER_ID : data.OFFICER_ID,
        IO_NAME : data.IO_NAME,
        IO_EXTENSION_NO : formatToUpperCase(data.IO_EXTENSION_NO),
        INCIDENT_OCCURED : data.INCIDENT_OCCURED,
        LOCATION_CODE : data.LOCATION_CODE? data.LOCATION_CODE.trim() : null,
        LOCATION_CODE_2 : data.LOCATION_CODE_2? data.LOCATION_CODE_2.trim() : null,
        SPECIAL_ZONE : data.SPECIAL_ZONE,
        REMARKS_LOCATION : data.REMARKS_LOCATION,
        CREATED_AT : data.CREATED_AT,
        STATUS_ID : data.STATUS_ID,  /* If status >1, then Accident Report is now existing */
        STRUCTURE_DAMAGES : data.STRUCTURE_DAMAGES,
        WEATHER_CODE : data.WEATHER_CODE,
        WEATHER_OTHER_CODE : formatToUpperCase(data.WEATHER_OTHER_CODE),
        ROAD_SURFACE_CODE : data.ROAD_SURFACE_CODE,
        ROAD_SURFACE_OTHER : formatToUpperCase(data.ROAD_SURFACE_OTHER),
        TRAFFIC_VOLUME_CODE : data.TRAFFIC_VOLUME_CODE,
        DECLARATION_INDICATOR : data.DECLARATION_INDICATOR,
        OFFICER_RANK : formatToUpperCase(data.OFFICER_RANK),
        DIVISION : formatToUpperCase(data.DIVISION),
        DECLARATION_DATE : formatTimeStamp(),
        PRESERVE_DATE : data.PRESERVE_DATE,
        SCHOOL_NAME : formatToUpperCase(data.SCHOOL_NAME),
        ACCIDENT_TIME : data.ACCIDENT_TIME,
        PO_ARRIVAL_TIME : data.PO_ARRIVAL_TIME,
        PO_RESUME_DUTY_TIME : data.PO_RESUME_DUTY_TIME,
    };

    console.log("submitting accidentReport", newData);
    
    const success = await submitAccidentReportAPI(newData);
    console.log(`successfully submitted accident report ${newData.INCIDENT_NO}, `, success);
    if (success) {
        //update status ONLY IF SUCCESSFUL 
        console.log(`successfully submitted accident report ${newData.INCIDENT_NO}, updating status ${statusAccReport}`);
        const updateSuccess = await AccidentReport.updateStatus(DatabaseService.db, newData.ID, newData.INCIDENT_NO, statusAccReport);
        console.log(`Update status accident report ${newData.INCIDENT_NO} >> `, updateSuccess);
        return success;
    }
    return false;
};

export const submitPartiesInvolved = async (ID, incidentNo, officerID, data) => {

    //const data = await PartiesInvolved.getPartiesInvolvedByAccidentID(DatabaseService.db, ID)
    console.log(`retrieved PartiesInvolved ${data.length} with ID ${ID}, incidentNo ${incidentNo}`, data);

    if (data.length === 0){
        // If no results from images,parties involved then we update to last status and resolved it.
        console.log(`no results from parties involved, update to its last status`)
        AccidentReport.updateStatus(DatabaseService.db, ID, incidentNo, statusParties);
        return true;
    }

    const newData = data.map(row => ({
        ID : row.ID,
        INCIDENT_NO : formatToUpperCase(incidentNo),
        DEVICE_ID : '',
        OFFICER_ID : officerID,
        PERSON_TYPE_ID : row.PERSON_TYPE_ID,
        INVOLVEMENT_ID : row.INVOLVEMENT_ID,
        REGISTRATION_NO : formatToUpperCase(row.REGISTRATION_NO),
        LOCAL_PLATE : row.LOCAL_PLATE,
        SPECIAL_PLATE : row.SPECIAL_PLATE,
        MAKE_CODE: row.MAKE_CODE? row.MAKE_CODE.trim() : null,
        TYPE_CODE: row.TYPE_CODE? row.TYPE_CODE.trim() : null,
        MODEL : formatToUpperCase(row.MODEL),
        COLOR : formatToUpperCase(row.COLOR),
        COLOR_CODE : row.COLOR_CODE,
        IN_FLAME : row.IN_FLAME,
        ALCOHOL_BREATH : row.ALCOHOL_BREATH,
        BREATHALYZER_NO : formatToUpperCase(row.BREATHALYZER_NO),
        BREATHALYZER_RESULT : row.BREATHALYZER_RESULT,
        NAME : formatToUpperCase(row.NAME),
        ID_TYPE : row.ID_TYPE,
        IDENTIFICATION_NO : formatToUpperCase(row.IDENTIFICATION_NO),
        DATE_OF_BIRTH : row.DATE_OF_BIRTH,
        SEX_CODE : row.GENDER_CODE,
        LICENSE_TYPE_CODE : row.LICENSE_TYPE_CODE,
        LICENSE_EXPIRY_DATE : row.LICENSE_EXPIRY_DATE,
        LICENSE_CLASS_CODE : row.LICENSE_CLASS_CODE,
        BIRTH_COUNTRY : row.BIRTH_COUNTRY,
        NATIONALITY : row.NATIONALITY,
        CONTACT_1 : row.CONTACT_1,
        CONTACT_2 : row.CONTACT_2,
        REMARKS_DEGREE_INJURY : row.REMARKS_DEGREE_INJURY,
        REMARKS_IDENTIFICATION : row.REMARKS_IDENTIFICATION,
        ADDRESS_TYPE : row.ADDRESS_TYPE,
        SAME_AS_REGISTERED : row.SAME_AS_REGISTERED,
        BLOCK : formatToUpperCase(row.BLOCK),
        STREET : formatToUpperCase(row.STREET),
        FLOOR : row.FLOOR,
        UNIT_NO : formatToUpperCase(row.UNIT_NO),
        BUILDING_NAME : formatToUpperCase(row.BUILDING_NAME),
        POSTAL_CODE : row.POSTAL_CODE,
        REMARKS_ADDRESS : row.REMARKS_ADDRESS,
        AMBULANCE_NO : formatToUpperCase(row.AMBULANCE_NO),
        AMBULANCE_AO_ID : formatToUpperCase(row.AMBULANCE_AO_ID),
        AMBULANCE_ARRIVAL : row.AMBULANCE_ARRIVAL,
        AMBULANCE_DEPARTURE : row.AMBULANCE_DEPARTURE,
        HOSPITAL_ID : row.HOSPITAL_ID,
        HOSPITAL_OTHER : formatToUpperCase(row.HOSPITAL_OTHER),
        REMARKS_VEHICLE : row.REMARKS_VEHICLE,
        VEHICLE_SEQUENCE : row.VEHICLE_SEQUENCE,
        OTHER_LICENCE : formatToUpperCase(row.OTHER_LICENCE),
        CATEGORY_CODE : row.CATEGORY_CODE,
    }));

    try {
        for (const parties of newData) {
            const result = await submitPartiesInvolvedAPI(parties); 
            if (!result) {
                console.error(`${newData.INCIDENT_NO} submission failed for Parties Involved with ID ${parties.ID} , updating status ${defaultStatus}` );
                AccidentReport.updateStatus(DatabaseService.db, ID, incidentNo, defaultStatus);
                return false; 
            }
        }
    
        //update status in sqlite database ONLY IF ALL SUCCESSFUL 
        console.log(`successfully submitted Parties Involved ${incidentNo}, updating status ${statusParties}`);
        AccidentReport.updateStatus(DatabaseService.db, ID, incidentNo, statusParties);

        return true; 
    } catch (error) {
        console.error('Error in submitting Parties Involved', error);
        return false;
    }
};

export const submitImage = async (ID, incidentNo, officerID, data) => {

    //const data = await Images.getImagesByAccidentID(DatabaseService.db, ID);
    console.log(`retrieved Images ${data.length} with ID ${ID}, incidentNo ${incidentNo}`);
    
    if (data.length === 0){
        // If no results from images,parties involved then we update to last status and resolved it.
        console.log(`no results from images, update to its last status`)
        AccidentReport.updateStatus(DatabaseService.db, ID, incidentNo, statusImage);
        return true;
    }

    //Delete properties not needed.
    const newData = data.map(row => ({
        ID: row.ID,
        ACCIDENT_REPORT_ID: formatToUpperCase(row.ACCIDENT_REPORT_ID),
        INCIDENT_NO: formatToUpperCase(incidentNo),
        DEVICE_ID: '',
        OFFICER_ID: officerID,
        IMAGE_TYPE: row.IMAGE_TYPE,
        CAPTION: formatToUpperCase(row.CAPTION),
        IMAGE64: formatBased64(row.IMAGE64),
        CREATED_AT: row.CREATED_AT,
        REGISTRATION_NO: row.REGISTRATION_NO,
        MAKE_CODE: row.MAKE_CODE? row.MAKE_CODE.trim() : null,
        TYPE_CODE: row.TYPE_CODE? row.TYPE_CODE.trim() : null,
        COLOR: formatToUpperCase(row.COLOR),
        COLOR_CODE: row.COLOR_CODE,
        PLATE_DISPLAYED: row.PLATE_DISPLAYED,
        ACCIDENT_DATE: row.ACCIDENT_DATE,
        EXAMINATION_DATE: row.EXAMINATION_DATE,
        INCIDENT_OCCURED: row.INCIDENT_OCCURED,
        LOCATION_CODE: row.LOCATION_CODE? row.LOCATION_CODE.trim() : null,
        LOCATION_CODE_2: row.LOCATION_CODE_2? row.LOCATION_CODE_2.trim() : null
    }));

    try {
        for (const image of newData) {
            const result = await submitImagesAPI(image); 
            if (!result) {
                console.error(`${newData.INCIDENT_NO} submission failed for Images with ID ${image.ID} , updating status ${defaultStatus}` );
                AccidentReport.updateStatus(DatabaseService.db, ID, incidentNo, defaultStatus);
                return false; 
            }
        }
    
        //update status in sqlite database ONLY IF ALL SUCCESSFUL 
        console.log(`successfully submitted Images ${incidentNo}, updating status ${statusImage}`);
        AccidentReport.updateStatus(DatabaseService.db, ID, incidentNo, statusImage);
        return true; 
    } catch (error) {
        console.error('Error in submitting Images', error);
        return false;
    }
};


export const submitSummonsReport = async (ID) => {

    //TODO validations for Summons
    //const validatedData = await fetchAndValidateEchoData(ID); 
    //if (!validatedData) return;

    console.log("submitSummonsReport with ", ID);
    //_fnProcessSummons, _fnProcessOffenders, _fnProcessOffences

    //check network connectivity
    const state = await fetch();
        
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);

    if (state.isConnected === false){
        console.log('No network connectivity');
        Alert.alert("Connection failed.", "No network connectivity.");
        return false; // Exit the submit function
    } 

    try {

        const data = await Summons.getSummonsReportById(DatabaseService.db, ID);
        console.log(`retrieved summons with ID ${ID}`, data);

        const summonId = await submitSummons(data);
        console.log('submitSummons ', summonId);

        if (summonId == false) {
            console.log('Failed to submit Summons');
            Alert.alert("Submit Error on Summons", "Error submitting summons.");
            return false;
        }

        const offendersResult = await submitOffenders(ID, summonId, data.ID, data.SPOTS_ID);
        console.log("offendersResult", offendersResult);
        if (!offendersResult) {
            console.log('Failed to submit offenders');
            Alert.alert("Submit Error on Summons", "Error submitting offenders.");
            return false;
        }

        const offencesResult = await submitOffences(ID, summonId);
        console.log("offencesResult", offencesResult);
        if (!offencesResult) {
            console.log('Failed to submit offences');
            Alert.alert("Submit Error on Summons", "Error submitting offences.");
            return false;
        }

        // all ok then update summon status to 3
        console.log(`successfully submitted Summons ${summonId}, updating status 3`);
        await Summons.updateStatus(DatabaseService.db, ID, 3);
        
        Alert.alert("Summon has been successfully submitted");
        //ToastAndroid.show("Summon has been successfully submitted", ToastAndroid.SHORT);
        return true;

    } catch (error) {
        console.error('Error in submitSummonsReport:', error);
        Alert.alert("Submit Error on Summons. Cannot connect to the server.");
        return false;
    }
};

const fetchAndValidateSummonsData = async (ID) => {
    try {
        const summonData = await Summons.getSummonsReportById(DatabaseService.db, ID);
        if (!validateSummons(summonData)) {
            throw new Error("Invalid summon data");
        }

        const offenderData = await PartiesInvolved.getPartiesInvolvedByAccidentID(DatabaseService.db, ID);
        if (!validatePartiesInvolved(offenderData)) {
            throw new Error("Invalid offender data");
        }

        const offenceData = await Images.getImagesByAccidentID(DatabaseService.db, ID);
        if (!validateImages(offenceData)) {
            throw new Error("Invalid offence data");
        }

        return {
            summonData,
            offenderData,
            offenceData
        };
    } catch (error) {
        console.error("Validation failed:", error);
        Alert.alert("Validation Error", error.message);
        return null;
    }
};

export const submitSummons = async (data) => {

    data.SCHOOL_NAME = formatToUpperCase(data.SCHOOL_NAME);

    console.log("submitting Summons", data);
    
    const summonId = await submitSummonsAPI(data);
    console.log(`submitSummonsAPI ${data.SPOTS_ID} summonId ${summonId}`);
    return summonId;
};

export const submitOffenders = async (ID, summonId, SUMMONS_ID, SPOTS_ID) => {

    const data = await Offenders.getOffendersReportBySummonsID(DatabaseService.db, ID)
    console.log(`retrieved offencers ${data.length} with ID ${ID}`, data);

    //get offence date time if echo
    const offenceDateTime = await Offences.getOffenceDateTimeByOffender(DatabaseService.db, SUMMONS_ID, SPOTS_ID);
        
    const formattedData = data.map(item => ({
        ...item,
        SUMMONS_ID: summonId,
        SPOTS_ID: SPOTS_ID,
        IDENTIFICATION_NO: formatToUpperCase(item.IDENTIFICATION_NO),
        NAME: formatToUpperCase(item.NAME),
        REGISTRATION_NO: formatToUpperCase(item.REGISTRATION_NO),
        STREET: formatToUpperCase(item.STREET),
        BUILDING_NAME: formatToUpperCase(item.BUILDING_NAME),
        BLOCK: formatToUpperCase(item.BLOCK),
        UNIT_NO: formatToUpperCase(item.UNIT_NO),
        OTHER_LICENCE: formatToUpperCase(item.OTHER_LICENCE),
        COLOR: formatToUpperCase(item.COLOR),
        WEIGHT: formatToUpperCase(item.WEIGHT),
        OFFENCE_DATE: offenceDateTime? offenceDateTime.OFFENCE_DATE : null,
        OFFENCE_TIME: offenceDateTime? offenceDateTime.OFFENCE_TIME : null,
        MAKE_CODE: item.MAKE_CODE? item.MAKE_CODE.trim() : null,
        TYPE_CODE: item.TYPE_CODE? item.TYPE_CODE.trim() : null,
        BIRTH_COUNTRY: item.BIRTH_COUNTRY? item.BIRTH_COUNTRY.trim() : null
    }));

    try {
        for (const offender of formattedData) {
            const result = await submitOffenderAPI(offender); 
            if (!result) {
                console.error(`Submission failed for offender with ID ${offender.ID}`);
                return false; 
            }
        }
    
        return true; 
    } catch (error) {
        console.error('Error in submitting Offenders', error);
        return false;
    }
};

export const submitOffences = async (ID, summonId) => {
    
    const data = await Offences.getOffencesBySummonsID(DatabaseService.db, ID, false);
    console.log(`retrieved Offences ${data.length} with ID ${summonId}`, data);

    let allSuccessful = true;

    for (const row of data) {
        console.log('submitOffences row', row);

        console.log(`row.OFFENCE_DATE`, row.OFFENCE_DATE);
        console.log(`row.OFFENCE_TIME`, row.OFFENCE_TIME);
        if (!row.OFFENCE_DATE && !row.OFFENCE_TIME){
            console.log('no offence date & time!! continue');
            continue;
        }

        const operationType = await Offenders.getOperationTypeBySummonsID(DatabaseService.db, row.SUMMONS_ID, row.SPOTS_ID)
        console.log(`retrieved operationType for ${row.ID} `, operationType);
        
        let success = false;

        console.log(`row.SPOTS_ID `, row.SPOTS_ID);

        if (row.SPOTS_ID && row.SPOTS_ID.length >= 5 && row.SPOTS_ID.slice(0, 5) === 'M401E') {
            console.log('is echo ');

            // Get speeding codes  
            const sCode = await TIMSOffenceCode.getAllTIMSSpeedingOffenceCodes(DatabaseService.db);
            //console.log('submitOffences sCode', sCode);

            const isSpeedingOffenceCode = sCode.includes(row.OFFENCE_TYPE_ID);
            console.log('offence isSpeedingOffenceCode? ', isSpeedingOffenceCode);
            // If id does not match from the speeding codes, set to null

            const updatedData = {
                ID: row.ID,
                OFFENDER_ID: row.OFFENDER_ID,
                SUMMONS_ID: summonId,
                SPOTS_ID: row.SPOTS_ID,
                OFFENCE_TYPE_ID: row.OFFENCE_TYPE_ID,
                OFFENCE_DATE: row.OFFENCE_DATE,
                OFFENCE_TIME: row.OFFENCE_TIME,
                REMARKS: row.REMARKS,
                SPEED_CLOCKED: isSpeedingOffenceCode? row.SPEED_CLOCKED : null,
                SPEED_LIMIT: isSpeedingOffenceCode? row.SPEED_LIMIT : null,
                ROAD_LIMIT: isSpeedingOffenceCode? row.ROAD_LIMIT : null,
                SPEED_LIMITER_REQUIRED: isSpeedingOffenceCode? row.SPEED_LIMITER_REQUIRED : null,
                SPEED_DEVICE_ID: isSpeedingOffenceCode? row.SPEED_DEVICE_ID : null,
                SPEED_LIMITER_INSTALLED: isSpeedingOffenceCode? row.SPEED_LIMITER_INSTALLED : null,
                SENT_INSPECTION: isSpeedingOffenceCode? row.SENT_INSPECTION : null,
                CREATED_AT: row.CREATED_AT,
                OPERATION_TYPE: operationType? operationType : 7
            }

            console.log(`submitting M401E offence ${updatedData.ID}`, updatedData);
            success = await submitOffenceAPI(updatedData);
        } else {
            const updatedData = {
                ID: row.ID,
                OFFENDER_ID: row.OFFENDER_ID,
                SUMMONS_ID: summonId,
                SPOTS_ID: row.SPOTS_ID,
                OFFENCE_TYPE_ID: row.OFFENCE_TYPE_ID,
                OFFENCE_DATE: row.OFFENCE_DATE,
                OFFENCE_TIME: row.OFFENCE_TIME,
                REMARKS: row.REMARKS,
                SPEED_CLOCKED: row.SPEED_CLOCKED,
                SPEED_LIMIT: row.SPEED_LIMIT,
                ROAD_LIMIT: row.ROAD_LIMIT,
                SPEED_LIMITER_REQUIRED: row.SPEED_LIMITER_REQUIRED,
                SPEED_DEVICE_ID: row.SPEED_DEVICE_ID,
                SPEED_LIMITER_INSTALLED: row.SPEED_LIMITER_INSTALLED,
                SENT_INSPECTION: row.SENT_INSPECTION,
                CREATED_AT: row.CREATED_AT,
                OPERATION_TYPE: operationType? operationType : 7
            }
                
            console.log(`submitting offence ${updatedData.ID}`, updatedData);
            success = await submitOffenceAPI(updatedData);
        }

        console.log('success?', success);
        if (!success) {
            allSuccessful = false;
        }
    }
    console.log ('allSuccessful' , allSuccessful);
    return allSuccessful;
};
