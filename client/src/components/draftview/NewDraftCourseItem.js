import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./NewDraftCourseItem.css";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { classTimeString } from "../../utils/CourseTimeTransforms";
import { gql, useMutation, useQuery } from "@apollo/client";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CourseEvalModal from "./CourseEvalModal";

const colorCombos = [
    ["#F2F9FF", "#00A2F2"], // blue
    ["#FFFFF2", "#E8B134"], // yellow
    ["#FFFCFB", "#EC3F63"], // orange
    ["#FDFFFE", "#1EBFC2"], // light green
    ["#FFFFFF", "#000000FF"], // white / black
];

// const colorCombos = [
//     ["#F2F9FF", "#1E85E880"], // light blue
//     ["#FFFFF2", "#F5D581B3"], // light yellow
//     ["#FFFCFB", "#E35F4980"], // light orange
//     ["#FDFFFE", "#76C5AFBF"], // light green
//     ["#FFFFFF", "#000000FF"], // white / black
// ];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

const GET_EVALUATION_CHART_BY_COURSE = gql
`query getEvaluationChartByCourse($course: String!){
    getEvaluationChartByCourse(course: $course){
    	courseName
        instructor
        term
    	expected_pf{
        score_1
        score_2
        score_3
        score_4
        score_5
      }
    	expected_grade{
        score_1
        score_2
        score_3
        score_4
        score_5
      }
    	comments{
        text
        time
      }
    	term
    	enrolled_amount
    
  }
}`

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


const NewDraftCourseItem = (props) => {


    const [firstInstructor, setFirstInstructor] = useState({});
    let moduloValue = props.index % colorCombos.length;
    var backgroundColor = colorCombos[moduloValue][0];
    var borderColor = colorCombos[moduloValue][1];

    let [toggleVisibility] = useMutation(TOGGLE_DRAFT_SESSION_VISIBILITY, {
        variables: {
            scheduleID: props.scheduleID,
            sessionID: props.session._id,
        },
    });

    useEffect(() => {
        if (props.session && props.session.instructors) {
            setFirstInstructor(props.session.instructors[0]);
        }
    }, [props.session]);

    let [removeDraftSession] = useMutation(REMOVE_DRAFT_SESSION, {
        variables: {
            scheduleID: props.scheduleID,
            sessionID: props.session._id,
        },
    });

    const boolVisible = props.visible ? true : false;

    const [modalState, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };

    console.log(props.session.course.subject);

    return (
        <div
            className={`draft-course-item-container ${
                boolVisible ? "" : "selected2"
            }`}
        >
            <div className="draft-course-top">
                <div
                    style={{
                        width: "72%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >
                    <span
                        style={{
                            color: borderColor,
                            textDecoration: "underline",
                        }}
                    >
                        {props.session.course.subject}{" "}
                        {props.session.course.courseNum}:{" "}
                        {props.session.course.longTitle}
                    </span>
                </div>
                <div
                    style={{
                        width: "28%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Modal
                        isOpen={modalState}
                        className="evaluation-modal"
                        ariaHideApp={false}
                        onRequestClose={closeModal}
                    >
                        <CourseEvalModal    
                            query={GET_EVALUATION_CHART_BY_COURSE}
                            courseSubject = {props.session.course.subject}
                            courseNum = {props.session.course.courseNum}
                            courseTitle = {props.session.course.longTitle}
                        />
                    </Modal>
                    <Tooltip className="iconButton" title="Evaluations">
                        <IconButton
                            disableFocusRipple
                            disableRipple
                            size="small"
                            style={{ backgroundColor: "transparent" }}
                            onClick={openModal}
                        >
                            <ListAltIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip className="iconButton" title="Hide">
                        <IconButton
                            className="visibilityOn"
                            disableFocusRipple
                            disableRipple
                            size="small"
                            style={{ backgroundColor: "transparent" }}
                            onClick={() => toggleVisibility()}
                        >
                            {boolVisible ? (
                                <VisibilityIcon className="visibilityOn" />
                            ) : (
                                <VisibilityOffIcon className="visibilityOff" />
                            )}
                        </IconButton>
                    </Tooltip>
                    <Tooltip className="iconButton" title="Delete">
                        <IconButton
                            aria-label="delete"
                            size="small"
                            disableFocusRipple
                            disableRipple
                            onClick={() => removeDraftSession()}
                        >
                            <RemoveCircleOutlineIcon color="warning" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className="draft-course-bottom">
                <span
                    style={{
                        color: "898E91",
                        fontSize: 12,
                    }}
                >
                    {props.session.class.startTime
                        ? classTimeString(
                              props.session.class.startTime,
                              props.session.class.endTime
                          )
                        : "No time available"}{" "}
                    |{" "}
                    {firstInstructor
                        ? firstInstructor &&
                          firstInstructor.firstName +
                              " " +
                              firstInstructor.lastName
                        : "No Instructors"}{" "}
                    | CRN: {props.session.crn}
                </span>
            </div>
        </div>
    );
};

export default NewDraftCourseItem;
