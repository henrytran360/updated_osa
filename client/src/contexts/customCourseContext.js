import createDataContext from "./createDataContext";

const initialState = {
    customCourses: [],
};

const customCourseReducer = (state, action) => {
    switch (action.type) {
        case "ADD_CUSTOM_COURSE":
            if (
                state.customCourses &&
                state.customCourses.find((course) => course.id == action.id + 1)
            ) {
                const newState = { ...state };
                console.log("in the array");
                const index = newState.customCourses.findIndex(
                    (course) => course.id == action.id + 1
                );
                if (index >= 0) {
                    newState.customCourses[index] = {
                        course: action.payload,
                        id: action.id,
                    };
                }
                return newState;
            }
            console.log("not in the array");
            return {
                ...state,
                customCourses: [
                    ...state.customCourses,
                    {
                        course: action.payload,
                        id: state.customCourses.length + 1,
                    },
                ],
            };
        default:
            return state;
    }
};

const addCustomCourse = (dispatch) => {
    return (customCourse, id) => {
        dispatch({ type: "ADD_CUSTOM_COURSE", payload: customCourse, id: id });
    };
};

export const { Context, Provider } = createDataContext(
    customCourseReducer,
    { addCustomCourse },
    initialState
);
