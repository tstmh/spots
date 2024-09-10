import TIMSLocationCode from "../models/TIMSLocationCode";
import DatabaseService from "./DatabaseService";

/**
 * Converts a given value to a string. If the value is null or undefined, returns an empty string.
 *
 * @param {*} value - The value to convert to a string. Can be of any type.
 * @returns {string} The converted string value. If the input is null or undefined, returns an empty string.
 */
export const toStringOrEmpty = (value) => (value !== null && value !== undefined ? value.toString() : "");

/**
 * Formats a given date object into a string representation with the following format: "dd/MM/yyyy".
 *
 * @param date The date object to be formatted.
 * @return A string representing the formatted date.
 */
export const formatDateToLocaleString = (date) => {
    console.log('formatDateToLocaleString' , date);

    // Check if the input string is null
    if (date === null) {
        return "";
    }
    if (!date || !(date instanceof Date)) {
        return '';
    }

    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-SG', options);
};

/**
 * Formats a given date object into a string representation with the following format: "dd/MM/yyyy, hh:mm".
 *
 * @param date The date object to be formatted.
 * @return A string representing the formatted date.
 */
export const formatDateTimeToLocaleString = (date) => {
    console.log('formatDateTimeToLocaleString', date);

    // Check if the input string is null
    if (!date) {
        return '';
    }
    if (!(date instanceof Date)) {
        console.log('is not a Date object, returning ', date);
        return date;
    }

    // Options for date and time formatting with 24-hour format
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false  // Enforce 24-hour time format
    };
    
    // Use toLocaleString to format both date and time
    return date.toLocaleString('en-SG', options);
};

/**
 * Formats a given time to a locale-specific time string in the format HH:MM AM/PM.
 *
 * @param {Date} time - The date object to format. If the input is null, an empty string is returned.
 * @returns {string} The formatted locale-specific time string. If the input time is null, returns an empty string.
 */
export const formatTimeToLocaleString = (time) => {

    // Check if the input string is null
    if (time === null) {
        return "";
    }

    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return time.toLocaleTimeString('en-SG', options);
};

/**
 * Formats a given date object into a string representation in the format: "yyyyMMddhhmmss".
 *
 * @param date The date object to be formatted.
 * @return A string representing the formatted date.
 */
export const formatDateTimeToString = (date) => {

    // Check if the input string is null
    if (!date) {
        return "";
    }

    const year = date.getFullYear().toString();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    const formattedDate = year + month + day + hours + minutes + seconds;
    return formattedDate;
};

/**
 * Formats a given date object into a string representation in the format: "yyyyMMdd".
 *
 * @param date The date object to be formatted.
 * @return A string representing the formatted date.
 */
export const formatDateToString = (date) => {

    if (!date) {
        return '';
    }

    const year = date.getFullYear().toString();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const day = ('0' + date.getDate()).slice(-2);

    const formattedDate = year + month + day;
    return formattedDate;
}

/**
 * Formats a given date object into a time string in the format HH:MM.
 *
 * @param {Date} date - The date object to format. If the input is invalid or not a Date object, an empty string is returned.
 * @returns {string} The formatted time string in the format HH:MM. If the input date is invalid or not a Date object, returns an empty string.
 */
export const formatTimeToString = (date) => {

    if (!date || !(date instanceof Date)) {
        return '';
    }

    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${hours}:${minutes}`;
}

/**
 * Parses the provided date string and time string and returns a formatted date-time string.
 *
 * @param {string} dateString - The date string in the format 'dd/MM/yyyy'.
 * @param {string} timeString - The time string in the format 'HH:mm'.
 * @returns {string|null} The formatted date-time string in the format 'dd/MM/yyyy HH:mm:ss', or null if either input string is null.
 *
 * @example
 * // returns '2024-07-25 07:28:00'
 * parseDateTimeStringToDateTime('25/07/2024', '07:28');
 */
export const parseDateTimeStringToDateTime = (dateString, timeString) => {
    // Check if the input string is null
    if (!dateString || !timeString) {
        return null;
    }

    const [day, month, year] = dateString.split('/').map(str => str.padStart(2, '0'));
    const [hours, minutes] = timeString.split(':').map(str => str.padStart(2, '0'));
    // Validate the parsed values
    if (!day || !month || !year || !hours || !minutes) {
        return null;
    }

    // const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
    // // Check if the date is valid
    // if (isNaN(date.getTime())) {
    //     return null;
    // }

    // const formattedDateTime = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    // return formattedDateTime;

    const date = new Date(year, month - 1, day, hours, minutes);

    if (isNaN(date.getTime())) {
        return null;
    }

    return date;
};

/**
 * Formats a given string representing a date and time into a standardized format: "dd/MM/yyyy HH:mm:ss".
 *
 * @param dateTimeString The string representing the date and time in the format "yyyyMMddhhmmss".
 *                       If null, null is returned.
 * @return A string representing the formatted date and time in the format "dd/MM/yyyy HH:mm:ss",
 *         or null if the input string is null.
 */
export const parseStringToDateTime = (dateTimeString) => {
    console.log(`parseStringToDateTime ${dateTimeString}`);
    // Check if the input string is null
    if (!dateTimeString || dateTimeString.length !== 14) {
        return null;
    }

    // Extract date and time components from the datetime string
    const year = dateTimeString.slice(0, 4);
    const month = dateTimeString.slice(4, 6);
    const day = dateTimeString.slice(6, 8);
    const hour = dateTimeString.slice(8, 10);
    const minute = dateTimeString.slice(10, 12);
    const second = dateTimeString.slice(12, 14);

    // Construct the formatted datetime string
    const formattedDateTime = `${day}/${month}/${year} ${hour}:${minute}:${second}`;

    console.log(`parseStringToDateTime formattedDateTime ${formattedDateTime}`);
    return formattedDateTime;
};

/**
 * Parses a given string representing a date and time into a Date object.
 *
 * @param dateTimeString The string representing the date and time in the format "yyyyMMddhhmmss".
 *                       If null or incorrectly formatted, null is returned.
 * @return A Date object representing the parsed date and time,
 *         or null if the input string is null or incorrectly formatted.
 */
export const parseStringToDateTimeObject = (dateTimeString) => {
    console.log(`parseStringToDateTimeObject ${dateTimeString}`);
    // Check if the input string is null or incorrectly formatted
    if (!dateTimeString || dateTimeString.length !== 14) {
        return null;
    }

    // Extract date and time components from the datetime string
    const year = parseInt(dateTimeString.slice(0, 4), 10);
    const month = parseInt(dateTimeString.slice(4, 6), 10) - 1; // Month is 0-indexed
    const day = parseInt(dateTimeString.slice(6, 8), 10);
    const hour = parseInt(dateTimeString.slice(8, 10), 10);
    const minute = parseInt(dateTimeString.slice(10, 12), 10);
    const second = parseInt(dateTimeString.slice(12, 14), 10);

    // Create and return the Date object
    const date = new Date(year, month, day, hour, minute, second);

    // Check for invalid date
    if (isNaN(date.getTime())) {
        return null;
    }

    console.log(`parseStringToDateTimeObject parsed Date ${date}`);
    return date;
};

/**
 * Converts a date string in yyyymmdd format to a Date object.
 *
 * @param dateString A string representing a date in yyyymmdd format.
 * @return The Date object parsed from the input string, or null if parsing fails.
 * @throws IllegalArgumentException If dateString is null or does not match the expected format.
 */
export const parseStringToDate = (dateString) => {
    // Check if the input string is null
    if (!dateString || dateString.length !== 8) {
        return null;
    }

    // Extract date and time components from the datetime string
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; 
    const day = parseInt(dateString.substring(6, 8), 10);

    // Create a new Date object
    const date = new Date(year, month, day);

    // Check if the created date is valid
    if (isNaN(date.getTime())) {
        return null; // Return null if date is invalid
    }

    return date;
};

/**
 * Parses a time string in the format HH:MM and returns a Date object set to that time on the current date.
 *
 * @param {string} timeStr - The time string to parse in the format HH:MM. If the input is null or undefined, the current date and time is returned.
 * @returns {Date} A Date object set to the specified time on the current date. If the input is null or undefined, returns the current date and time.
 */
export const parseStringToTime = (timeString) => {
    if (!timeString) {
        return new Date();
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    return date;
};

/**
 * Generates a timestamp representing the current date and time in the format "yyyyMMddHHmmss".
 *
 * @return A string representing the formatted timestamp in the format "yyyyMMddHHmmss".
 */
export const formatTimeStamp = () => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = ('0' + (now.getMonth() + 1)).slice(-2); 
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);

    return year + month + day + hours + minutes + seconds;
}

/**
 * Converts a string value to an integer.
 * 
 * @param {string} sValue - The string value to be converted to an integer.
 * @returns {number} The integer value parsed from the input string.
 */
export const formatIntegerValue = (sValue) => {
    if (!sValue || sValue === ""){
        return null;
    }
    return parseInt(sValue, 10);
}

/**
 * Converts a string value to an integer.
 * 
 * @param {string} sValue - The string value to be converted to an integer.
 * @returns {number} The integer value parsed from the input string.
 */
export const formatIntegerValueNotNull = (sValue) => {
    if (!sValue || sValue === ""){
        return "";
    }

    if (isNaN(sValue)) {
        return ""; 
    }

    return parseInt(sValue, 10);
}

/**
 * Formats the location code based on the Incident Occurred type and location descriptions.
 *
 * @param {number} incidentOccuredType - The type of incident occurrence. Determines the format of the location description.
 * @param {string} location1 - The first location code. If null, an empty string is returned.
 * @param {string} location2 - The second location code. Used in formatting if present.
 * @returns {Promise<string>} A formatted location description string based on the incident occurred type and location descriptions.
 */
export const formatLocationCode = async (incidentOccuredType, location1, location2) => {
    console.log(``)

    /* If Location 1 is null then return empty */
    if (location1 === null) return " ";

    const location1Desc = await TIMSLocationCode.getLocationDescByCode(DatabaseService.db, location1);
    const location2Desc = await TIMSLocationCode.getLocationDescByCode(DatabaseService.db, location2);

    /* Format Location 1 and 2 */
    if (incidentOccuredType === 2) return "Junction of " + location1Desc + " and " + location2Desc;
    else if (incidentOccuredType === 3) return location1Desc + " Slip Road onto " + location2Desc;
    else if (incidentOccuredType === 4) return "Along " + location1Desc + " Travelling Towards " + location2Desc;
    else return "Along " + location1Desc;
};

/**
 * Converts a given string to uppercase. 
 * 
 * @param {string} sValue - The string value to be converted to uppercase.
 * @return {string|null} The uppercase version of the input string, or null if the input is null or undefined.
 * 
 */
export const formatToUpperCase = (sValue) => {
    console.log('formatToUpperCase ', sValue);

    if (sValue !== null && typeof sValue === "string" && typeof sValue !== "undefined" && sValue.trim() !== "") {
        console.log('return uppercase ', sValue.toUpperCase());
        return sValue.toUpperCase();
    } else {
        return null;
    }
};

/**
 * Removes the data URL prefix from a base64-encoded image string.
 * 
 * This function takes a base64-encoded image string with a data URL prefix
 * (e.g., "data:image/png;base64,") and returns the raw base64-encoded data.
 * 
 * @param {string} sImage64 - The base64-encoded image string with a data URL prefix.
 * @return {string} The base64-encoded image string without the data URL prefix.
 * 
 */
export const formatBased64 = function(sImage64) {
    return sImage64.replace(/^data:image\/[a-z]+;base64,/, "");
};

/**
 * Generates a unique identifier string based on the given summons type, current date, and time.
 *
 * @param {string} summonsType - The type of summons. 'M401' or 'M401E'
 * @return {string} A string in the format 'summonsType/Z/YYMMDD/HHMM', where:
 * - YY is the last two digits of the current year.
 * - MM is the zero-padded current month (01-12).
 * - DD is the zero-padded current day of the month (01-31).
 * - HH is the zero-padded current hour in 24-hour format (00-23).
 * - MM is the zero-padded current minute (00-59).
 */
export const generateSpotsId = (summonsType) => {
    const sDepartment = "Z";

    const now = new Date();    
    const year = String(now.getFullYear()).slice(-2); 
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const sDate = year + month + day;

    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const sTime = hours + minutes;

    // array join
    let sString = "";
    let sArray = [summonsType, sDepartment, sDate, sTime];
    sString = sArray.join("/");
    console.log("generateSpotsId value:" + sString);
    return sString;
};
