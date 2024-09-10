const multiples = [2, 7, 6, 5, 4, 3, 2];

export const validateIdNo = (idType, idNo) => {
    idNo = idNo.toUpperCase().trim();

    console.log("validateIdNo >> idType:" + idType + ", idNo:" + idNo );
    let validated = true;

    if (idType === 1 || idType === "1") {
        validated = validateNric(idNo);
    } else if (idType === 2 || idType === "2") {
        validated = validateFin(idNo);
    }
    console.log("validateIdNo: " + validated);
    return validated;
};

const parseNumber = (str, defaultValue) => {
    const parsed = Number(str);
    return isNaN(parsed) ? defaultValue : parsed;
};

const validateNric = (idNo) => {
    console.log("validateNric: idNo " + idNo);
    const nric = idNo.toUpperCase();;

    if (!nric || nric.length !== 9) return false;

    let total = 0;
    let count = 0;
    let numericNric;
    const first = nric[0];
    const last = nric[nric.length - 1];
    let outputs;

    // First character must be S or T
    if (first !== 'S' && first !== 'T') return false;

    // Ensure only the first and last characters are alphabets
    numericNric = parseNumber(nric.substring(1, nric.length - 1), null);

    if (!numericNric) return false;

    // Multiple each digit by the corresponding value in the multiples array
    // Sum up the products as total, which will be used later as the checksum index
    while (numericNric !== 0) {
        const offset = 1 + count++;
        total += (numericNric % 10) * multiples[multiples.length - offset];
        numericNric = Math.floor(numericNric / 10);
    }

    // Choose the appropriate checksum array based on the first character
    if (first === 'S') outputs = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
    else outputs = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'J', 'Z', 'I', 'H'];

    return last === outputs[total % 11];
};

const validateFin = (idNo) => {
    console.log("validateFin: idNo " + idNo);
    const fin = idNo.toUpperCase();

    if (!fin || fin.length !== 9) return false;

    let total = 0;
    let count = 0;
    let numericNric;
    const first = fin[0];
    const last = fin[fin.length - 1];
    let outputs;

    // First character must be F, G, or M
    if (first !== 'F' && first !== 'G' && first !== 'M') return false;

    // Ensure only the first and last characters are alphabets
    numericNric = parseNumber(fin.substring(1, fin.length - 1), null);

    if (!numericNric) return false;

    // Multiply each digit by the corresponding value in the multiples array
    // Sum up the products as total, which will be used later as the checksum index
    while (numericNric !== 0) {
        const _offset = 1 + count++;
        total += (numericNric % 10) * multiples[multiples.length - _offset];
        numericNric = Math.floor(numericNric / 10);
    }

    // Choose the appropriate checksum array based on the first character
    switch (first) {
        case 'F':
            outputs = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
            break;
        case 'G':
            outputs = ['R', 'Q', 'P', 'N', 'M', 'L', 'K', 'X', 'W', 'U', 'T'];
            break;
        case 'M':
            outputs = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'J', 'L', 'K'];
            total += 3; 
            break;
        default:
            return false;
    }

    return last === outputs[total % 11];
};

export const validateRegNo = (regNo) => {

    let valid = validateNumber(regNo);
    console.log(`validateRegNo ${regNo} valid? `, valid);

    return valid;
};

export const validateNumber = (value) => {
    const number = value.toUpperCase();
    console.log(`validateNumber ${number}`);
    
    const validAlpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const validSuffixes = ["A", "B", "C", "D", "E", "G", "H", "J", "K", "L", "M", "P", "R", "S", "T", "U", "X", "Y", "Z"];
    const _multipliers = [14, 2, 12, 2, 11, 1];
    const _checksum = ['A', 'Y', 'U', 'S', 'P', 'L', 'J', 'G', 'D', 'B', 'Z', 'X', 'T', 'R', 'M', 'K', 'H', 'E', 'C'];

    const digits = /\d+/;
    const bHasMiddleNumber = number.match(digits) && number.match(digits).length > 0 && number.match(digits).length <= 5;

    const bIsDiplomatPrefix = number.startsWith('S');
    const bIsDiplomatSuffix = number.endsWith("CC") || number.endsWith("CD") || number.endsWith("TE");

    const bHasMidValue = number.startsWith("MID") || number.endsWith("MID");
    const bIsEndNumeric = !isNaN(number.charAt(number.length - 1));

    if (bHasMiddleNumber && bIsDiplomatPrefix && bIsDiplomatSuffix) {
        console.log("Diplomat vehicle Found");
        return true;
    } else if (bHasMidValue) { 
        console.log("Military vehicle Found");
        const bMatchEnd = /^[0-9]MID/i.test(number);
        const bMatchBegin = /^MID[0-9]/i.test(number);

        if (number.endsWith("MID") && number.length >= 4) {
            const sSplit = number.split("MID");
            if (sSplit[0].length !== 0 && sSplit[0].length <= 4 && !isNaN(sSplit[0])) {
                console.log("MID begin vehicle found");
                return true;
            }
        } else if (bMatchBegin && bIsEndNumeric) {
            console.log("MID end no letter vehicle found");
            return true;
        } else if (bMatchBegin && !bIsEndNumeric) {
            return false;
        }
    } else {
        console.log("normal vehicle");
        // slice to 3 parts (prefix, digits, suffix)
        const parts = number.match(/[a-z]+|\d+/ig);
        console.log(`parts ${parts.length}`, parts);
        if (parts.length == 3){
            // count number of prefix
            const prefixCnt = parts[0].length;
            // get the last two part of the prefix
            // if 3, then discard first character
            const prefixChars = prefixCnt === 3 ? parts[0].substring(1, 3) : parts[0];
            // count number of digit
            const numCnt = parts[1].length;
            // For three-digit numbers, a “0” is appended to the front of the number.
            const paddedChars = "0000" + parts[1];
            const numChars = paddedChars.slice(-4);
            const suffixChars = parts[2] ? parts[2] : '';

            if (suffixChars.length != 1){
                console.log(`suffixChars ${suffixChars.length}`, suffixChars);
                return false;
            }

            const suffixCnt = parts[2]?.length || 0;

            // Plate doesn't have special chars
            // Suffix is a valid character
            // Prefix, digit, and suffix is present
            if (isValid(number) && !isInvalidSuffix(suffixChars) && (prefixCnt !== 0 && numCnt !== 0 && suffixCnt !== 0)) {
                const prefix1 = validAlpha.indexOf(prefixChars[0]) + 1;
                const prefix2 = validAlpha.indexOf(prefixChars[1]) + 1;
                const tmp1Num = parseInt(numChars[0], 10);
                const tmp2Num = parseInt(numChars[1], 10);
                const tmp3Num = parseInt(numChars[2], 10);
                const tmp4Num = parseInt(numChars[3], 10);

                const vehicleDigit = [prefix1, prefix2, tmp1Num, tmp2Num, tmp3Num, tmp4Num];
                let totalSum = 0;

                // Each individual number is then multiplied by 6 fixed numbers (14, 2, 12, 2, 11, 1). These are added up, then divided by 19.
                for (let i = 0; i < vehicleDigit.length; i++) {
                    totalSum += vehicleDigit[i] * _multipliers[i];
                }
                // remainder checksum
                const checkSum = totalSum % 19;
                if (validSuffixes.includes(suffixChars[0])) {
                    // check suffix
                    const sValidateSuffix = _checksum[checkSum];
                    if (suffixChars[0] == sValidateSuffix) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
};

const isValid = (str) => {
    return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
};

const isInvalidSuffix = (sChar) => {
    const invalidSuffixes = ["F", "I", "N", "O", "Q", "V", "W"];
    return invalidSuffixes.includes(sChar);
};

/**
 * Validates if a given date and time string is a future date.
 *
 * This function takes a datetime string in the format "yyyymmddhhmmss" (e.g., "20240827123045")
 * and checks if it represents a date and time in the future compared to the current date and time.
 * If the string is in an incorrect format, it throws an error.
 *
 * @param {string} datetimeString - A string representing date and time in the format "yyyymmddhhmmss".
 * @returns {boolean} Returns `true` if the input date is in the future, `false` if not or if the input is invalid.
 * @throws {Error} Throws an error if the datetime string is not in the expected "yyyymmddhhmmss" format.
 */
export const validateIsFutureDate = (datetimeString) => {
    if (!datetimeString){
        return false;
    }

    // Check if the input string is in the correct format
    if (!/^\d{14}$/.test(datetimeString)) {
        throw new Error("Invalid date format. Expected format: yyyymmddhhmmss");
    }

    // Extract components from the datetime string
    const year = parseInt(datetimeString.slice(0, 4), 10);
    const month = parseInt(datetimeString.slice(4, 6), 10) - 1; // Months are zero-based in JavaScript
    const day = parseInt(datetimeString.slice(6, 8), 10);
    const hour = parseInt(datetimeString.slice(8, 10), 10);
    const minute = parseInt(datetimeString.slice(10, 12), 10);
    const second = parseInt(datetimeString.slice(12, 14), 10);

    // Create a Date object from the extracted components
    const inputDate = new Date(year, month, day, hour, minute, second);

    // Get the current date and time
    const currentDate = new Date();

    // Compare the input date with the current date
    return inputDate > currentDate;

};

export const validateDateIsFutureDate = (date) => {
    if (!date){
        return false;
    }

    // Get the current date and time
    const currentDate = new Date();

    // Compare the input date with the current date
    return date > currentDate;

};

const validateOSI = (report) => {
    console.log("validateOSI: report ", report);

    const fin = idNo.toUpperCase();

    if (!fin || fin.length !== 9) return false;

    let total = 0;
    let count = 0;
    let numericNric;
    const first = fin[0];
    const last = fin[fin.length - 1];
    let outputs;

    // First character must be F, G, or M
    if (first !== 'F' && first !== 'G' && first !== 'M') return false;

    // Ensure only the first and last characters are alphabets
    numericNric = parseNumber(fin.substring(1, fin.length - 1), null);

    if (!numericNric) return false;

    // Multiply each digit by the corresponding value in the multiples array
    // Sum up the products as total, which will be used later as the checksum index
    while (numericNric !== 0) {
        const _offset = 1 + count++;
        total += (numericNric % 10) * multiples[multiples.length - _offset];
        numericNric = Math.floor(numericNric / 10);
    }

    // Choose the appropriate checksum array based on the first character
    switch (first) {
        case 'F':
            outputs = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
            break;
        case 'G':
            outputs = ['R', 'Q', 'P', 'N', 'M', 'L', 'K', 'X', 'W', 'U', 'T'];
            break;
        case 'M':
            outputs = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'J', 'L', 'K'];
            total += 3; 
            break;
        default:
            return false;
    }

    return last === outputs[total % 11];
};

const checkDateFormat = (sEntry) => {
    // Implement date format check, e.g., YYYY-MM-DD
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormatRegex.test(sEntry);
};

const checkIsPastDate = (sEntry) => {
    const date = new Date(sEntry);
    const now = new Date();
    return date < now;
};

const checkIsFutureDate = (sEntry) => {
    const date = new Date(sEntry);
    const now = new Date();
    return date > now;
};

const isValidAge = (sEntry) => {
    const date = new Date(sEntry);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    return age <= 150;
};

export const isValidDate = (sEntry, isDob, isLicenseDate) => {
    const bValidDate = checkDateFormat(sEntry);
    if (!bValidDate) {
        return { isValid: false, message: 'Invalid Date Format' };
    } else {
        const bPastDate = isDob ? checkIsPastDate(sEntry) : checkIsFutureDate(sEntry);
        if (bPastDate) {
            if (isDob) {
                if (isValidAge(sEntry)) {
                    return { isValid: true };
                } else {
                    return { isValid: false, message: 'Age exceeds 150 years' };
                }
            } else {
                return { isValid: true };
            }
        } else {
            const sErrorMessage = isLicenseDate
                ? 'Expiry Date should be greater than the current date.'
                : 'Date of Birth should be less than the current date.';
            return { isValid: false, message: sErrorMessage };
        }
    }
};