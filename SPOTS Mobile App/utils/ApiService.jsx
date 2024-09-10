
import { ToastAndroid } from 'react-native';
import AccidentReport from '../models/AccidentReport';
import IOList from '../models/IOList';
import SynchLog from '../models/SynchLog';
import SystemCode from '../models/SystemCode';
import TIMSCountryCode from '../models/TIMSCountryCode';
import TIMSLocationCode from '../models/TIMSLocationCode';
import TIMSNationalityCode from '../models/TIMSNationalityCode';
import TIMSOffenceCode from '../models/TIMSOffenceCode';
import TIMSVehicleColor from '../models/TIMSVehicleColor';
import TIMSVehicleMake from '../models/TIMSVehicleMake';
import TIMSVehicleType from '../models/TIMSVehicleType';
import DatabaseService from '../utils/DatabaseService';
import {formatDateTimeToString, parseStringToDateTime} from '../utils/Formatter';

//DEV
//let baseUrl = "http://192.168.127.108/SPOTSMobileApi/api/";

//UAT 
let baseUrl = "https://spotsii.intranet.spfoneuat.gov.sg/SPOTSMobileApi/api/";

export const setBaseUrl = (newBaseUrl) => {
    console.log('setBaseUrl', newBaseUrl);

    baseUrl = newBaseUrl;
};

export const getBaseUrl = () => {
    return baseUrl;
};

export const checkConnectionAPI = async () => {
    let url = baseUrl + "sync/checkConnection"
    console.log("call checkConnection API", url);

    try {
        const response = await fetch(url, {
            method: 'GET',
        });
        console.log('Connection check response', response);

        if (!response.ok) {
            console.warn('Response not OK. Status:', response.status);
            console.warn('Response headers:', response.headers);
            const responseBody = await response.text();
            console.warn('Response body:', responseBody);
            return false;
        }

        console.log("Connection check succeeded.");
        return true;
    } catch (error) {
        console.error('checkConnectionAPI Connection check failed:', error.message);
        console.error('checkConnectionAPI Error stack trace:', error.stack);
        console.error('Connection check failed:', error);
        return false;
    }
};

export const fullSync = async () => {
    console.log("fullSync");

    getIOListAPI(parseStringToDateTime(await SynchLog.getSynchLogsFromTable(DatabaseService.db, IOList.tableName))); 
    getSystemCodeAPI(parseStringToDateTime(await SynchLog.getSynchLogsFromTable(DatabaseService.db, SystemCode.tableName)));
    getTIMSCountryCodeAPI(parseStringToDateTime(await SynchLog.getSynchLogsFromTable(DatabaseService.db,TIMSCountryCode.tableName)));
    getTIMSLocationCodeAPI(parseStringToDateTime(await SynchLog.getSynchLogsFromTable(DatabaseService.db, TIMSLocationCode.tableName)));
    getTIMSNationalityCodeAPI(parseStringToDateTime(await SynchLog.getSynchLogsFromTable(DatabaseService.db, TIMSNationalityCode.tableName)));
    getTIMSOffenceCodeAPI(parseStringToDateTime(await SynchLog.getSynchLogsFromTable(DatabaseService.db, TIMSOffenceCode.tableName)));
    getTIMSVehicleColorAPI(parseStringToDateTime(await SynchLog.getSynchLogsFromTable(DatabaseService.db,TIMSVehicleColor.tableName)));
    getTIMSVehicleMakeAPI(parseStringToDateTime(await SynchLog.getSynchLogsFromTable(DatabaseService.db, TIMSVehicleMake.tableName)));
    getTIMSVehicleTypeAPI(parseStringToDateTime(await SynchLog.getSynchLogsFromTable(DatabaseService.db, TIMSVehicleType.tableName)));

    ToastAndroid.show("Sync success", ToastAndroid.SHORT);
}

export const getIOListAPI = async (inputDate) => {
    console.log("call getIOList API, date: ", inputDate);
    try {
        let url = baseUrl + "user/getIOList"

        const response = await fetch(url + "?inputDate=" + inputDate, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //console.log(response);

        if (!response.ok) {
            console.log('Network response was not ok');
            return;
        }

        if (response.status === 204) {
            console.log("No getIOList content returned from the server.");
            return;
        }

        const data = await response.json();
        console.log("getIOList >> to insert: " + data.length);

        // Iterate through received data and insert each code
        for (const codeData of data) {
            await IOList.insert(
                DatabaseService.db,
                codeData
            );
        }

        await SynchLog.insert(DatabaseService.db, IOList.tableName, formatDateTimeToString(new Date()));

    } catch (error) {
        // Handle errors
        console.log('There was a problem with the fetch operation getIOList:', error);
    }
};

export const getSystemCodeAPI = async (inputDate) => {
    console.log("call getSystemCode API, date: ", inputDate);
    try {
        let url = baseUrl + "sync/getSystemCode"

        const response = await fetch(url + "?inputDate=" + inputDate, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //console.log(response);

        if (!response.ok) {
            console.log('Network response was not ok');
            return;
        }

        if (response.status === 204) {
            console.log("No getSystemCode content returned from the server.");
            return;
        }

        const data = await response.json();
        console.log("getSystemCode >> to insert: " + data.length);

        // Iterate through received data and insert each code
        for (const codeData of data) {
            await SystemCode.insert(
                DatabaseService.db,
                codeData
            );
        }

        await SynchLog.insert(DatabaseService.db, SystemCode.tableName, formatDateTimeToString(new Date()));

    } catch (error) {
        // Handle errors
        console.log('There was a problem with the fetch operation getSystemCode:', error);
    }
};

export const getTIMSCountryCodeAPI = async (inputDate) => {
    console.log("call getTIMSCountryCode API, date: ", inputDate);
    try {
        let url = baseUrl + "sync/getTIMSCountryCode"

        const response = await fetch(url + "?inputDate=" + inputDate, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //console.log(response);

        if (!response.ok) {
            console.log('Network response was not ok');
            return;
        }

        if (response.status === 204) {
            console.log("No getTIMSCountryCode content returned from the server.");
            return;
        }

        const data = await response.json();
        console.log("getTIMSCountryCode >> to insert: " + data.length);

        // Iterate through received data and insert each code
        for (const codeData of data) {
            await TIMSCountryCode.insert(
                DatabaseService.db,
                codeData
            );
        }

        await SynchLog.insert(DatabaseService.db, TIMSCountryCode.tableName, formatDateTimeToString(new Date()));

    } catch (error) {
        // Handle errors
        console.log('There was a problem with the fetch operation getTIMSCountryCode:', error);
    }
};

export const getTIMSLocationCodeAPI = async (inputDate) => {
    console.log("call getTIMSLocationCode API, inputDate: " , inputDate);
    try {
        let url = baseUrl + "sync/getTIMSLocationCode"

        const response = await fetch(url + "?inputDate=" + inputDate, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //console.log(response);

        if (!response.ok) {
            console.log('Network response was not ok');
            return;
        }

        if (response.status === 204) {
            console.log("No getTIMSLocationCode content returned from the server.");
            return;
        }

        const data = await response.json();
        console.log("getTIMSLocationCode >> to insert: " + data.length);

        // Iterate through received data and insert each code
        for (const codeData of data) {
            await TIMSLocationCode.insert(
                DatabaseService.db,
                codeData
            );
        }

        await SynchLog.insert(DatabaseService.db, TIMSLocationCode.tableName, formatDateTimeToString(new Date()));

    } catch (error) {
        // Handle errors
        console.log('There was a problem with the fetch operation getTIMSLocationCode:', error);
    }
};

export const getTIMSNationalityCodeAPI = async (inputDate) => {
    console.log("call getTIMSNationalityCode API, inputDate: " , inputDate);
    try {
        let url = baseUrl + "sync/getTIMSNationalityCode"

        const response = await fetch(url + "?inputDate=" + inputDate, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //console.log(response);

        if (!response.ok) {
            console.log('Network response was not ok');
            return;
        }

        if (response.status === 204) {
            console.log("No getTIMSNationalityCode content returned from the server.");
            return;
        }

        const data = await response.json();
        console.log("getTIMSNationalityCode >> to insert: " + data.length);

        // Iterate through received data and insert each code
        for (const codeData of data) {
            await TIMSNationalityCode.insert(
                DatabaseService.db,
                codeData
            );
        }

        await SynchLog.insert(DatabaseService.db, TIMSNationalityCode.tableName, formatDateTimeToString(new Date()));

    } catch (error) {
        // Handle errors
        console.log('There was a problem with the fetch operation getTIMSNationalityCode:', error);
    }
};

export const getTIMSOffenceCodeAPI = async (inputDate) => {
    console.log("call getTIMSOffenceCode API, inputDate: " , inputDate);
    try {
        let url = baseUrl + "sync/getTIMSOffenceCode"

        const response = await fetch(url + "?inputDate=" + inputDate, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        //console.log(response);

        if (!response.ok) {
            console.log('Network response was not ok');
            return;
        }
        
        if (response.status === 204) {
            console.log("No getTIMSOffenceCode content returned from the server.");
            return;
        }

        const data = await response.json();
        console.log("getTIMSOffenceCode >> to insert: " + data.length);

        // Iterate through received data and insert each code
        for (const codeData of data) {
            await TIMSOffenceCode.insert(
                DatabaseService.db,
                codeData
            );
        }

        await SynchLog.insert(DatabaseService.db, TIMSOffenceCode.tableName, formatDateTimeToString(new Date()));

    } catch (error) {
        // Handle errors
        console.log('There was a problem with the fetch operation getTIMSOffenceCode:', error);
    }
};

export const getTIMSVehicleColorAPI = async (inputDate) => {
    console.log("call getTIMSVehicleColor API, inputDate: " , inputDate);
    try {
        let url = baseUrl + "sync/getTIMSVehicleColor"

        const response = await fetch(url + "?inputDate=" + inputDate, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //console.log(response);

        if (!response.ok) {
            console.log('Network response was not ok');
            return;
        }

        if (response.status === 204) {
            console.log("No getTIMSVehicleColor content returned from the server.");
            return;
        }

        const data = await response.json();
        console.log("getTIMSVehicleColor >> to insert: " + data.length);

        // Iterate through received data and insert each code
        for (const codeData of data) {
            await TIMSVehicleColor.insert(
                DatabaseService.db,
                codeData
            );
        }

        await SynchLog.insert(DatabaseService.db, TIMSVehicleColor.tableName, formatDateTimeToString(new Date()));

    } catch (error) {
        // Handle errors
        console.log('There was a problem with the fetch operation getTIMSVehicleColor:', error);
    }
};

export const getTIMSVehicleMakeAPI = async (inputDate) => {
    console.log("call getTIMSVehicleMake API, inputDate: " , inputDate);
    try {
        let url = baseUrl + "sync/getTIMSVehicleMake"

        const response = await fetch(url + "?inputDate=" + inputDate, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //console.log(response);

        if (!response.ok) {
            console.log('Network response was not ok');
            return;
        }

        if (response.status === 204) {
            console.log("No getTIMSVehicleMake content returned from the server.");
            return;
        }

        const data = await response.json();
        console.log("getTIMSVehicleMake >> to insert: " + data.length);

        // Iterate through received data and insert each code
        for (const codeData of data) {
            await TIMSVehicleMake.insert(
                DatabaseService.db,
                codeData
            );
        }

        await SynchLog.insert(DatabaseService.db, TIMSVehicleMake.tableName, formatDateTimeToString(new Date()));

    } catch (error) {
        // Handle errors
        console.log('There was a problem with the fetch operation getTIMSVehicleMake:', error);
    }
};

export const getTIMSVehicleTypeAPI = async (inputDate) => {
    console.log("call getTIMSVehicleType API, inputDate: " , inputDate);
    try {
        let url = baseUrl + "sync/getTIMSVehicleType"

        const response = await fetch(url + "?inputDate=" + inputDate, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //console.log(response);

        if (!response.ok) {
            console.log('Network response was not ok');
            return;
        }

        if (response.status === 204) {
            console.log("No getTIMSVehicleType content returned from the server.");
            return;
        }

        const data = await response.json();
        console.log("getTIMSVehicleType >> to insert: " + data.length);

        // Iterate through received data and insert each code
        for (const codeData of data) {
            await TIMSVehicleType.insert(
                DatabaseService.db,
                codeData
            );
        }

        await SynchLog.insert(DatabaseService.db, TIMSVehicleType.tableName, formatDateTimeToString(new Date()));

    } catch (error) {
        // Handle errors
        console.log('There was a problem with the fetch operation getTIMSVehicleType:', error);
    }
};

export const getIssuedOSIAPI = async (userId) => {
    console.log("call getIssuedOSI API, userId: " , userId);
    try {
        let url = baseUrl + "osi/getIssuedOSI"

        const response = await fetch(url + "?userId=" + userId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //console.log(response);

        if (!response.ok) {
            console.log('Network response was not ok');
            return;
        }
        
        if (response.status === 204) {
            console.log("No getIssuedOSI content returned from the server.");
            return;
        }

        const data = await response.json();
        console.log("getIssuedOSI >> retrieved data: " + data.length);

        // Iterate through received data and insert each code
        for (const codeData of data) {
            AccidentReport.insert(DatabaseService.db, codeData);
        }

    } catch (error) {
        // Handle errors
        console.log('There was a problem with the fetch operation getIssuedOSI:', error);
    }
};

export const submitAccidentReportAPI = async (accidentReport) => {
    console.log("call submitAccidentReport API, accidentReport: ", accidentReport);

    //const sMessage = "Incident " + accidentReport.INCIDENT_NO.toUpperCase() + " of Accident Report has been successfully submitted.";
    try {
        let url = baseUrl + "osi/submitAccidentReport"

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accidentReport),
        });
        console.log(response);

        if (!response.ok) {
            console.log("Submit Error on Accident Report. Cannot connect to the server.");
            return false;
        }

        const data = await response.json();
        console.log('submitAccidentReport successfully:', data);

        return data;

    } catch (error) {
        // Handle errors
        console.log('There was a problem with the post operation submitAccidentReport:', error);
        return false;
    }
};

export const submitPartiesInvolvedAPI = async (partiesInvolved) => {
    console.log("call submitPartiesInvolved API, partiesInvolved: ", partiesInvolved);

    //const sMessage = "Incident " + partiesInvolved.INCIDENT_NO.toUpperCase() + " of Accident Report has been successfully submitted.";
    try {
        let url = baseUrl + "osi/submitPartiesInvolved"

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(partiesInvolved),
        });
        console.log(response);

        if (!response.ok) {
            console.log(`Submit Error on Parties Involved. Cannot connect to the server.`);
            return false;
        }

        // const data = await response.json();
        // console.log('submitPartiesInvolved successfully:', data);
        return true;

    } catch (error) {
        // Handle errors
        console.log('There was a problem with the post operation submitPartiesInvolved:', error);
        //Alert.alert("Submit Error on Parties Involved. ", error);
        return false;
    }
};

export const submitImagesAPI = async (images) => {
    console.log("call submitImages API, images: ", images);

    //const sMessage = "Incident " + partiesInvolved.INCIDENT_NO.toUpperCase() + " of Accident Report has been successfully submitted.";
    try {
        let url = baseUrl + "osi/submitImages"

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(images),
        });
        console.log(response);

        if (!response.ok) {
            console.error("Submit Error on Images. Cannot connect to the server.");
            return false;
        }

        //const data = await response.json();
        //console.log('submitImages successfully:', data);
        return true;

    } catch (error) {
        // Handle errors
        console.error('There was a problem with the post operation submitImages:', error);
        return false;
    }
};

export const submitSummonsAPI = async (summon) => {
    console.log("call submitSummons API, summon: ", summon);

    console.log(`JSON.stringify(summon)`, JSON.stringify(summon));

    try {
        let url = baseUrl + "summons/submitSummon"

        console.log(`submitSummonsAPI url ${url}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(summon),
        });
        console.log(response);

        if (!response.ok) {
            console.error("Submit Error on Summons. Status:", response.status);
            return false;
        }

        const data = await response.json();
        console.log('submitSummons successfully: summons_id', data);
        return data;

    } catch (error) {
        // Handle errors
        console.error('There was a problem with the post operation submitSummons:', error);
        return false;
    }
};

export const submitOffenderAPI = async (offender) => {
    console.log("call submitOffender API, offender: ", offender);

    try {
        let url = baseUrl + "summons/submitOffender"

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(offender),
        });
        console.log(response);

        if (!response.ok) {
            const errorMessage = await response.json().then((data) => {
                // Assuming the API returns a JSON object with an "error" or "message" field
                return data.error || data.message || 'Unknown error occurred';
            }).catch(() => {
                // Handle cases where the response is not JSON (e.g., HTML error page)
                return 'An error occurred, but no details are available.';
            });
        
            console.error("Submit Error on Offender. Status:", response.status, "Message:", errorMessage);
            //return errorMessage; // Or handle it accordingly
            return false;
        }

        // const data = await response.json();
        // console.log('submitOffender successfully:', data);
        return true;

    } catch (error) {
        // Handle errors
        console.error('There was a problem with the post operation submitOffender:', error);
        return false;
    }
};

export const submitOffenceAPI = async (offence) => {
    console.log("call submitOffence API, offence: ", offence);

    try {
        let url = baseUrl + "summons/submitOffence"

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(offence),
        });
        console.log(response);

        if (!response.ok) {
            console.error("Submit Error on Offence. Status:", response.status);
            return false;
        }

        // const data = await response.json();
        // console.log('submitOffence successfully:', data);
        return true;

    } catch (error) {
        // Handle errors
        console.error('There was a problem with the post operation submitOffence:', error);
        return false;
    }
};

export const authenticateAPI = async (userId, password) => {
    console.log(`call authenticateAPI API, userid ${userId} password ${password}`);

    const user = {
        UserId: userId, 
        Password: password
    }

    try {
        let url = baseUrl + "authenticate"

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        });
        console.log(response);

        if (!response.ok) {
            if (response.status === 404) {
                console.error("Error: No privileges");
                return { success: false, message: "Sorry, You do not have enough privilege to access the mobile app." };
            } else {
                console.error("Error: Unexpected server response", response.status);
                return { success: false, message: "Unexpected server response" };
            }
        }

        const data = await response.json();
        console.log('Authenticated successfully:', data);

        return { success: true, user: data };

    } catch (error) {
        // Handle errors
        console.error('There was a problem with the post operation authenticateAPI:', error);
        return { success: false, message: "Cannot connect to SPOTS server" };
    }
};

export const sendTransactionLogsAPI = async (logs) => {
    console.log("call sendTransactionLogs API, logs: ", logs.length);

    try {
        let url = baseUrl + "sync/sendTransactionLogs"

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logs),
        });
        console.log(response);

        if (!response.ok) {
            console.error("Submit Error on sendTransactionLogs. Cannot connect to the server.");
            return false;
        }

        const data = await response.json();
        console.log('sendTransactionLogs successfully:', data);
        return true;

    } catch (error) {
        // Handle errors
        console.error('There was a problem with the post operation sendTransactionLogs:', error);
        return false;
    }
}; 