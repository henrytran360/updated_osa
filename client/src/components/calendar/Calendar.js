import React, { useState, useEffect } from "react";
import moment from "moment";
import { CourseWeek } from "./CourseWeek";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import { colorCombos } from "./colors";
import Modal from "react-modal";
import { gql, useQuery } from "@apollo/client";
import { BsBoxArrowUpRight } from "react-icons/bs";

const localizer = momentLocalizer(moment);

let id = 1;
var hexId;

const dayCode2dayString = {
    M: "Monday",
    T: "Tuesday",
    W: "Wednesday",
    R: "Thursday",
    F: "Friday",
    S: "Saturday",
    U: "Sunday",
};

const courseToCourseLabel = (course) => {
    return course.subject + " " + course.courseNum;
};

const courseToTooltipLabel = (session) => {
    let tooltipString = courseToCourseLabel(session.course);

    // add course details
    tooltipString += "\n" + session.course.longTitle;
    tooltipString += "\nCRN: " + session.crn;
    tooltipString += "\nEnrollment: " + session.enrollment;
    tooltipString += "\nMax enrollment: " + session.maxEnrollment;

    tooltipString += "\nInstructor(s): ";
    // add all instructors
    for (let instructor of session.instructors) {
        tooltipString += instructor.firstName + " " + instructor.lastName;
    }

    return tooltipString;
};

const convertSectionToEvents = (section, session) => {
    let events = [];
    let uniqueEvents;
    if (!section || !section.startTime || !section.endTime) {
        return events;
    }
    // Get hexId of session
    let hexId = session.hexId;

    // Necessary for event title
    let courseLabel = courseToCourseLabel(session.course);

    // Create moment objects for the time
    let momentStart = moment(section.startTime, "HH:mm");
    let momentEnd = moment(section.endTime, "HH:mm");

    // create tooltip label
    let tooltipLabel = courseToTooltipLabel(session);

    // Create event for each day
    for (let dayCode of section.days) {
        // Convert the shorthand to a full weekday string
        let dayString = dayCode2dayString[dayCode];

        // Convert to a moment object
        let baseDay = moment(dayString, "dddd");

        let eventStart = baseDay
            .clone()
            .add(momentStart.hour(), "hours")
            .add(momentStart.minute(), "minutes");
        let eventEnd = baseDay
            .clone()
            .add(momentEnd.hour(), "hours")
            .add(momentEnd.minute(), "minutes");

        let instructors_str = "";
        if (session) {
            if (session.instructors.length > 0) {
                for (let i = 0; i < session.instructors.length - 1; i++) {
                    instructors_str +=
                        session.instructors[i].firstName +
                        " " +
                        session.instructors[i].lastName +
                        ", ";
                }
                instructors_str +=
                    session.instructors[session.instructors.length - 1]
                        .firstName +
                    " " +
                    session.instructors[session.instructors.length - 1]
                        .lastName;
            }
        }

        // let instructorName = "";
        // if (session.instructors[0]) {
        //     instructorName =
        //         session.instructors[0].firstName +
        //         " " +
        //         session.instructors[0].lastName;
        // }

        let coreqs_str = session.course.coreqs.join(" ");

        events.push({
            id: id++,
            title: courseLabel,
            desc: `${eventStart.format("hh:mm a")} - ${eventEnd.format(
                "hh:mm a"
            )}`,
            instructor: instructors_str,
            source: section,
            start: eventStart.toDate(),
            end: eventEnd.toDate(),
            hexId: hexId,
            tooltip: tooltipLabel,
            prereqs: session.course.prereqs,
            coreqs: coreqs_str,
            creditsMax: session.course.creditsMax,
            creditsMin: session.course.creditsMin,
            enrollment: session.enrollment,
            maxEnrollment: session.maxEnrollment,
            maxWaitlisted: session.maxWaitlisted,
            waitlisted: session.waitlisted,
            distribution: session.course.distribution,
        });
    }
    return events;
};

/**
 * Goal is to transform each session into weekly events, in the following format:
 * {
 *  id: Int! (Unique)
 *  title: String!
 *  start: Date & Time
 *  end: Date & Time
 * }
 */
const draftSessionsToEvents = (draftSessions) => {
    hexId = 0;
    // All our events will go in here
    let events = [];

    for (let draftSession of draftSessions) {
        // Check that session is visible. If not, don't show on calendar
        let courseNumId = draftSession.session.crn;
        if (draftSession.visible) {
            // Also add hexId to object for consistent color
            let session = {
                ...draftSession.session,
                hexId: hexId,
                courseNumId: courseNumId,
            };
            // First convert classes
            events = events.concat(
                convertSectionToEvents(session.class, session)
            );
            // Convert lab
            events = events.concat(
                convertSectionToEvents(session.lab, session)
            );
        }
        hexId++;
    }
    const uniqueArray = events.filter((value, index) => {
        return (
            index ===
            events.findIndex((obj) => {
                return (
                    obj.start.getTime() === value.start.getTime() &&
                    obj.title == value.title
                );
            })
        );
    });
    return uniqueArray;
};

const slotStyleGetter = (date) => {
    var style = {
        font: "Medium 23px/26px",
        letterSpacing: "0px",
        color: "var(--primary-color)",
        opacity: 1,
    };

    return {
        style: style,
    };
};

const dayStyleGetter = (date) => {
    var style = {
        textAlign: "center",
        font: "Medium 23px/26px",
        letterSpacing: "0px",
        color: "var(--search-background-focused)",
        opacity: 1,
        borderBottom: "1px solid #E4E8EE",
        textTransform: "uppercase",
    };

    return {
        style: style,
    };
};

const eventStyleGetter = (event) => {
    let moduloValue = event.hexId % colorCombos.length;

    var backgroundColor = colorCombos[moduloValue][0];
    var borderColor = colorCombos[moduloValue][1];

    var style = {
        // background:  0% 0% no-repeat padding-box;
        backgroundColor: backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: "10px",
        opacity: 1,
        color: "var(--quaternary-color)",
        display: "block",
    };

    return {
        style: style,
    };
};

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        evalModalState @client
        term @client
        recentUpdate @client
    }
`;

const CustomClassEvent = ({ event }) => {
    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    let { term, recentUpdate } = storeData;

    let moduloValue = event.hexId % colorCombos.length;

    var sidebarColor = colorCombos[moduloValue][1];
    /* Removing AM from the start time of a class and also removing 
    an extra 0 if hour is a single digit */
    let classTimeStart = event.desc.substr(0, 5);
    let classTimeEnd = event.desc.substr(11);
    if (classTimeStart.charAt(0) == "0") {
        classTimeStart = classTimeStart.substr(1);
    }
    if (classTimeEnd.charAt(0) == "0") {
        classTimeEnd = classTimeEnd.substr(1);
    }
    let classTime = classTimeStart + " - " + classTimeEnd;

    const [modalState, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };

    //getting course info for the popup (expanded detail for each course)
    const info = event.tooltip.split("\n");
    const longTitle = info[1];
    const CRN = info[2].split(": ")[1];
    // const maxEnroll = info[4].split(": ")[1];
    const source = event.source.days;
    // const days = source.map((day) => dayCode2dayString[day] + " ");
    return (
        <div className="courseEventWrapper">
            <Modal
                isOpen={modalState}
                className="model-info-content"
                onRequestClose={closeModal}
            >
                <div className="course-info-content">
                    <div className="course-title">
                        {event.title}: {longTitle}
                        <a
                            style={{ marginLeft: "1rem" }}
                            href={
                                "https://courses.rice.edu/courses/!SWKSCAT.cat?p_action=COURSE&p_term=" +
                                term +
                                "&p_crn=" +
                                CRN
                            }
                            target="_blank"
                        >
                            {" "}
                            <BsBoxArrowUpRight />
                        </a>
                    </div>
                    <div className="float-container">
                        <div className="float-child">
                            <div className="category">
                                {" "}
                                {source} {event.desc}{" "}
                            </div>
                            <div className="category">CRN: {CRN} </div>
                            <div className="category">
                                Credits: {event.creditsMin}{" "}
                            </div>
                            <div className="category">
                                Distribution: {event.distribution}
                            </div>
                            <div className="category">
                                Prerequisites: {event.prereqs}
                            </div>
                            <div className="category">
                                Corequisites: {event.coreqs}
                            </div>
                        </div>
                        <div className="float-child">
                            <div className="category">
                                Max Enrollment: {event.maxEnrollment}
                            </div>
                            <div className="category">
                                Current Enrollment: {event.enrollment}
                            </div>
                            <div className="category">
                                Max Waitlisted: {event.maxWaitlisted}
                            </div>
                            <div className="category">
                                Waitlisted: {event.waitlisted}
                            </div>
                        </div>
                    </div>
                    <div className="course-instructor">
                        Course Instructor: {event.instructor}{" "}
                    </div>
                </div>
            </Modal>
            <hr
                style={{ backgroundColor: `${sidebarColor}` }}
                className="courseEventBar"
            />
            <div className="courseEvent" onClick={openModal}>
                <p id="courseCode">{event.title}</p>
                <p id="courseTime">{classTime}</p>
                <p id="courseInstructor">{event.instructor}</p>
            </div>
        </div>
    );
};

const CourseCalendar = ({ draftSessions }) => {
    return (
        <div className="courseCalendar">
            <Calendar
                components={{ event: CustomClassEvent }}
                events={draftSessionsToEvents(draftSessions)}
                step={30}
                timeslots={2}
                localizer={localizer}
                defaultView={Views.WEEK}
                // Calendar columns show "MON", "TUES", ... and the time format is in 12 hours with only the hours displayed
                formats={{ dayFormat: "ddd", timeGutterFormat: "ha" }}
                views={{ month: false, week: CourseWeek, day: false }}
                drilldownView={null}
                defaultDate={moment("Sunday", "ddd")} // Always start on Sunday of the week
                eventPropGetter={eventStyleGetter}
                dayPropGetter={dayStyleGetter}
                slotPropGetter={slotStyleGetter}
                showMultiDayTimes={true} // disable all day row
                toolbar={false}
                style={style}
                tooltipAccessor={"tooltip"}
            />
        </div>
    );
};

const style = {
    height: "100%",
};

export default CourseCalendar;
