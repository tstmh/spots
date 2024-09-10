import React, { createContext, useReducer } from 'react';

// Define the initial state
const initialState = {
    summons: {
        ID: "",
        SPOTS_ID: "",
        DEVICE_ID: "", 
        OFFICER_ID: 0,
        STATUS_ID: 1,
        TYPE: "",
        CREATED_AT: "",
        INCIDENT_OCCURED: 1,
        LOCATION_CODE: null,
        LOCATION_CODE_2: null,
        SPECIAL_ZONE: 0,
        REMARKS_LOCATION: null,
        SCHOOL_NAME: null,
    }
};

// Create context
export const SummonsContext = createContext(initialState);

// Define action types
const UPDATE_SUMMON = 'UPDATE_SUMMON';
const RESET_SUMMON = 'RESET_SUMMON';

// Reducer function to handle state changes
const summonsReducer = (state, action) => {
    switch (action.type) {
        case UPDATE_SUMMON:
            return {
                ...state,
                summons: {
                    ...state.summons,
                    ...action.payload,
                }
            };
        case RESET_SUMMON:
            return initialState;
        default:
            return state;
    }
};

// Context provider component
export const SummonsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(summonsReducer, initialState);

    // Function to update the summons
    const updateSummons = (summons) => {
        dispatch({ type: UPDATE_SUMMON, payload: summons });
    };

    // Function to reset the summons
    const resetSummons = () => {
        dispatch({ type: RESET_SUMMON });
    };

    return (
        <SummonsContext.Provider value={{ summons: state.summons, updateSummons, resetSummons }}>
            {children}
        </SummonsContext.Provider>
    );
};
