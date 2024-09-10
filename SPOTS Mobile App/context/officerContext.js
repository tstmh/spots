import React, { createContext, useReducer } from 'react';

// Define the initial state
const initialState = {
    officer: {
        NRIC_NO: "",
        OFFICER_NAME: "",
        OFFICER_RANK: "", 
        OFFICER_TEAM: "",
        SITE_ID: "",
        GENDER_CODE: null,
        PHONE_NO: "",
        OFFICER_ID: null
    }
};

// Create context
export const OfficerContext = createContext(initialState);

// Define action types
const UPDATE_OFFICER = 'UPDATE_OFFICER';
const RESET_OFFICER = 'RESET_OFFICER';

// Reducer function to handle state changes
const officerReducer = (state, action) => {
    switch (action.type) {
        case UPDATE_OFFICER:
            return {
                ...state,
                officer: {
                    ...state.officer,
                    ...action.payload,
                }
            };
        case RESET_OFFICER:
            return initialState;
        default:
            return state;
    }
};

// Context provider component
export const OfficerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(officerReducer, initialState);

    // Function to update the officer
    const updateOfficer = (report) => {
        dispatch({ type: UPDATE_OFFICER, payload: report });
    };

    // Function to reset the officer
    const resetOfficer = () => {
        dispatch({ type: RESET_OFFICER });
    };

    return (
        <OfficerContext.Provider value={{ officer: state.officer, updateOfficer, resetOfficer }}>
            {children}
        </OfficerContext.Provider>
    );
};
