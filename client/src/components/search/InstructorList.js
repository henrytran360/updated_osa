import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import { Event } from "../../utils/analytics";

import moment from "moment";
import { useQuery, gql, useMutation } from "@apollo/client";

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
            }
        }
    }
`;
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
    return (
        course.course.subject +
        " " +
        course.course.courseNum +
        " || " +
        course.course.longTitle
    );
};

/**
 *
 * @param {instructor} instructors
 * {id: xxx, firstName: xxx, lastName: xxx}
 */

const sessionToString = (session) => {
    let courseResult = [];
    // Find class times
    if (session.class.days.length > 0) {
        let classTime = "Class: " + session.class.days.join("");
        // Convert times
        let startTime = formatTime(session.class.startTime);
        let endTime = formatTime(session.class.endTime);

        classTime += " " + startTime + " - " + endTime;
        courseResult.push(<p style={{ padding: "5px" }}>{classTime}</p>);
    }
    // Find lab times
    if (session.lab.days.length > 0) {
        let labTime = "Lab: " + session.lab.days.join("");

        // Convert times
        let startTime = formatTime(session.lab.startTime);
        let endTime = formatTime(session.lab.endTime);

        labTime += " " + startTime + " - " + endTime;
        courseResult.push(<p style={{ padding: "5px" }}>{labTime}</p>);
    }
    return courseResult.length > 0
        ? courseResult
        : ["No information found for this session."];
};

const styles = {
    slideContainer: {
        height: 400,
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

const SessionItem = ({ scheduleID, course, draftSessions }) => {
    let sessionSelected = false;

    // Check if this course is in draftSessions
    for (let draftSession of draftSessions) {
        if (draftSession.session._id == course._id) {
            sessionSelected = true;
        }
    }

    let [addDraftSession, { data, loading, error }] = useMutation(
        ADD_DRAFT_SESSION,
        {
            variables: { scheduleID: scheduleID, sessionID: course._id },
        }
    );

    let [
        removeDraftSession,
        { dataOnRemove, loadingOnRemove, errorOnRemove },
    ] = useMutation(REMOVE_DRAFT_SESSION, {
        variables: { scheduleID: scheduleID, sessionID: course._id },
    });

    return (
        <div
            key={course.crn}
            style={{ borderStyle: "solid", display: "inline-block" }}
        >
            <input
                type="checkbox"
                checked={sessionSelected}
                onChange={() => {
                    // Simple transformation of CRN to a string

                    let crnString = String.toString(course.crn);

                    if (sessionSelected) {
                        // Track remove with GA
                        Event(
                            "COURSE_LIST",
                            "Remove Course from Schedule: " + crnString,
                            crnString
                        );

                        console.log("Boom.");

                        // Execute mutation to remove this session of the course from user's draftsessions
                        removeDraftSession();

                        console.log("No errors");
                    } else {
                        // Track add with GA
                        Event(
                            "COURSE_LIST",
                            "Add Course to Schedule: " + crnString,
                            crnString
                        );

                        // Execute mutation to add this session of the course to the user's draftsessions
                        addDraftSession();
                    }
                }}
                style={{ alignItems: "left" }}
            />
            <div style={{ alignItems: "left" }}>{sessionToString(course)}</div>
        </div>
    );
};

const InstructorList = ({ scheduleID, instructor, firstName, lastName }) => {
    const [courseSelected, setCourseSelected] = useState([]);
    console.log(instructor, firstName, lastName);

    // Get term from local state management
    const { data: termData } = useQuery(GET_TERM);
    let { term } = termData;

    // Department isn't empty, so we need to fetch the courses for the department
    const { data: instCourseData, loading, error } = useQuery(
        COURSES_BY_INSTRUCTORS,
        {
            variables: { firstName: firstName, lastName: lastName, term: term },
        }
    );

    // We also want to fetch (from our cache, so this does NOT call the backend) the user's draftSessions
    let { data: scheduleData } = useQuery(QUERY_DRAFT_SESSIONS, {
        variables: { term: term.toString() },
    });
    if (instructor == "") {
        return <br />;
    }

    // TODO: Move to shared folder; this is duplicated
    const errorMessage = (<p>Something went wrong. Please refresh the page and try again 🥺</p>); 

    if (loading) return <p>Loading...</p>;
    if (error) return errorMessage;
    if (!instCourseData) return errorMessage;

    // Once the data has loaded, we want to extract the course results for the department
    let courseResults = instCourseData.instructorOne.sessions;

    // We need to filter out any courses which have 0 sessions
    // courseResults = courseResults.filter(
    //     (course) => course.sessions.length > 0
    // );

    // We also want to extract the user's draftSessions, nested inside their schedule
    let draftSessions = scheduleData.scheduleOne.draftSessions;

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

    return (
        <SwipeableViews containerStyle={styles.slideContainer}>
            <List component="nav" aria-labelledby="nested-list-subheader">
                {courseResults.map((course) => {
                    let id = course._id;
                    return (
                        <div>
                            <ListItem
                                key={id}
                                onClick={() =>
                                    courseSelected.includes(id)
                                        ? removeFromCoursesSelected(id)
                                        : addToCoursesSelected(id)
                                }
                                button
                            >
                                {courseToLabel(course)}
                            </ListItem>
                            <Collapse
                                in={courseSelected.includes(id) ? true : false}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="div" disablePadding>
                                    <SessionItem
                                        course={course}
                                        session={course}
                                        draftSessions={draftSessions}
                                        scheduleID={scheduleID}
                                    />
                                </List>
                            </Collapse>
                        </div>
                    );
                })}
            </List>
        </SwipeableViews>
    );
};

export default InstructorList;
