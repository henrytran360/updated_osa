import React, { useState, useEffect } from "react";
import Selection from "./Selection";
import { initGA } from "../../utils/analytics";
import { useQuery, gql } from "@apollo/client";
import Button from "@material-ui/core/Button";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import "./CourseSearch.global.css";
import CompiledLists from "./CompiledLists";
import { CircularProgress } from "@material-ui/core";

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

const initialStartTime = "11:00";
const initialEndTime = "12:00";

const CourseSearch = ({ scheduleID, clickValue }) => {
    const [getDepts, setDepts] = useState([]); // Used for the entire list of departments
    const [getDept, setDept] = useState([]); // Used for selection of a particular department
    const [getDist, setDist] = useState([]); // Used for selection of a particular distribution

    //INSTRUCTOR SEARCH
    const [getInstruct, setInstruct] = useState([]); // Used for the entire list of instructors
    const [getInst, setInst] = useState([]); // Used for selection of a particular instructor
    const formatTime = (time) => {
        return time.replace(":", "");
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
    const [activeButtonIndex, setButtonIndex] = useState(0);

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
        "Department",
        "Distribution",
        "Instructors",
        "Course Time",
        "Course Day",
    ];
    const allOptions = [
        getDepts,
        allDistributions,
        getInstruct,
        getDepts,
        allDaysLong,
    ];
    const allSelected = [getDept, getDist, getInst, getTime, getDay];
    const setFuncs = [setDept, setDist, setInst, setTime, setDay];

    const variables4Query = [
        ["subject"],
        ["distribution"],
        ["firstName", "lastName"],
        ["startTime", "endTime"],
        ["days"], // this is not used in CompiledLists.js
    ];

    const queryFilters = [
        ["value"],
        ["value"],
        ["firstName", "lastName"],
        ["startTime", "endTime"],
        ["value"], // this is not used in CompiledLists.js
    ];

    const getQuery = [
        GET_DEPT_COURSES,
        GET_DIST_COURSES,
        COURSES_BY_INSTRUCTORS,
        GET_TIME_INTERVAL_COURSES,
        GET_DAYS_COURSES,
    ];

    /**
     * We only want this to run when the subjects list data loads
     */
    useEffect(() => {
        if (departmentsData) {
            console.log(term);
            let { departments } = departmentsData;
            console.log(departments);
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
                    {type}
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
        const searchType = searchTypes[activeButtonIndex];
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

        const displayArray = [selection, selection, selection, time, selection];

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
    const errorMessage = (
        <p>Something went wrong. Please refresh the page and try again 🥺</p>
    );
    if (departmentsLoading || instructorsLoading)
        return (
            <div className="loadingMessage">
                <CircularProgress color="inherit" />
            </div>
        );
    if (departmentsError || instructorsError) return errorMessage;

    return (
        <div className="searchBar">
            <div className="searchBar-content">
                <div className="filter">{displaySearch()}</div>
                <div className="searchText">Search By:</div>
                <div className="buttons">{renderSearchOptions()}</div>
                <CompiledLists
                    scheduleID={scheduleID}
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
