import React, { createContext, useReducer } from 'react';

// Define the initial state
const initialState = {
    accidentReport: {
        ID: "",
        INCIDENT_NO: "",
        DEVICE_ID: "", 
        OFFICER_ID: 0,
        IO_NAME: "",
        IO_EXTENSION_NO: "",
        INCIDENT_OCCURED: 1,
        LOCATION_CODE: null,
        LOCATION_CODE_2: null,
        SPECIAL_ZONE: 0,
        REMARKS_LOCATION: null,
        CREATED_AT: "",
        STATUS_ID: 1,
        STRUCTURE_DAMAGES: null,
        WEATHER_CODE: null,
        WEATHER_OTHER_CODE: null,
        ROAD_SURFACE_CODE: null,
        ROAD_SURFACE_OTHER: null,
        TRAFFIC_VOLUME_CODE: null,
        DECLARATION_INDICATOR: null,
        OFFICER_RANK: null,
        DIVISION: null,
        DECLARATION_DATE: null,
        PRESERVE_DATE: null,
        SCHOOL_NAME: null,
        ACCIDENT_TIME: null,
        PO_ARRIVAL_TIME: null,
        PO_RESUME_DUTY_TIME: null
    }
};

// Create context
export const AccidentReportContext = createContext(initialState);

// Define action types
const UPDATE_ACCIDENT_REPORT = 'UPDATE_ACCIDENT_REPORT';
const RESET_ACCIDENT_REPORT = 'RESET_ACCIDENT_REPORT';

// Reducer function to handle state changes
const accidentReportReducer = (state, action) => {
    switch (action.type) {
        case UPDATE_ACCIDENT_REPORT:
            return {
                ...state,
                accidentReport: {
                    ...state.accidentReport,
                    ...action.payload,
                }
            };
        case RESET_ACCIDENT_REPORT:
            return initialState;
        default:
            return state;
    }
};

// Context provider component
export const AccidentReportProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accidentReportReducer, initialState);

    // Function to update the accident report
    const updateAccidentReport = (report) => {
        dispatch({ type: UPDATE_ACCIDENT_REPORT, payload: report });
    };

    // Function to reset the accident report
    const resetAccidentReport = () => {
        dispatch({ type: RESET_ACCIDENT_REPORT });
    };

    return (
        <AccidentReportContext.Provider value={{ accidentReport: state.accidentReport, updateAccidentReport, resetAccidentReport }}>
            {children}
        </AccidentReportContext.Provider>
    );
};
