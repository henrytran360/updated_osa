import React, { Fragment, useState } from "react";
import Collapse from "@material-ui/core/Collapse";

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { gql, useMutation, useQuery, useApolloClient } from "@apollo/client";

import "./MinimizedDetail.global.css";

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        evalModalState @client
        evalModalStateDetail @client
    }
`;

/* Return a div for each row */
const formatDiv = (bold, normalTxt) => {
    return (
        <Fragment>
            <p className="sessionInfoText">
                <b>{bold}</b> {normalTxt}
            </p>
        </Fragment>
    );
};

/* Return a div for each row */
const formatDivLink = (bold, onClickFunc) => {
    return (
        <Fragment>
            <p className="sessionInfoText infoLink" onClick={onClickFunc}>
                <b>{bold}</b>
            </p>
        </Fragment>
    );
};

/* Replace undefined or null value to N/A */
const replaceNull = (text) => {
    switch (text) {
        case undefined:
            return "N/A";
        case "":
            return "N/A";
        case null:
            return "N/A";
        default:
            return text;
    }
};

const MinimizedDetail = ({
    course, //course is multiple sessions or used for instructorQuery
    session, //session is within course; used for courseQuery; for instructorQuery, session and course are the same
    instructorsToNames,
    open,
    classTimeString,
    style,
}) => {
    const [getOpen, setOpen] = useState(false);
    const client = useApolloClient();

    const Times = (section) => {
        if (!section.startTime || !section.endTime) {
            return "None";
        } else {
            return (
                <span>
                    {section.days}{" "}
                    {classTimeString(section.startTime, section.endTime)}
                </span>
            );
        }
    };
    const Instructors = (session) => {
        if (session.instructors) {
            return formatDiv(
                "Instructor:",
                replaceNull(instructorsToNames(session.instructors).join(", "))
            );
        }
    };
    const InstructionMethod = (session) => {
        if (session.instructionMethod) {
            return formatDiv(
                "Instructional Method:",
                replaceNull(session.instructionMethod)
            );
        }
    };
    const longTitle = (course) => {
        if (course.course) {
            return formatDiv("Long Title:", course.course.longTitle);
        } else {
            return formatDiv("Long Title:", course.longTitle);
        }
    };

    const toggleMoreInfo = () => setOpen(!getOpen);

    const showAdditionalInfo = () => {
        if (getOpen) {
            return (
                <Fragment>
                    {formatDiv("Lab Time:", Times(session.lab))}
                    {formatDiv("Course Type:", "Lecture/Laboratory")}
                    {formatDiv(
                        "Distribution Group:",
                        replaceNull(session.course.distribution)
                    )}
                    {formatDiv("CRN:", replaceNull(session.crn))}
                </Fragment>
            );
        } else {
            return null;
        }
    };
    const openEvaluations = () => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: {
                evalModalStateDetail: true,
            },
        });
    };
    return (
        <div className="minimizedMinimizedDetailContainer">
            {formatDiv("Class Time:", Times(session.class))}
            {Instructors(session)}
            {InstructionMethod(session)}
            {formatDivLink("See Evaluations", openEvaluations)}
            <Collapse in={getOpen} timeout={500} unmountOnExit>
                {showAdditionalInfo()}
            </Collapse>
            <IconButton
                className="sessionMoreInfo"
                aria-label="expand row"
                size="small"
                onClick={toggleMoreInfo}
            >
                {getOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
        </div>
    );
};

export default MinimizedDetail;
