import createDataContext from "./createDataContext";

const initialState = {
    bottomMode2: {
        Search: true,
        Calendar: true,
        Details: true,
    },
};

const bottomModeReducer = (prevState, action) => {
    switch (action.type) {
        case "change_bottom_mode":
            return {
                ...prevState,
                bottomMode2: action.payload,
            };

        default:
            return prevState;
    }
};

const changeBottomMode = (dispatch) => {
    return (bottomMode2) => {
        dispatch({ type: "change_bottom_mode", payload: bottomMode2 });
    };
};

export const { Context, Provider } = createDataContext(
    bottomModeReducer,
    { changeBottomMode },
    initialState
);
