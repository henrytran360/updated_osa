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
import Footer from "../footer/Footer";

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
        draftSessionsMain @client
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

const QUERY_USER_SCHEDULES = gql`
    query scheduleMany($_id: ID) {
        scheduleMany(_id: $_id) {
            _id
            term
        }
    }
`;

// Toast for notifications
const Main = ({}) => {
    // Check for recent update from cache
    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    let { term, recentUpdate, draftSessionsMain } = storeData;
    const [bottomMode, setBottomMode] = useState("Calendar");
    // Need to be able to update recentUpdate field on the user when they dismiss
    let [seenRecentUpdate] = useMutation(SEEN_RECENT_UPDATE);

    // console.log(draftSessionsMain);
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
    if (error) return <Error message={error.message} />;
    if (!data) return <Error />;

    const schedule = data.scheduleOne;

    const handleClick = (e) => {
        setBottomMode(e.currentTarget.value);
    };

    const {
        state: { bottomMode2 },
        changeBottomMode,
    } = useContext(BottomModeContexts);

    const renderContent = () => {
        return (
            <div className="Container">
                <Header />
                <div className="ContentContainer">
                    {/* all 3 open */}
                    {draftSessionsMain.length > 0 ? (
                        <>
                            <div style={{ width: "30%", height: "80vh" }}>
                                <CourseSearch
                                    scheduleID={schedule._id}
                                    clickValue={bottomMode}
                                />
                            </div>
                            <div style={{ width: "40%", height: "80vh" }}>
                                <CourseCalendar
                                    draftSessions={schedule.draftSessions}
                                />
                            </div>
                            <div style={{ width: "30%", height: "80vh" }}>
                                <NewClassSelector
                                    scheduleID={schedule._id}
                                    draftSessions={schedule.draftSessions}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ width: "40%", height: "80vh" }}>
                                <CourseSearch
                                    scheduleID={schedule._id}
                                    clickValue={bottomMode}
                                />
                            </div>
                            <div style={{ width: "60%", height: "80vh" }}>
                                <CourseCalendar
                                    draftSessions={schedule.draftSessions}
                                />
                            </div>
                            <div style={{ width: "0%", height: "80vh" }}>
                                <NewClassSelector
                                    scheduleID={schedule._id}
                                    draftSessions={schedule.draftSessions}
                                />
                            </div>
                        </>
                    )}
                </div>
                <Footer />
            </div>
        );
    };

    return (
        <div
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
                color: "var(--quaternary-bg-color)",
                // height: "100%",
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
