import createDataContext from "./createDataContext";

const initialState = {
    term: "202110",
};

const termReducer = (state, action) => {
    switch (action.type) {
        case "GET_TERM":
            return {
                ...state,
                term: action.payload,
            };
        default:
            break;
    }
};

const getTerm = (dispatch) => {
    return (curTerm) => {
        dispatch({ type: "GET_TERM", payload: curTerm });
    };
};

export const { Context, Provider } = createDataContext(
    termReducer,
    { getTerm },
    initialState
);
