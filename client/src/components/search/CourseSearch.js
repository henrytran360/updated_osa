import React, { useState, useEffect, useContext } from "react";
import Selection from "./Selection";
import { initGA } from "../../utils/analytics";
import { useQuery, gql, useLazyQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import customStyles from "./SelectStyles";
import { ThemeProvider } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import "./CourseSearch.global.css";
import CompiledLists from "./CompiledLists";
import { CircularProgress } from "@material-ui/core";
import Select from "react-select";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Context as CourseSearchContext } from "../../contexts/courseSearchContext";

/**
 * TODO: MAKE A FRAGMENT! THIS IS USED IN TWO PLACES
 * Gets the term from local state management
 */
const GET_TERM = gql`
    query {
        term @client
    }
`;

const GET_DEPARTMENTS = gql`
    query GetDepartments($term: Int!) {
        departments(term: $term)
    }
`;

const GET_DEPT_COURSES = gql`
    query GetDeptCourses($subject: String!, $term: Float!) {
        courseMany(filter: { subject: $subject }, sort: COURSE_NUM_ASC) {
            _id
            subject
            courseNum
            longTitle
            sessions(filter: { term: $term }) {
                _id
                term
                crn
                class {
                    days
                    startTime
                    endTime
                }
                lab {
                    days
                    startTime
                    endTime
                }
                instructors {
                    firstName
                    lastName
                }
                course {
                    distribution
                    prereqs
                    coreqs
                }
                enrollment
                maxEnrollment
                crossEnrollment
                maxCrossEnrollment
                waitlisted
                maxWaitlisted
                instructionMethod
            }
        }
    }
`;

// new:
const GET_DIST_COURSES = gql`
    query CourseQuery($distribution: String!, $term: Float!) {
        courseMany(
            filter: { distribution: $distribution }
            sort: SUBJECT_AND_COURSE_NUM_ASC
        ) {
            _id
            subject
            courseNum
            longTitle
            distribution
            sessions(filter: { term: $term }) {
                _id
                term
                crn
                class {
                    days
                    startTime
                    endTime
                }
                lab {
                    days
                    startTime
                    endTime
                }
                instructors {
                    firstName
                    lastName
                }
                course {
                    distribution
                    prereqs
                    coreqs
                }
                enrollment
                maxEnrollment
                crossEnrollment
                maxCrossEnrollment
                waitlisted
                maxWaitlisted
                instructionMethod
            }
        }
    }
`;

const GET_DAYS_COURSES = gql`
    query GetDaysCourses($days: [String!], $term: Float!) {
        sessionByDay(days: $days, term: $term) {
            course {
                _id
                subject
                courseNum
                longTitle
                distribution
                sessions(filter: { term: $term }) {
                    _id
                    crn
                    instructionMethod
                    class {
                        days
                        startTime
                        endTime
                    }
                    lab {
                        days
                        startTime
                        endTime
                    }
                    instructors {
                        firstName
                        lastName
                    }
                    course {
                        distribution
                        prereqs
                        coreqs
                    }
                }
            }
        }
    }
`;

const GET_TIME_INTERVAL_COURSES = gql`
    query GetTimeIntervalCourses(
        $startTime: String!
        $endTime: String!
        $term: Float!
    ) {
        sessionByTimeInterval(
            startTime: $startTime
            endTime: $endTime
            term: $term
        ) {
            course {
                _id
                subject
                courseNum
                longTitle
                distribution
                sessions(filter: { term: $term }) {
                    _id
                    crn
                    instructionMethod
                    class {
                        days
                        startTime
                        endTime
                    }
                    lab {
                        days
                        startTime
                        endTime
                    }
                    instructors {
                        firstName
                        lastName
                    }
                    course {
                        distribution
                        prereqs
                        coreqs
                    }
                }
            }
        }
    }
`;

//NEWWWWW
const GET_INSTRUCTORS = gql`
    query getInstructors($term: Int!) {
        instructors(term: $term) {
            firstName
            lastName
        }
    }
`;
const COURSES_BY_INSTRUCTORS = gql`
    query InstructorQuery(
        $firstName: String!
        $lastName: String!
        $term: Float!
    ) {
        instructorOne(filter: { firstName: $firstName, lastName: $lastName }) {
            sessions(filter: { term: $term }) {
                _id
                term
                course {
                    subject
                    courseNum
                    longTitle
                    distribution
                    prereqs
                    coreqs
                }
                class {
                    days
                    startTime
                    endTime
                }
                lab {
                    days
                    startTime
                    endTime
                }
                crn
                enrollment
                maxEnrollment
                crossEnrollment
                maxCrossEnrollment
                waitlisted
                maxWaitlisted
                instructionMethod
            }
        }
    }
`;

const GET_COURES_BY_NAME = gql`
    query GetCourseByName($inputName: String!, $term: Float!) {
        courseMany(
            filter: { courseNameRegExp: $inputName }
            sort: COURSE_NUM_ASC
        ) {
            _id
            subject
            courseNum
            longTitle
            sessions(filter: { term: $term }) {
                _id
                term
                crn
                class {
                    days
                    startTime
                    endTime
                }
                lab {
                    days
                    startTime
                    endTime
                }
                instructors {
                    firstName
                    lastName
                }
                course {
                    distribution
                    prereqs
                    coreqs
                }
                enrollment
                maxEnrollment
                crossEnrollment
                maxCrossEnrollment
                waitlisted
                maxWaitlisted
                instructionMethod
            }
        }
    }
`;

const initialStartTime = "11:00";
const initialEndTime = "12:00";

// const customStyles = {
//     option: (styles, { data, isDisabled, isFocused, isSelected }) => {
//         return {
//             ...styles,
//             width: 140,
//             backgroundColor: isFocused ? "var(--primary-color)" : "var(--border-color)",
//             color: "var(--background-color)",
//             cursor: isDisabled ? "not-allowed" : "default",
//         };
//     },
//     control: (base, state) => ({
//         ...base,
//         color: "var(--background-color)",
//         width: 140,
//         borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
//         backgroundColor: "var(--primary-color)",
//         borderColor: "var(--border-color)",
//         boxShadow: state.isFocused ? null : null,
//         "&:hover": {
//             borderColor: state.isFocused ? "var(--primary-color)" : "var(--border-color)",
//         },
//     }),
//     singleValue: (provided, state) => {
//         const opacity = state.isDisabled ? 0.5 : 1;
//         const transition = "opacity 300ms";

//         return { ...provided, opacity, transition };
//     },
// };

const useStyles = makeStyles((theme) => ({
    searchIconStyle: {
        color: "var(--primary-color)",
    },
}));

const CourseSearch = ({ scheduleID, clickValue }) => {
    const [getDepts, setDepts] = useState([]); // Used for the entire list of departments
    const [getDept, setDept] = useState([]); // Used for selection of a particular department
    const [getDist, setDist] = useState([]); // Used for selection of a particular distribution

    //INSTRUCTOR SEARCH
    const [getInstruct, setInstruct] = useState([]); // Used for the entire list of instructors
    const [getInst, setInst] = useState([]); // Used for selection of a particular instructor
    const [getByName, setByName] = useState([]);
    const [value, setValue] = useState("");
    const [courseName, setCourseName] = useState("");
    const formatTime = (time) => {
        return time.replace(":", "");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            loadData();
            setCourseName(value.replace(/\s+/g, "").toLowerCase());
            setButtonIndex(5);
        }
    };

    const allDistributions = [
        { label: "Distribution I", value: "Distribution I" },
        { label: "Distribution II", value: "Distribution II" },
        { label: "Distribution III", value: "Distribution III" },
    ]; // All distributions

    const allDaysLong = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ].map((day, idx) => ({ index: idx, label: day, value: day })); // All days in full name

    const allDaysMap = {
        Monday: "M",
        Tuesday: "T",
        Wednesday: "W",
        Thursday: "R",
        Friday: "F",
        Saturday: "S",
        Sunday: "U",
    }; // All days in abbreviation, used for query

    const [getDay, setDay] = useState([]); // store the selected days
    const [getTime, setTime] = useState([
        { startTime: initialStartTime, endTime: initialEndTime },
    ]); // store the selected time interval

    // Represents which button is currently clicked for styling and returning data
    const [activeButtonIndex, setButtonIndex] = useState(5);
    const classes = useStyles();
    const {
        data: { term },
    } = useQuery(GET_TERM); // Gets the term which we need to request subjects from

    const {
        data: departmentsData,
        loading: departmentsLoading,
        error: departmentsError,
    } = useQuery(GET_DEPARTMENTS, {
        variables: { term },
    });

    //get instructor data
    const {
        data: instructorData,
        loading: instructorsLoading,
        error: instructorsError,
    } = useQuery(GET_INSTRUCTORS, {
        variables: { term },
    });
    const [
        loadData,
        { data: courseDataByName, loading: loading2, error: error2 },
    ] = useLazyQuery(GET_COURES_BY_NAME, {
        variables: {
            inputName: courseName.replace(/\s+/g, "").toLowerCase(),
            term: term,
        },
    });

    useEffect(() => {
        if (courseDataByName) {
            setByName(courseDataByName.courseMany);
        }
    }, [courseDataByName]);

    //deal with instructor names with different structures (ex. Benjamin C. Kerswell, Maria Fabiola Lopez Duran, Benjamin Fregly)
    //easier to split into first and last names for query in InstructorList
    const instructorsToSplit = (instructors) => {
        let instructorNames = [];
        for (let instructor of instructors) {
            let instructorName =
                instructor.firstName + " " + instructor.lastName;
            instructorNames.push({
                fullName: instructorName,
                firstName: instructor.firstName,
                lastName: instructor.lastName,
            });
        }
        return instructorNames;
    };

    // Convert day's longname to its abbreviation
    const convertDays = (days) => {
        // We need to first sort the selected array to match the order that is stored
        // in our database. Otherwise the $eq in SessionSchema will not work correctly
        // as the order of the elements in the selected array may be different from that
        // in the database
        days.sort((a, b) => {
            return a.index - b.index;
        });
        return days.map((day) => allDaysMap[day.value]);
    };

    // These variables are used in displaySearch function and displayCourseList function:
    // Department is used as a placeholder for Instructors for now
    const searchTypes = [
        { label: "Department", value: 0 },
        { label: "Distribution", value: 1 },
        { label: "Instructors", value: 2 },
        { label: "Course Time", value: 3 },
        { label: "Course Day", value: 4 },
        { label: "Course Name", value: 5 },
    ];
    const allOptions = [
        getDepts,
        allDistributions,
        getInstruct,
        getDepts,
        allDaysLong,
        getByName,
    ];
    const allSelected = [getDept, getDist, getInst, getTime, getDay, getByName];
    const setFuncs = [setDept, setDist, setInst, setTime, setDay, setByName];

    const variables4Query = [
        ["subject"],
        ["distribution"],
        ["firstName", "lastName"],
        ["startTime", "endTime"],
        ["days"], // this is not used in CompiledLists.js
        ["inputName"],
    ];

    const queryFilters = [
        ["value"],
        ["value"],
        ["firstName", "lastName"],
        ["startTime", "endTime"],
        ["value"], // this is not used in CompiledLists.js
        ["value"],
    ];

    const getQuery = [
        GET_DEPT_COURSES,
        GET_DIST_COURSES,
        COURSES_BY_INSTRUCTORS,
        GET_TIME_INTERVAL_COURSES,
        GET_DAYS_COURSES,
        GET_COURES_BY_NAME,
    ];

    /**
     * We only want this to run when the subjects list data loads
     */
    useEffect(() => {
        if (departmentsData) {
            let { departments } = departmentsData;
            setDepts(departments.map((dept) => ({ label: dept, value: dept })));
        }
    }, [departmentsData]);
    //for instructor data
    useEffect(() => {
        if (instructorData) {
            let instructors = instructorData["instructors"];
            let instructorList = instructorsToSplit(instructors);
            setInstruct(
                instructorList.map((inst) => ({
                    label: inst.fullName,
                    value: inst.fullName,
                    firstName: inst.firstName,
                    lastName: inst.lastName,
                }))
            );
        }
    }, [instructorData]);

    // Set the selected department/distribution/instructor
    const handleChange = (selectedOption) => {
        const setFunc = setFuncs[activeButtonIndex];
        setFunc(selectedOption);
    };

    // Set the selected startTime/EndTime
    const handleStartTimeTFChange = (event) => {
        let selectedTime = event.target.value;
        setTime([{ ...getTime[0], startTime: formatTime(selectedTime) }]);
    };
    const handleEndTimeTFChange = (event) => {
        let selectedTime = event.target.value;
        setTime([{ ...getTime[0], endTime: formatTime(selectedTime) }]);
    };

    const renderSearchOptions = () => {
        return searchTypes.map((type, index) => {
            /**
             * If the current index of the element is the same as the
             * active button index, then the button color is primary.
             * Otherwise, the button color is secondary.
             *
             */
            const selected = index === activeButtonIndex ? "selected" : "";

            return (
                <div
                    onClick={() => setButtonIndex(index)}
                    className={`searchButton ${selected}`}
                >
                    {type.label}
                </div>
            );
        });
    };

    /**
     * Display the time textfield for user to select time range for the search
     */
    const displayTimeTF = (lbl, defaultVal, onChangeHandler) => {
        return (
            <TextField
                style={{
                    width: "10vw",
                }}
                id="time"
                label={lbl}
                type="time"
                defaultValue={defaultVal}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
                onChange={onChangeHandler}
            />
        );
    };

    /**
     * Displays the search component based on the user's search option
     */
    const displaySearch = () => {
        const searchType = searchTypes[activeButtonIndex].label;
        const option = allOptions[activeButtonIndex];
        const selected = allSelected[activeButtonIndex];
        const selection = (
            <Selection
                className="filter"
                title={searchType}
                options={option}
                selected={selected}
                show={true}
                handleChange={handleChange}
            />
        );

        const time = (
            <div className="selectTime">
                {displayTimeTF(
                    "From",
                    initialStartTime,
                    handleStartTimeTFChange
                )}
                {displayTimeTF("To", initialEndTime, handleEndTimeTFChange)}
            </div>
        );

        const search = (
            <div className="seachCourseContainer">
                <div className="searchInputsCourse">
                    <input
                        type="text"
                        className="header-search"
                        placeholder="Search courses"
                        name="s"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyUp={handleKeyPress}
                    />
                </div>
                <div
                    style={{
                        width: "10%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 10,
                    }}
                >
                    <IconButton
                        size="medium"
                        // onClick={handleClick}
                        value={"Search"}
                        className={classes.searchIconStyle}
                        onClick={() => {
                            setCourseName(
                                value.replace(/\s+/g, "").toLowerCase()
                            );
                            setButtonIndex(5);
                            loadData();
                        }}
                    >
                        <SearchOutlinedIcon />
                    </IconButton>
                </div>
            </div>
        );

        const displayArray = [
            selection,
            selection,
            selection,
            time,
            selection,
            search,
        ];

        return displayArray[activeButtonIndex];
    };

    /**
     * Displays the course list component based on whether user is searching
     * by distribution or by department
     */
    const displayCourseList = () => {
        return (
            <CourseList
                clickValue={clickValue}
                scheduleID={scheduleID}
                query={getQuery[activeButtonIndex]}
                searchType={variables4Query[activeButtonIndex]}
                idx={activeButtonIndex}
            />
            //<div></div>
        );

        const displayArray = [selection, selection, selection, time, selection];

        return displayArray[activeButtonIndex];
    };

    // Initialize Google Analytics
    initGA();

    // Don't show anything until departments & instructors are finished loading
    const errorDepartMessage = (
        <p>
            {" "}
            Departments for this term are not availble at this moment. Please
            try another term 🥺
        </p>
    );
    const errorInstrMessage = (
        <p>
            {" "}
            Instructors for this term are not availble at this moment. Please
            try another term 🥺
        </p>
    );
    if (departmentsLoading || instructorsLoading)
        return (
            <div className="loadingMessage">
                <CircularProgress color="inherit" />
            </div>
        );
    // console.log(departmentsError);
    // console.log(instructorsError);
    // if (departmentsError || instructorsError) return errorMessage;
    if (departmentsError) return errorDepartMessage;
    if (instructorsError) return errorInstrMessage;

    const handleSearchChange = (newFilter) => {
        setButtonIndex(newFilter.value);
    };

    return (
        <div className="searchBar">
            <div className="searchBar-content">
                <div className="searchText">Search by:</div>
                <div className="button-and-search">
                    <Select
                        // className="react-select-container"
                        value={searchTypes[activeButtonIndex]}
                        onChange={handleSearchChange}
                        options={searchTypes}
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                text: "white",
                            },
                        })}
                        styles={customStyles}
                    />
                    <div className="filter2">{displaySearch()}</div>
                </div>
                {/* <div className="buttons">{renderSearchOptions()}</div> */}
                <CompiledLists
                    scheduleID={scheduleID}
                    getByName={courseDataByName}
                    courseName={courseName}
                    selectedOptions={allSelected[activeButtonIndex]}
                    searchKey={variables4Query[activeButtonIndex]}
                    query={getQuery[activeButtonIndex]}
                    queryFilters={queryFilters[activeButtonIndex]}
                    convertDays={convertDays} // Use to convert days longname to its abbreviation
                    idx={activeButtonIndex} // need this to identify which field to call on the value returned by the query
                />
            </div>
        </div>
    );
};

export default CourseSearch;
