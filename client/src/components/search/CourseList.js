import React, { useState, useEffect, Fragment, useContext } from "react";
import SwipeableViews from "react-swipeable-views";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import CircularProgress from "@mui/material/CircularProgress";
import { Event } from "../../utils/analytics";
import { classTimeString } from "../../utils/CourseTimeTransforms";
import Detail from "./Detail";
import MinimizedDetail from "./MinimizedDetail";
import { Table, TableBody, TableRow, TableCell, Box } from "@material-ui/core";

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import moment from "moment";
import { useQuery, gql, useMutation } from "@apollo/client";

import "./CourseList.global.css";
import { BottomModeContext } from "../main/Main";
import { Context as CourseSearchContext } from "../../contexts/courseSearchContext";

const detailStyle = {
    fontSize: "10px",
    color: "#6C7488",
    background: "#F7F8FA",
    width: "415px",
};

const minimizedDetailStyle = {
    borderStyle: "solid",
    display: "inline-block",
};

/**
 * Gets the term from local state management
 */
const GET_TERM = gql`
    query {
        term @client
    }
`;

// These should go to utils
const formatTime = (time) => moment(time, "HHmm").format("hh:mm a");

const courseToLabel = (course) => {
    //distribution and department
    if (course.sessions) {
        return `${course.subject} ${course.courseNum}: ${course.longTitle}`;
    } else {
        //instructors
        return `${course.course.subject} ${course.course.courseNum}: ${course.course.longTitle}`;
    }
};

/**
 *
 * @param {instructor} instructors
 * {id: xxx, firstName: xxx, lastName: xxx}
 */
const instructorsToNames = (instructors) => {
    let instructorNames = [];
    for (let instructor of instructors) {
        let instructorName = instructor.firstName + " " + instructor.lastName;
        instructorNames.push(instructorName);
    }
    return instructorNames;
};

// const sessionToString = (session) => {
//     let courseResult = [];
//     // Find class times
//     if (session.class.days.length > 0) {
//         let classTime = "Class: " + session.class.days.join("");
//         // Convert times
//         let startTime = formatTime(session.class.startTime);
//         let endTime = formatTime(session.class.endTime);

//         classTime += " " + startTime + " - " + endTime;
//         courseResult.push(
//             //added key here
//             <p style={{ padding: "5px" }} key={session.crn}>
//                 {classTime}
//             </p>
//         );
//     }
//     // Find lab times
//     if (session.lab.days.length > 0) {
//         let labTime = "Lab: " + session.lab.days.join("");

//         // Convert times
//         let startTime = formatTime(session.lab.startTime);
//         let endTime = formatTime(session.lab.endTime);

//         labTime += " " + startTime + " - " + endTime;
//         courseResult.push(
//             //added key here
//             <p style={{ padding: "5px" }} key={session._id}>
//                 {labTime}
//             </p>
//         );
//     }

// // Finally find instructors - only for distribution and departments
// if (session.instructors) {
//     if (session.instructors.length > 0) {
//         let instructorNames = instructorsToNames(session.instructors);
//         courseResult.push(
//             //added key here
//             <p style={{ padding: "5px" }} key={session._id}>
//                 {instructorNames.join(", ")}{" "}
//             </p>
//         );
//     }
// }
// return courseResult.length > 0
//     ? courseResult
//     : ["No information found for this session."];
// };

const styles = {
    slideContainer: {
        height: "100%",
        WebkitOverflowScrolling: "touch", // iOS momentum scrolling
    },
};

const ADD_DRAFT_SESSION = gql`
    mutation AddDraftSession($scheduleID: ID!, $sessionID: ID!) {
        scheduleAddSession(scheduleID: $scheduleID, sessionID: $sessionID) {
            _id
            term
            draftSessions {
                _id
                session {
                    _id
                }
                visible
            }
        }
    }
`;

const QUERY_DRAFT_SESSIONS = gql`
    query GetDraftSession($term: String!) {
        scheduleOne(filter: { term: $term }) {
            _id
            __typename
            draftSessions {
                _id
                __typename
                visible
                session {
                    _id
                }
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

/**
 * This is found in DraftCourseItem.js too; should be in utils
 */
const REMOVE_DRAFT_SESSION = gql`
    mutation RemoveDraftSession($scheduleID: ID!, $sessionID: ID!) {
        scheduleRemoveSession(scheduleID: $scheduleID, sessionID: $sessionID) {
            _id
            __typename
            term
            draftSessions {
                _id
                __typename
                session {
                    _id
                }
                visible
            }
        }
    }
`;

const SessionItem = ({ scheduleID, course, session, draftSessions }) => {
    let sessionSelected = false;

    const bottomModeContext = useContext(BottomModeContext);

    // Update draft sessions to only include valid sessions
    draftSessions = draftSessions.filter((draft) => draft.session);

    // Check if this course is in draftSessions
    for (let draftSession of draftSessions) {
        if (draftSession.session._id == session._id) {
            sessionSelected = true;
        }
    }

    const [addDraftSession, { data, loading, error }] = useMutation(
        ADD_DRAFT_SESSION,
        {
            variables: { scheduleID: scheduleID, sessionID: session._id },
        }
    );

    const [
        removeDraftSession,
        { dataOnRemove, loadingOnRemove, errorOnRemove },
    ] = useMutation(REMOVE_DRAFT_SESSION, {
        variables: { scheduleID: scheduleID, sessionID: session._id },
    });

    return (
        <div
            className="detailBox"
            // style={{ borderStyle: "solid", display: "inline-block" }}
            key={session.crn}
        >
            <input
                type="checkbox"
                checked={sessionSelected}
                onChange={(e) => {
                    // Simple transformation of CRN to a string
                    let crnString = String.toString(session.crn);

                    if (sessionSelected) {
                        // Track remove with GA
                        Event(
                            "COURSE_LIST",
                            "Remove Course from Schedule: " + crnString,
                            crnString
                        );
                        // Execute mutation to remove this session of the course from user's draftsessions
                        removeDraftSession();
                    } else {
                        // Track add with GA
                        Event(
                            "COURSE_LIST",
                            "Add Course to Schedule: " + crnString,
                            crnString
                        );
                        e.preventDefault();
                        // Execute mutation to add this session of the course to the user's draftsessions
                        addDraftSession();
                    }
                }}
                style={{ alignItems: "left" }}
            />
            {bottomModeContext === "Calendar" ? (
                <MinimizedDetail
                    style={minimizedDetailStyle}
                    session={session}
                    course={course}
                    open={true}
                    classTimeString={classTimeString}
                    instructorsToNames={instructorsToNames}
                />
            ) : (
                <Detail
                    style={detailStyle}
                    session={session}
                    course={course}
                    open={true}
                    classTimeString={classTimeString}
                    instructorsToNames={instructorsToNames}
                />
            )}
        </div>
    );
};

const CourseList = ({
    clickValue,
    scheduleID,
    query,
    searchType,
    idx,
    getByName,
}) => {
    const [courseSelected, setCourseSelected] = useState([]);

    // Get term from local state management
    const { data: termData } = useQuery(GET_TERM);
    let { term } = termData;

    let courseResults;
    let draftSessions;

    // We also want to fetch(from our cache, so this does NOT call the backend) the user's draftSessions
    let { data: scheduleData } = useQuery(QUERY_DRAFT_SESSIONS, {
        variables: { term: term.toString() },
    });

    // Fetch data required
    const {
        data: courseData,
        loading,
        error,
    } = useQuery(query, {
        variables: { ...searchType, term: term },
    });

    // Since searchType is passed in as an object with the value as the query returned value,
    // we need to check the object's value instead of directly checking searchType === ""
    if (Object.values(searchType)[0] === "") return <br />;

    const errorMessage = (
        <p>Something went wrong. Please refresh the page and try again 🥺</p>
    );

    if (loading)
        return (
            <p>
                <CircularProgress />
            </p>
        );
    if (error) return errorMessage;
    if (!courseData) return errorMessage;

    // Once the data has loaded, we want to extract the course results
    // We need to filter out any courses which have 0 sessions
    // or we get the session's course field for days and time interval selection
    switch (idx) {
        case 2:
            courseResults = courseData?.instructorOne.sessions;
            break;
        case 3:
            courseResults = courseData?.sessionByTimeInterval;
            courseResults = courseResults
                .map((session) => session.course)
                .filter((course) => course.sessions.length > 0);
            break;
        case 4:
            courseResults = courseData?.sessionByDay;
            courseResults = courseResults
                .map((session) => session.course)
                .filter((course) => course.sessions.length > 0);
            break;
        default:
            courseResults = courseData?.courseMany;
            courseResults = courseResults.filter(
                (course) => course.sessions.length > 0
            );
    }

    if (courseResults.length === 0)
        return <p>No Available Course In This Range</p>;

    // We also want to extract the user's draftSessions, nested inside their schedule
    draftSessions = scheduleData.scheduleOne.draftSessions;

    /**
     * Adds course to list of courses with their collapsibles open in the search menu,
     * effectively opening its collapsible
     */
    const addToCoursesSelected = (courseLabel) => {
        let copy = courseSelected.slice();

        // Add course with this label
        copy.push(courseLabel);
        setCourseSelected(copy);
    };

    /**
     * Removes course from list of courses with their collapsibles open in the search menu,
     * effectively closing its collapsible
     */
    const removeFromCoursesSelected = (courseLabel) => {
        let copy = courseSelected.slice();

        // Filter out all courses with this label
        copy = copy.filter((label) => label != courseLabel);
        setCourseSelected(copy);
    };

    const collapseItem = (course) => {
        //distribution, department, day, time interval
        if (course.sessions) {
            // return <Detail course={course} classTimeString={classTimeString} />;
            return course.sessions.map((session, idx) => (
                <SessionItem
                    //replace key with uuid
                    key={idx}
                    course={course}
                    session={session}
                    draftSessions={draftSessions}
                    scheduleID={scheduleID}
                />
            ));
        } else {
            //instructors
            let session = course;
            // renamed course to session for purpose of legibility & understanding
            return (
                <SessionItem
                    key={session.crn}
                    course={session.course}
                    session={session}
                    draftSessions={draftSessions}
                    scheduleID={scheduleID}
                />
            );
        }
    };

    const toggleCourseInfo = (id) =>
        courseSelected.includes(id)
            ? removeFromCoursesSelected(id)
            : addToCoursesSelected(id);

    return (
        <Fragment>
            <div className="courseListContainer">
                {courseResults &&
                    courseResults.map((course, idx) => {
                        let id = course._id;

                        let courseCode, longTitle;
                        if (course.sessions) {
                            courseCode =
                                course.subject + " " + course.courseNum;
                            longTitle = course.longTitle;
                        } else {
                            // Instructors
                            courseCode =
                                course.course.subject +
                                " " +
                                course.course.courseNum;
                            longTitle = course.course.longTitle;
                        }

                        return (
                            <div className="courseRow">
                                <IconButton
                                    className="courseMoreInfo"
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => toggleCourseInfo(id)}
                                    style={{
                                        color: "var(--quaternary-color)",
                                        fontSize: 15,
                                    }}
                                >
                                    {courseSelected.includes(id) ? (
                                        <KeyboardArrowUpIcon />
                                    ) : (
                                        <KeyboardArrowDownIcon />
                                    )}
                                </IconButton>
                                <p
                                    className="courseName"
                                    onClick={() => toggleCourseInfo(id)}
                                >
                                    <b className="courseCode">{courseCode}</b>{" "}
                                    {longTitle}
                                </p>
                                <Collapse
                                    className="collapsible"
                                    in={
                                        courseSelected.includes(id)
                                            ? true
                                            : false
                                    }
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    {collapseItem(course)}
                                </Collapse>
                            </div>
                        );
                    })}
            </div>
        </Fragment>
        // <SwipeableViews containerStyle={styles.slideContainer}>
        //     <List component="nav" aria-labelledby="nested-list-subheader">
        //         {courseResults.map((course, idx) => {
        //             let id = course._id;
        //             return (
        //                 <div key={idx}>
        //                     <ListItem
        //                         key={id}
        //                         onClick={() =>
        //                             courseSelected.includes(id)
        //                                 ? removeFromCoursesSelected(id)
        //                                 : addToCoursesSelected(id)
        //                         }
        //                         button
        //                     >
        //                         <div style={{ uppercase: "none" }}>
        //                             {courseToLabel(course)}
        //                         </div>
        //                     </ListItem>

        //                     <Collapse
        //                         in={courseSelected.includes(id) ? true : false}
        //                         timeout="auto"
        //                         unmountOnExit
        //                     >
        //                         <List component="div" disablePadding>
        //                             {collapseItem(course)}
        //                         </List>
        //                     </Collapse>
        //                 </div>
        //             );
        //         })}
        //     </List>
        // </SwipeableViews>
    );
};

export default CourseList;
