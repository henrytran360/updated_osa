import createDataContext from "./createDataContext";

const initialState = {
    course: "",
};

const courseSearchReducer = (prevState, action) => {
    switch (action.type) {
        case "course_search":
            return {
                ...prevState,
                course: action.payload,
            };

        default:
            return prevState;
    }
};

const courseSearchAction = (dispatch) => {
    return (course) => {
        dispatch({ type: "course_search", payload: course });
    };
};

export const { Context, Provider } = createDataContext(
    courseSearchReducer,
    { courseSearchAction },
    initialState
);
