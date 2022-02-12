import React, { useState, useEffect, createContext, useContext } from "react";
import Header from "../header/Header";
import CourseCalendar from "../calendar/Calendar";
import ClassSelector from "../draftview/ClassSelector";
import SemesterSelect from "../draftview/SemesterSelect";
import CourseSearch from "../search/CourseSearch";
import { useToasts } from "react-toast-notifications";
import { useQuery, gql, useMutation } from "@apollo/client";
import LoadingScreen from "../LoadingScreen";
import IconButton from "@material-ui/core/IconButton";
import DateRangeIcon from "@material-ui/icons/DateRange";
import ListIcon from "@material-ui/icons/List";

import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Context as BottomModeContexts } from "../../contexts/bottomModeContext";

import "./Main.global.css";
import Error from "../error/Error";
import NewClassSelector from "../draftview/NewClassSelector";

export const BottomModeContext = createContext("Calendar");

export const GET_USER_SCHEDULE = gql`
    query GetUserSchedule($term: String!) {
        scheduleOne(filter: { term: $term }) {
            _id
            draftSessions {
                _id
                visible
                session {
                    _id
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
                    enrollment
                    maxEnrollment
                    waitlisted
                    maxWaitlisted
                    instructionMethod
                    instructors {
                        firstName
                        lastName
                    }
                    course {
                        creditsMin
                        creditsMax
                        longTitle
                        subject
                        courseNum
                        distribution
                        coreqs
                        prereqs
                    }
                }
            }
        }
    }
`;

/**
 * This simply fetches from our cache whether a recent update has occurred
 * TODO: CREATE FRAGMENTS / PLACE TO STORE ALL OF THESE SINCE THIS ONE IS ALSO IN ROUTES.JS
 */
const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
        recentUpdate @client
    }
`;

/**
 * Updates the user object field of recentUpdate
 */
const SEEN_RECENT_UPDATE = gql`
    mutation SeenRecentUpdate {
        userUpdateOne(record: { recentUpdate: false }) {
            recordId
        }
    }
`;

// Toast for notifications
const Main = ({}) => {
    // Check for recent update from cache
    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    let { term, recentUpdate } = storeData;
    const [bottomMode, setBottomMode] = useState("Calendar");
    console.log(term);
    // Need to be able to update recentUpdate field on the user when they dismiss
    let [seenRecentUpdate] = useMutation(SEEN_RECENT_UPDATE);

    // Add toast
    let { addToast } = useToasts();

    useEffect(() => {
        if (recentUpdate) {
            let message =
                "We've recently updated our systems to optimize your user experience. \n \
                This required the removal of all current course data. However, courses will now be updated with \
                the latest information every hour.";
            addToast(message, {
                appearance: "info",
                onDismiss: () => seenRecentUpdate(),
            });
        }
    }, [recentUpdate]);

    // Query for the schedule of the user that is logged in
    const { data, loading, error } = useQuery(GET_USER_SCHEDULE, {
        variables: { term: new String(term) },
    });

    if (loading) return <LoadingScreen />;
    if (error) return <Error />;
    if (!data) return <Error />;

    const schedule = data.scheduleOne;

    const handleClick = (e) => {
        setBottomMode(e.currentTarget.value);
    };

    const {
        state: { bottomMode2 },
        changeBottomMode,
    } = useContext(BottomModeContexts);
    console.log(bottomMode2);

    const renderContent = () => {
        return (
            <div className="Container">
                {/* all 3 open */}
                {bottomMode2.Search &&
                    bottomMode2.Calendar &&
                    bottomMode2.Details && (
                        <>
                            <div style={{ width: "30%", height: "100%" }}>
                                <CourseSearch
                                    scheduleID={schedule._id}
                                    clickValue={bottomMode}
                                />
                            </div>
                            <div style={{ width: "40%" }}>
                                <CourseCalendar
                                    draftSessions={schedule.draftSessions}
                                />
                            </div>
                            <div style={{ width: "30%" }}>
                                <NewClassSelector
                                    scheduleID={schedule._id}
                                    draftSessions={schedule.draftSessions}
                                />
                            </div>
                        </>
                    )}
                {/* search + calender open */}
                {bottomMode2.Search &&
                    bottomMode2.Calendar &&
                    !bottomMode2.Details && (
                        <>
                            <div style={{ width: "40%", height: "100%" }}>
                                <CourseSearch
                                    scheduleID={schedule._id}
                                    clickValue={bottomMode}
                                />
                            </div>
                            <div style={{ width: "60%" }}>
                                <CourseCalendar
                                    draftSessions={schedule.draftSessions}
                                />
                            </div>
                        </>
                    )}
                {/* search + details open */}
                {bottomMode2.Search &&
                    !bottomMode2.Calendar &&
                    bottomMode2.Details && (
                        <>
                            <div style={{ width: "50%", height: "100%" }}>
                                <CourseSearch
                                    scheduleID={schedule._id}
                                    clickValue={bottomMode}
                                />
                            </div>
                            <div style={{ width: "50%" }}>
                                <NewClassSelector
                                    scheduleID={schedule._id}
                                    draftSessions={schedule.draftSessions}
                                />
                            </div>
                        </>
                    )}
                {/* calendar + details open */}
                {!bottomMode2.Search &&
                    bottomMode2.Calendar &&
                    bottomMode2.Details && (
                        <>
                            <div style={{ width: "60%" }}>
                                <CourseCalendar
                                    draftSessions={schedule.draftSessions}
                                />
                            </div>
                            <div style={{ width: "40%" }}>
                                <NewClassSelector
                                    scheduleID={schedule._id}
                                    draftSessions={schedule.draftSessions}
                                />
                            </div>
                        </>
                    )}
                {/* only search */}
                {bottomMode2.Search &&
                    !bottomMode2.Calendar &&
                    !bottomMode2.Details && (
                        <>
                            <div style={{ width: "100%", height: "100%" }}>
                                <CourseSearch
                                    scheduleID={schedule._id}
                                    clickValue={bottomMode}
                                />
                            </div>
                        </>
                    )}
                {/* only calendar */}
                {!bottomMode2.Search &&
                    bottomMode2.Calendar &&
                    !bottomMode2.Details && (
                        <>
                            <div style={{ width: "100%", height: "100%" }}>
                                <CourseCalendar
                                    draftSessions={schedule.draftSessions}
                                />
                            </div>
                        </>
                    )}
                {/* only details */}
                {schedule &&
                    !bottomMode2.Search &&
                    !bottomMode2.Calendar &&
                    bottomMode2.Details && (
                        <>
                            <div style={{ width: "100%", height: "100%" }}>
                                <NewClassSelector
                                    scheduleID={schedule._id}
                                    draftSessions={schedule.draftSessions}
                                />
                            </div>
                        </>
                    )}
            </div>
        );
    };

    return (
        <div
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
                color: "#272D2D",
                height: "93%",
            }}
        >
            {/* <div style={{ padding: "2%" }}>
                <ClassSelector
                    scheduleID={schedule._id}
                    draftSessions={schedule.draftSessions}
                />
            </div> */}

            {/* <ButtonGroup className="buttonGroup">{renderIcons()}</ButtonGroup> */}

            <BottomModeContext.Provider value={bottomMode}>
                {renderContent()}
            </BottomModeContext.Provider>
        </div>
    );
};

export default Main;
