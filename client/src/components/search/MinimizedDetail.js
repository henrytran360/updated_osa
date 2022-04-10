import React, { Fragment, useEffect, useState } from "react";
import Collapse from "@material-ui/core/Collapse";

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { gql, useMutation, useQuery, useApolloClient } from "@apollo/client";
import Modal from "react-modal";

import "./MinimizedDetail.global.css";
import CourseEvalModal from "../draftview/CourseEvalModal";

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        evalModalState @client
        evalModalStateDetail @client
    }
`;

const GET_EVALUATION_CHART_BY_COURSE = gql`
    query getEvaluationChartByCourse($course: String!) {
        getEvaluationChartByCourse(course: $course) {
            courseName
            term
            enrolled_amount
            organization {
                class_mean
                responses
                score_1
                score_2
                score_3
                score_4
                score_5
            }
            assignments {
                class_mean
                responses
                score_1
                score_2
                score_3
                score_4
                score_5
            }
            overall {
                class_mean
                responses
                score_1
                score_2
                score_3
                score_4
                score_5
            }
            challenge {
                class_mean
                responses
                score_1
                score_2
                score_3
                score_4
                score_5
            }
            workload {
                class_mean
                responses
                score_1
                score_2
                score_3
                score_4
                score_5
            }
            why_taking {
                class_mean
                responses
                score_1
                score_2
                score_3
                score_4
                score_5
            }
            expected_grade {
                class_mean
                responses
                score_1
                score_2
                score_3
                score_4
                score_5
            }
            expected_pf {
                class_mean
                responses
                score_1
                score_2
                score_3
                score_4
                score_5
            }
            comments {
                text
                time
            }
        }
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
    const [modalState, setModal] = useState(false);
    const [firstInstructor, setFirstInstructor] = useState({});

    const openModal = () => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: {
                evalModalState: true,
            },
        });
        setModal(true);
    };
    const closeModal = () => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: {
                evalModalState: false,
                evalModalStateDetail: false,
            },
        });
        setModal(false);
    };

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
    useEffect(() => {
        if (session && session.instructors) {
            setFirstInstructor(session.instructors[0]);
        }
    }, [session]);

    return (
        <div className="minimizedMinimizedDetailContainer">
            {formatDiv("Class Time:", Times(session.class))}
            {Instructors(session)}
            {InstructionMethod(session)}
            {formatDivLink("See Evaluations", openModal)}
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
            <Modal
                isOpen={modalState}
                className="evaluation-modal"
                // ariaHideApp={false}
                onRequestClose={closeModal}
            >
                <CourseEvalModal
                    query={GET_EVALUATION_CHART_BY_COURSE}
                    courseSubject={course.subject}
                    courseNum={course.courseNum}
                    courseTitle={course.longTitle}
                    courseProf={firstInstructor}
                    closeModal={closeModal}
                />
            </Modal>
        </div>
    );
};

export default MinimizedDetail;
