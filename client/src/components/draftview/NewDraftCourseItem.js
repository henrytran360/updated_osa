import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./NewDraftCourseItem.css";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { classTimeString } from "../../utils/CourseTimeTransforms";
import { gql, useMutation, useQuery, useApolloClient } from "@apollo/client";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import BarChartIcon from '@mui/icons-material/BarChart';
import CourseEvalModal from "./CourseEvalModal";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import { colorCombos } from "../calendar/colors";
import CourseDetailModal from "../draftview/CourseDetailModal.js";
import CloseIcon from "@mui/icons-material/Close";
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

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        evalModalState @client
        term @client
        recentUpdate @client
        eachCourseModalState @client
        evalModalStateDetail @client
    }
`;

const NewDraftCourseItem = (props) => {
    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    let {
        term,
        recentUpdate,
        evalModalState,
        eachCourseModalState,
        evalModalStateDetail,
    } = storeData;

    const client = useApolloClient();

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

    //Getting course info for the popup (expanded detail for each course)
    const title =
        props.session.course.subject +
        " " +
        props.session.course.courseNum +
        ": " +
        props.session.course.longTitle;
    const start_time =
        props.session.class.startTime?.substring(0, 2) +
        ":" +
        props.session.class.startTime?.substring(2, 4);
    const end_time =
        props.session.class.endTime?.substring(0, 2) +
        ":" +
        props.session.class.endTime?.substring(2, 4);
    const time =
        props.session.class.days.join("") + " " + start_time + " - " + end_time;
    let instructors_str = "";
    if (props.session) {
        if (props.session.instructors.length > 0) {
            for (let i = 0; i < props.session.instructors.length - 1; i++) {
                instructors_str +=
                    props.session.instructors[i].firstName +
                    " " +
                    props.session.instructors[i].lastName +
                    ", ";
            }
            instructors_str +=
                props.session.instructors[props.session.instructors.length - 1]
                    .firstName +
                " " +
                props.session.instructors[props.session.instructors.length - 1]
                    .lastName;
        }
    }
    let coreqs_str = "";
    for (let j = 0; j < props.session.course.coreqs.length; j++) {
        coreqs_str += props.session.course.coreqs[j] + "\n";
    }

    //open course evaluation modal
    const [modalState, setModal] = useState(false);

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

    const [modalState2, setModal2] = useState(false);

    const openModal2 = () => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: {
                eachCourseModalState: true,
            },
        });
        setModal2(true);
    };
    const closeModal2 = () => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: {
                eachCourseModalState: false,
            },
        });
        setModal2(false);
    };

    return (
        <div
            className={`draft-course-item-container ${
                boolVisible ? "" : "selected2"
            }`}
            style={{ boxShadow: "var(--shadow-color) 0 1.95px 0" }}
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
                            fontSize: 14,
                        }}
                        onClick={openModal2}
                    >
                        {props.session.course.subject}{" "}
                        {props.session.course.courseNum}:{" "}
                        {props.session.course.longTitle}
                    </span>
                </div>
                <Modal
                    isOpen={modalState2}
                    className="model-info-content"
                    onRequestClose={closeModal2}
                >
                    <CourseDetailModal
                        title={title}
                        crn={props.session.crn}
                        time={time}
                        creditsMin={props.session.creditsMin}
                        distribution={props.session.course.distribution}
                        prereqs={props.session.course.prereqs}
                        coreqs={coreqs_str}
                        maxEnrollment={props.session.maxEnrollment}
                        enrollment={props.session.enrollment}
                        maxWaitlisted={props.session.maxWaitlisted}
                        waitlisted={props.session.waitlisted}
                        instructors={instructors_str}
                        term={term}
                    />
                    <div className="closeModalButton">
                        <Tooltip className="iconButton" title="Close">
                            <IconButton
                                aria-label="delete"
                                size="small"
                                disableFocusRipple
                                disableRipple
                                onClick={() => closeModal2()}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Modal>
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
                        isOpen={modalState | evalModalStateDetail}
                        className="evaluation-modal"
                        // ariaHideApp={false}
                        onRequestClose={closeModal}
                    >
                        <CourseEvalModal
                            query={GET_EVALUATION_CHART_BY_COURSE}
                            courseSubject={props.session.course.subject}
                            courseNum={props.session.course.courseNum}
                            courseTitle={props.session.course.longTitle}
                            courseProf={firstInstructor}
                            closeModal={closeModal}
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
                            <BarChartIcon />
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
                            <DeleteIcon color="warning" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className="draft-course-bottom">
                <span
                    style={{
                        color: "var(--tertiary-color)",
                        fontSize: 14,
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
                </span>
            </div>
        </div>
    );
};

export default NewDraftCourseItem;
