import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import SemesterBox from "../degree/SemesterBox";
import "./CourseEval.css";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import { IoCloseOutline } from "react-icons/io5";
import { ImWarning } from "react-icons/im";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { AiOutlineWarning } from "react-icons/ai";

import Chart, {
    ArgumentAxis,
    ValueAxis,
    Series,
    Legend,
    Size,
    Title,
    Font,
    Label,
    Annotation,
    CommonAnnotationSettings,
    Border,
    Shadow,
} from "devextreme-react/chart";

const CourseEvalModal = (props) => {
    const exitStyle = {
        float: "right",
        backgroundColor: "transparent",
        margin: "1rem",
    };
    const exitStyleHover = {
        float: "right",
        backgroundColor: "#eeeeee",
        borderRadius:"4px",
        margin: "1rem",
    };
    const[exitHover, setExitHover] = useState(false);

    const client = useApolloClient();

    const thisCourse = props.courseSubject + " " + props.courseNum;

    const {
        loading: evalLoading,
        error: evalError,
        data: evalData,
    } = useQuery(props.query, {
        variables: { course: thisCourse },
    });

    useEffect(() => {
        if (evalData) {
            setEvalDataState(evalData.getEvaluationChartByCourse[0]);
        }
    }, [evalLoading, evalError, evalData]);

    const [evalDataState, setEvalDataState] = useState([]);

    const [responseState, setResponseState] = useState(true);

    const openComments = () => {
        setResponseState(false);
    };
    const openResponse = () => {
        setResponseState(true);
    };

    const GET_LOCAL_DATA = gql`
        query GetLocalData {
            warningState @client
        }
    `;

    const { data: localQueryData } = useQuery(GET_LOCAL_DATA);

    let { warningState } = localQueryData;

    const closeWarning = () => {
      client.writeQuery({
        query: GET_LOCAL_DATA,
        data: { warningState: false },
      });
      warningState = false;
    };

    //Data for class comments
    const [comments, setComments] = useState([]);

    //Data for term
    const [term, setTerm] = useState("");

    const [compiledEvalData, setCompiledEvalData] = useState([
        {
            "data": [], 
            "mean": 0,
            "responses": 0, 
            "title": "Title"
        }, 
        {
            "data": [], 
            "mean": 0,
            "responses": 0, 
            "title": "Title"
        },
        {
            "data": [], 
            "mean": 0,
            "responses": 0, 
            "title": "Title"
        },
        {
            "data": [], 
            "mean": 0,
            "responses": 0, 
            "title": "Title"
        },
        {
            "data": [], 
            "mean": 0,
            "responses": 0, 
            "title": "Title"
        },
        {
            "data": [], 
            "mean": 0,
            "responses": 0, 
            "title": "Title"
        },
        {
            "data": [], 
            "mean": 0,
            "responses": 0, 
            "title": "Title"
        },
        {
            "data": [], 
            "mean": 0,
            "responses": 0, 
            "title": "Title"
        }
    ]);

    useEffect(() => {
        if (evalDataState) {
            let allEvalData = [];
            //Get term
            let curTerm = evalDataState.term;
            let term = curTerm ? curTerm : "";
            setTerm(term);

            //Get expected grade data
            let curExpectedGrade = evalDataState.expected_grade;
            let expectedGradeMeanT = curExpectedGrade
                ? parseFloat(curExpectedGrade.class_mean)
                : 0;
            let expectedGradeResT = curExpectedGrade
                ? parseFloat(curExpectedGrade.responses)
                : 0;
            let expectedGradeArr = [
                {
                    argument: "A",
                    value: curExpectedGrade
                        ? parseInt(curExpectedGrade.score_1)
                        : 0,
                },
                {
                    argument: "B",
                    value: curExpectedGrade
                        ? parseInt(curExpectedGrade.score_2)
                        : 0,
                },
                {
                    argument: "C",
                    value: curExpectedGrade
                        ? parseInt(curExpectedGrade.score_3)
                        : 0,
                },
                {
                    argument: "D",
                    value: curExpectedGrade
                        ? parseInt(curExpectedGrade.score_4)
                        : 0,
                },
                {
                    argument: "F",
                    value: curExpectedGrade
                        ? parseInt(curExpectedGrade.score_5)
                        : 0,
                },
            ];

            allEvalData.push({
                "data": expectedGradeArr, 
                "mean": expectedGradeMeanT,
                "responses": expectedGradeResT, 
                "title": "Expected Grade (Letter)"
            });

            // get expected grade p/f
            let curExpectedGradePF = evalDataState.expected_pf;
            let expectedGradePFMeanT = curExpectedGradePF
                ? parseFloat(curExpectedGradePF.class_mean)
                : 0;
            let expectedGradePFResT = curExpectedGradePF
                ? parseFloat(curExpectedGradePF.responses)
                : 0;
            let expectedGradePFArr = [
                {
                    argument: "P",
                    value: curExpectedGradePF
                        ? parseInt(curExpectedGradePF.score_1)
                        : 0,
                },
                {
                    argument: "F",
                    value: curExpectedGradePF
                        ? parseInt(curExpectedGradePF.score_2)
                        : 0,
                },
                {
                    argument: "S",
                    value: curExpectedGradePF
                        ? parseInt(curExpectedGradePF.score_3)
                        : 0,
                },
                {
                    argument: "U",
                    value: curExpectedGradePF
                        ? parseInt(curExpectedGradePF.score_4)
                        : 0,
                },
                {
                    argument: "N/A",
                    value: curExpectedGradePF
                        ? parseInt(curExpectedGradePF.score_5)
                        : 0,
                },
            ];

            allEvalData.push({
                "data": expectedGradePFArr, 
                "mean": expectedGradePFMeanT,
                "responses": expectedGradePFResT, 
                "title": "Expected Grade (P/F)"
            });

            //Get class organization data
            let curOrganization = evalDataState.organization;
            let organizationMeanT = curOrganization
                ? parseFloat(curOrganization.class_mean)
                : 0;
            let organizationResT = curOrganization
                ? parseFloat(curOrganization.responses)
                : 0;
            let organizationArr = [
                {
                    argument: "Outstanding",
                    value: curOrganization
                        ? parseInt(curOrganization.score_1)
                        : 0,
                },
                {
                    argument: "Good",
                    value: curOrganization
                        ? parseInt(curOrganization.score_2)
                        : 0,
                },
                {
                    argument: "Average",
                    value: curOrganization
                        ? parseInt(curOrganization.score_3)
                        : 0,
                },
                {
                    argument: "Fair",
                    value: curOrganization
                        ? parseInt(curOrganization.score_4)
                        : 0,
                },
                {
                    argument: "Poor",
                    value: curOrganization
                        ? parseInt(curOrganization.score_5)
                        : 0,
                },
            ];

            allEvalData.push({
                "data": organizationArr, 
                "mean": organizationMeanT,
                "responses": organizationResT, 
                "title": "Organization: The organization of this course was:"
            });

            //Get class assignments data
            let curAssignments = evalDataState.assignments;
            let assignmentsMeanT = curAssignments
                ? parseFloat(curAssignments.class_mean)
                : 0;
            let assignmentsResT = curAssignments
                ? parseFloat(curAssignments.responses)
                : 0;
            let assignmentsArr = [
                {
                    argument: "Outstanding",
                    value: curAssignments
                        ? parseInt(curAssignments.score_1)
                        : 0,
                },
                {
                    argument: "Good",
                    value: curAssignments
                        ? parseInt(curAssignments.score_2)
                        : 0,
                },
                {
                    argument: "Average",
                    value: curAssignments
                        ? parseInt(curAssignments.score_3)
                        : 0,
                },
                {
                    argument: "Fair",
                    value: curAssignments
                        ? parseInt(curAssignments.score_4)
                        : 0,
                },
                {
                    argument: "Poor",
                    value: curAssignments
                        ? parseInt(curAssignments.score_5)
                        : 0,
                },
            ];

            allEvalData.push({
                "data": assignmentsArr, 
                "mean": assignmentsMeanT,
                "responses": assignmentsResT, 
                "title": "Assignments: The ontribution that the coursework made to the course was:"
            });

            //Get class quality data
            let curQuality = evalDataState.overall;
            let qualityMeanT = curQuality
                ? parseFloat(curQuality.class_mean)
                : 0;
            let qualityResT = curQuality ? parseFloat(curQuality.responses) : 0;
            let qualityArr = [
                {
                    argument: "Outstanding",
                    value: curQuality ? parseInt(curQuality.score_1) : 0,
                },
                {
                    argument: "Good",
                    value: curQuality ? parseInt(curQuality.score_2) : 0,
                },
                {
                    argument: "Average",
                    value: curQuality ? parseInt(curQuality.score_3) : 0,
                },
                {
                    argument: "Fair",
                    value: curQuality ? parseInt(curQuality.score_4) : 0,
                },
                {
                    argument: "Poor",
                    value: curQuality ? parseInt(curQuality.score_5) : 0,
                },
            ];

            allEvalData.push({
                "data": qualityArr, 
                "mean": qualityMeanT,
                "responses": qualityResT, 
                "title": "Overall, I would rate the quality of this course as:"
            });

            //Get class challenge data
            let curChallege = evalDataState.challenge;
            let challengeMeanT = curChallege
                ? parseFloat(curChallege.class_mean)
                : 0;
            let challengeResT = curChallege
                ? parseFloat(curChallege.responses)
                : 0;
            let challengeArr = [
                {
                    argument: "Strongly Agree",
                    value: curChallege ? parseInt(curChallege.score_1) : 0,
                },
                {
                    argument: "Agree",
                    value: curChallege ? parseInt(curChallege.score_2) : 0,
                },
                {
                    argument: "Neutral",
                    value: curChallege ? parseInt(curChallege.score_3) : 0,
                },
                {
                    argument: "Disagree",
                    value: curChallege ? parseInt(curChallege.score_4) : 0,
                },
                {
                    argument: "Strongly Disagree",
                    value: curChallege ? parseInt(curChallege.score_5) : 0,
                },
            ];

            allEvalData.push({
                "data": challengeArr, 
                "mean": challengeMeanT,
                "responses": challengeResT, 
                "title": "Challenge: I was challenged to extend my capabilities or to develop new ones:"
            });

            //Get class workload data
            let curWorkload = evalDataState.workload;
            let workloadMeanT = curWorkload
                ? parseFloat(curWorkload.class_mean)
                : 0;
            let workloadResT = curWorkload
                ? parseFloat(curWorkload.responses)
                : 0;
            let workloadArr = [
                {
                    argument: "Much Lighter",
                    value: curWorkload ? parseInt(curWorkload.score_1) : 0,
                },
                {
                    argument: "Somewhat Lighter",
                    value: curWorkload ? parseInt(curWorkload.score_2) : 0,
                },
                {
                    argument: "Average",
                    value: curWorkload ? parseInt(curWorkload.score_3) : 0,
                },
                {
                    argument: "Somewhat Heavier",
                    value: curWorkload ? parseInt(curWorkload.score_4) : 0,
                },
                {
                    argument: "Much Heavier",
                    value: curWorkload ? parseInt(curWorkload.score_5) : 0,
                },
            ];

            allEvalData.push({
                "data": workloadArr, 
                "mean": workloadMeanT,
                "responses": workloadResT, 
                "title": "Workload: The workload of this course compared to others was:",
            });

            //Get class why taking data
            let curWhyTaking = evalDataState.why_taking;
            let whyTakingMeanT = curWhyTaking
                ? parseFloat(curWhyTaking.class_mean)
                : 0;
            let whyTakingResT = curWhyTaking
                ? parseFloat(curWhyTaking.responses)
                : 0;
            let whyTakingArr = [
                {
                    argument: "Univ or Dist Req",
                    value: curWhyTaking ? parseInt(curWhyTaking.score_1) : 0,
                },
                {
                    argument: "Req for Major",
                    value: curWhyTaking ? parseInt(curWhyTaking.score_2) : 0,
                },
                {
                    argument: "Elective in Major",
                    value: curWhyTaking ? parseInt(curWhyTaking.score_3) : 0,
                },
                {
                    argument: "Free Elective",
                    value: curWhyTaking ? parseInt(curWhyTaking.score_4) : 0,
                },
                {
                    argument: "N/A",
                    value: curWhyTaking ? parseInt(curWhyTaking.score_5) : 0,
                },
            ];

            allEvalData.push({
                "data": whyTakingArr,
                "mean": whyTakingMeanT,
                "responses": whyTakingResT, 
                "title": "I am taking this course because it satisfies:"
            });

            //Get class comments
            let curComments = evalDataState.comments;
            let commentsArr = curComments ? curComments : [];

            setComments(commentsArr);

            setCompiledEvalData(allEvalData);
        
        }
        
    }, [evalDataState, evalData]);

    const customizeText = (arg) => {
        return `${arg.valueText}%`;
    };
    
    const charts = compiledEvalData.map((item)=>{
        return(
            <div className="chart-container">
                                <p className="chart-txt">
                                    Class Mean:&nbsp;{item.mean}&nbsp;&nbsp;
                                    Rice Mean: 1.34
                                    <br />
                                    Responses:&nbsp;{item.responses}
                                </p>
                                <Chart dataSource={item.data} height={"100px"}>
                                    <CommonAnnotationSettings
                                        type="text"
                                        series="Value"
                                        allowDragging={false}
                                        color={"transparent"}
                                    ></CommonAnnotationSettings>
                                    {item.data
                                        .filter((vals) => {
                                            return vals.value > 0;
                                        })
                                        .map((vals) => (
                                            <Annotation
                                                argument={vals.argument}
                                                key={vals.argument}
                                                text={vals.value}
                                                color={"transparent"}
                                                arrowLength={0}
                                            >
                                                <Font
                                                    size="17px"
                                                    color={"var(--secondary-color)"}
                                                    family={"Acari Sans"}
                                                />
                                                <Border visible={false} />
                                                <Shadow opacity={0} />
                                            </Annotation>
                                        ))}
                                    <Series
                                        type="bar"
                                        hoverMode="none"
                                        valueField="value"
                                        argumentField="argument"
                                        color={"var(--primary-color)"}
                                        name="Value"
                                    />
                                    <Title text={item.title}>
                                        <Font
                                            size="15px"
                                            color={"var(--secondary-color)"}
                                            family={"Acari Sans"}
                                        />
                                    </Title>

                                    <ArgumentAxis>
                                        <Label>
                                            <Font
                                                size="12px"
                                                color={"var(--secondary-color)"}
                                                family={"Acari Sans"}
                                            />
                                        </Label>
                                    </ArgumentAxis>

                                    <ValueAxis
                                        visualRange={[0, 100]}
                                        visible={false}
                                    >
                                        <Label customizeText={customizeText}>
                                            <Font
                                                size="15px"
                                                color={"var(--secondary-color)"}
                                                family={"Acari Sans"}
                                            />
                                        </Label>
                                    </ValueAxis>
                                    <Legend visible={false} />
                                    <Size height={270} width={360} />
                                </Chart>
                            </div>
        );
    })

    return (
        <div className="modal-container">
            {warningState ? (
                <div className="eval-warning">
                    <div className="warning-icon">
                        <AiOutlineWarning color="red" size={40} />
                    </div>
                    <p className="warning-text">
                        These evaluations are intended to be available only to
                        Rice students, faculty and staff on its internal
                        computer network. This information is considered
                        confidential and is to be used solely by, within and
                        amongst the Rice University community and its members.
                    </p>
                    <div className="exit">
                        <IconButton
                            disableFocusRipple
                            disableRipple
                            style={{
                                backgroundColor: "transparent",
                                padding: "0",
                                margin: "0",
                            }}
                            onClick={closeWarning}
                        >
                            <IoCloseOutline color="#898e91" size={30} />
                        </IconButton>
                    </div>
                </div>
            ) : (
                <div style={exitHover ? exitStyleHover : exitStyle}>
                    <IconButton
                            disableFocusRipple
                            disableRipple
                            style={{
                                backgroundColor: "transparent",
                                padding: "0",
                                margin: "0",
                            }}
                            onMouseOver={() => setExitHover(true)}
                            onMouseLeave={() => setExitHover(false)}
                            onClick={props.closeModal}
                        >
                            <IoCloseOutline color={exitHover ? "var(--primary-color)" : "#8e9eb2"} size={30} />
                        </IconButton>
                    </div>
            )}
            <div className="course-info">
                <div className="course-eval-header">
                    <h1 className="no-padding-no-margin">
                        <span className="course-num">
                            {props.courseSubject}&nbsp;{props.courseNum}
                        </span>
                        <span className="course-title-eval">
                            &nbsp;{props.courseTitle}
                        </span>
                    </h1>
                </div>
                <p className="course-details">Term: {term}</p>
                <p className="course-details">
                    Instructor:{" "}
                    {props.courseProf
                        ? props.courseProf &&
                          props.courseProf.firstName +
                              " " +
                              props.courseProf.lastName
                        : "No Instructors"}
                </p>

                <div className="eval-tabs">
                    <button
                        className={`${
                            responseState
                                ? "eval-tabs-clicked"
                                : "eval-tabs-unclicked"
                        }`}
                        onClick={openResponse}
                    >
                        Numeric Responses
                    </button>
                    <button
                        className={`${
                            responseState
                                ? "eval-tabs-unclicked"
                                : "eval-tabs-clicked"
                        }`}
                        onClick={openComments}
                    >
                        Comments
                    </button>
                </div>
            </div>
            {responseState ? (
                <div className="chart-padding">
                    <div className="header-border" />
                    <div className="charts-display">
                        {charts}

                    </div>
                </div>
            ) : (
                <div>
                    {comments.map((item, index) => {
                        return (
                            <div
                                className={`comment-container ${
                                    index % 2 == 0 ? "comment-even" : ""
                                }`}
                                key={index}
                            >
                                <div>{item.text}</div>
                                <div className="time-stamp">{item.time}</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
export default CourseEvalModal;
