import React, { Fragment, useEffect, useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
// Course evals
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import Modal from "react-modal";
import CourseEvalModal from "./CourseEvalModal";
// Course visible
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
// Delete course
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

// Tracking
import ReactGA from "react-ga";
import { classTimeString } from "../../utils/CourseTimeTransforms";
import URLTypes from "../../constants/URLTypes";
import { gql, useMutation, useQuery } from "@apollo/client";
import { TableBody, withStyles } from "@material-ui/core";
import CourseDetail from "./CourseDetail";
import Detail from "../search/Detail";
import { graphqlSync } from "graphql";
import { selectionSetMatchesResult } from "@apollo/client/cache/inmemory/helpers";

const detailStyle = {
    background: "#F6F8FC",
    color: "#6C7488",
};

// Styled rows
const StyledTableBody = withStyles((theme) => ({
    root: {
        backgroundColor: "#F7FAFC",
        borderRadius: "15px",
        borderBottom: "none",
        opacity: 1,
        height: "50px",
    },
}))(TableBody);

const StyledTableRow = withStyles((theme) => ({
    root: {
        backgroundColor: "#F7FAFC",
        borderRadius: "15px",
        opacity: 1,
        borderBottom: "none",
        height: "25px",
    },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
    root: {
        color: "#E35F49",
        backgroundColor: "#F7FAFC",
        borderBottom: "none",
        borderSpacing: "0 1em",
    },
}))(TableCell);

const createURL = (termcode, crn, type = URLTypes.DETAIL) => {
    switch (type) {
        case URLTypes.DETAIL:
            return `https://courses.rice.edu/courses/!SWKSCAT.cat?p_action=COURSE&p_term=${termcode}&p_crn=${crn}`;
        case URLTypes.EVAL:
            return `https://esther.rice.edu/selfserve/swkscmt.main?p_term=${
                termcode - 100
            }&p_crn=${crn}&p_commentid=&p_confirm=1&p_type=Course`;
        default:
            console.log(`Uknown URL type: ${type}`);
            return "https://rice.edu/";
    }
};

const createInstructorURL = (termcode, webID) => {
    return `https://esther.rice.edu/selfserve/swkscmt.main?p_term=${
        termcode - 100
    }&p_instr=${webID}&p_commentid=&p_confirm=1&p_type=Instructor`;
};

/**
 * If creditsMax is present (i.e. there is a range of possible credits) then display the range. Otherwise, just display the minimum number of credits.
 */
const creditsDisplay = (creditsMin, creditsMax) => {
    if (creditsMax == null) {
        // Only display credit min
        return <p>{creditsMin}</p>;
    } else {
        return (
            <p>
                {creditsMin} - {creditsMax}
            </p>
        );
    }
};

/**
 * TODO: MOVE THIS TO utils.js
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

const instructorToName = (instructor) => {
    return instructor.firstName + " " + instructor.lastName;
};

const getPreviousCourseCRN = (course, prevTermCourses) => {
    const filtered = prevTermCourses.filter((prevCourse) => {
        return (
            course.subject == prevCourse.SUBJ &&
            course.courseNum == prevCourse.NUMB
        );
    });
    if (filtered.length > 0) {
        return filtered[0].CRN;
    }
    return null;
};

/**
 * GraphQL Mutations
 */

/**
 * Toggles the visibility setting for this draft session
 */
const TOGGLE_DRAFT_SESSION_VISIBILITY = gql`
    mutation ToggleCourse($scheduleID: ID!, $sessionID: ID!) {
        scheduleToggleSession(scheduleID: $scheduleID, sessionID: $sessionID) {
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

/**
 * Removes the draft session from the schedule
 */
const REMOVE_DRAFT_SESSION = gql`
    mutation RemoveDraftSession($scheduleID: ID!, $sessionID: ID!) {
        scheduleRemoveSession(scheduleID: $scheduleID, sessionID: $sessionID) {
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

/**
 * GraphQL Queries
 */

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

const DraftCourseItem = ({
    scheduleID,
    visible,
    session,
    course,
    prevTermCourses,
    instructorsList,
    getEvaluationByCourse,
    idx,
}) => {
    const emptyCellGenerator = (count) => {
        let cells = [];
        for (let i = 0; i < count; i++) {
            //added key here
            cells.push(<p key={i}></p>);
        }
        return cells;
    };

    const createSectionTimeCells = (section) => {
        if (!section.startTime || !section.endTime) {
            return <Fragment>{emptyCellGenerator(1)}</Fragment>;
        } else {
            return (
                <p>
                    {section.days}{" "}
                    {classTimeString(section.startTime, section.endTime)}
                </p>
            );
        }
    };

    // Get the current term
    const {
        data: { term },
    } = useQuery(GET_LOCAL_DATA);

    let [toggleVisibility] = useMutation(TOGGLE_DRAFT_SESSION_VISIBILITY, {
        variables: { scheduleID: scheduleID, sessionID: session._id },
    });

    let [removeDraftSession] = useMutation(REMOVE_DRAFT_SESSION, {
        variables: { scheduleID: scheduleID, sessionID: session._id },
    });

    /**
     * Get the webId of the instructor
     */
    const webIds = (instructor) => {
        if (instructorsList) {
            let filteredInstructor = instructorsList.instructorList.filter(
                (inst) =>
                    inst.firstName === instructor.firstName &&
                    inst.lastName === instructor.lastName
            );
            if (filteredInstructor.length !== 0) {
                return filteredInstructor[0].webId;
            }
        }
        // If instructor not in current instructor list, return a random webId
        return null;
    };

    /**
     * Toggle function for toggling the collapsible display of prerequisites and corequisites
     */
    const [open, setOpen] = useState(false);

    const [getPrevTermCRN, setPrevTermCRN] = useState(null);

    useEffect(() => {
        if (prevTermCourses) {
            setPrevTermCRN(getPreviousCourseCRN(course, prevTermCourses));
        }
    }, [prevTermCourses]);

    /**
     * Create a tooltip or the name of each instructor
     */
    const instructorsToTooltips = (instructors) => {
        return instructors.map((instructor, index) => {
            let webId = webIds(instructor, index);
            return (
                <React.Fragment>
                    {webId ? (
                        <Tooltip
                            title="View Instructor Evaluation"
                            key={`${webId}-${index}`}
                        >
                            <a
                                style={{
                                    textDecoration: "none",
                                }}
                                href={createInstructorURL(term, webId)}
                                target="_blank"
                            >
                                {instructorToName(instructor)}
                            </a>
                        </Tooltip>
                    ) : (
                        instructorToName(instructor)
                    )}
                </React.Fragment>
            );
        });
    };

    const togglePrereq = () => setOpen(!open);

    const boolVisible = visible ? true : false;

    const instructorTooltips = instructorsToTooltips(session.instructors);

    // function ToggleEvals() {
    //     let subtitle;
    //     const [modalIsOpen, setIsOpen] = React.useState(false);

    //     function openModal() {
    //       setIsOpen(true);
    //     }

    //     function afterOpenModal() {
    //       // references are now sync'd and can be accessed.
    //       subtitle.style.color = '#f00';
    //     }

    //     function closeModal() {
    //       setIsOpen(false);
    //     }
    // }

    //for the course info modal
    const [modalState, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };

    // const {loadingEval, errorEval, dataEval} = useQuery(GET_EVALUATION_BY_COURSE, {

    // });
    //console.log(dataEval);

    const { data: dataEval } = useQuery(getEvaluationByCourse, {
        variables: { course: "COMP 140" },
    });
    console.log(dataEval.getEvaluationChartByCourse);

    const toggleEvals = (dataEval) => {
        setModal(!modalState);
    };

    return (
        <div className={`tableRow ${boolVisible ? "selected" : ""}`}>
            {/* <Checkbox
                checked={boolVisible}
                onClick={() => toggleVisibility()}
            /> */}
            <IconButton
                className="visibilityOn"
                disableFocusRipple
                disableRipple
                style={{ backgroundColor: "transparent" }}
                onClick={() => toggleVisibility()}
            >
                {boolVisible ? (
                    <VisibilityIcon className="visibilityOn" />
                ) : (
                    <VisibilityOffIcon className="visibilityOff" />
                )}
            </IconButton>
            <div>
                <Tooltip title="View Course Details">
                    <a
                        style={{ textDecoration: "none" }}
                        href={createURL(
                            String(term),
                            session.crn,
                            URLTypes.DETAIL
                        )}
                        target="_blank"
                    >
                        {course.subject} {course.courseNum}
                    </a>
                </Tooltip>
                <Tooltip title="View Evaluations">
                    {/* <ReactGA.OutboundLink
                        eventLabel="course_evaluation"
                        to={createURL(
                            String(term),
                            getPrevTermCRN,
                            URLTypes.EVAL
                        )}
                        target="_blank"
                    >
                        <IconButton aria-label="evaluations">
                            <QuestionAnswerIcon />
                        </IconButton>
                    </ReactGA.OutboundLink> */}
                    <IconButton
                        aria-label="evaluations"
                        // onClick={ () => setModal(true) }
                        onClick={() => toggleEvals(dataEval)}
                    >
                        <QuestionAnswerIcon />
                        <CourseEvalModal
                            modalState={modalState}
                            closeModal={closeModal}
                        />
                    </IconButton>

                    {/* <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                        Course Eval Modal
                    </Modal> */}
                </Tooltip>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={togglePrereq}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </div>
            <p>{session.crn}</p>
            {creditsDisplay(course.creditsMin, course.creditsMax)}
            <p>{course.distribution}</p>
            {createSectionTimeCells(session.class)}
            {createSectionTimeCells(session.lab)}
            <p>
                {instructorTooltips.length != 0
                    ? instructorTooltips.reduce((acc, newInstructor) => (
                          <React.Fragment>
                              {acc}, {newInstructor}
                          </React.Fragment>
                      ))
                    : null}
            </p>
            <p>
                <Tooltip className="iconButton" title="Delete">
                    <IconButton
                        aria-label="delete"
                        onClick={() => removeDraftSession()}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </p>
            <Detail
                style={detailStyle}
                key={idx}
                course={course}
                session={session}
                instructorsToNames={instructorsToNames}
                open={open}
                classTimeString={classTimeString}
            />
        </div>
    );

    return (
        <StyledTableBody>
            <StyledTableRow key={session.crn}>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                        checked={boolVisible}
                        onClick={() => toggleVisibility()}
                    />
                </StyledTableCell>
                <StyledTableCell align="right" component="th" scope="row">
                    <Tooltip title="View Course Details">
                        <a
                            style={{ color: "#E35F49", textDecoration: "none" }}
                            href={createURL(
                                "202110",
                                session.crn,
                                URLTypes.DETAIL
                            )}
                            target="_blank"
                        >
                            {course.longTitle}
                        </a>
                    </Tooltip>
                    <Tooltip title="View Evaluations">
                        <ReactGA.OutboundLink
                            eventLabel="course_evaluation"
                            to={createURL("202110", session.crn, URLTypes.EVAL)}
                            target="_blank"
                        >
                            <IconButton aria-label="evaluations">
                                <QuestionAnswerIcon />
                            </IconButton>
                        </ReactGA.OutboundLink>
                    </Tooltip>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={togglePrereq}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell align="right">{session.crn}</StyledTableCell>
                <StyledTableCell align="right">
                    {creditsDisplay(course.creditsMin, course.creditsMax)}
                </StyledTableCell>
                <StyledTableCell align="right">
                    {course.distribution}
                </StyledTableCell>
                {createSectionTimeCells(session.class)}
                {createSectionTimeCells(session.lab)}
                <StyledTableCell align="right">
                    {session.instructors.map((instructor, index) => {
                        let webId = webIds(instructor, index);
                        return (
                            <Tooltip
                                title="View Instructor Evaluation"
                                key={`${webId}-${index}`}
                            >
                                <ReactGA.OutboundLink
                                    style={{
                                        color: "#272D2D",
                                        textDecoration: "none",
                                    }}
                                    eventLabel="instructor_evaluation"
                                    to={createInstructorURL("202110", webId)}
                                    target="_blank"
                                >
                                    <span style={{ color: "272D2D" }}>
                                        {instructorToName(instructor)}
                                    </span>
                                </ReactGA.OutboundLink>
                            </Tooltip>
                        );
                    })}
                    {/* {instructorsToNames(session.instructors).join(", ")} */}
                </StyledTableCell>
                <StyledTableCell align="right">
                    <Tooltip title="Delete">
                        <IconButton
                            aria-label="delete"
                            onClick={() => removeDraftSession()}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </StyledTableCell>
            </StyledTableRow>
            {/* <CourseDetail
                key={idx}
                course={course}
                session={session}
                instructorsToNames={instructorsToNames}
                open={open}
                classTimeString={classTimeString}
            /> */}
            {/* <Detail
                style={detailStyle}
                key={idx}
                course={course}
                session={session}
                instructorsToNames={instructorsToNames}
                open={open}
                classTimeString={classTimeString}
            /> */}
        </StyledTableBody>
    );
};

export default DraftCourseItem;
