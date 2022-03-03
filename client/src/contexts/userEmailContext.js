import createDataContext from "./createDataContext";

const initialState = {
    email: localStorage.getItem('user_email'),
};

const emailReducer = (state, action) => {
    switch (action.type) {
        case "GET_EMAIL":
            return {
                ...state,
                email: action.payload,
            };
        default:
            break;
    }
};

const getEmail = (dispatch) => {
    return (email) => {
        dispatch({ type: "GET_EMAIL", payload: email });
    };
};

export const { Context, Provider } = createDataContext(
    emailReducer,
    { getEmail },
    initialState
);
