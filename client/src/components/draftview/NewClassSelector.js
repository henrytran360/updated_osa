import { CircularProgress } from "@material-ui/core";
import React, { useEffect } from "react";
import "./NewClassSelector.css";
import NewDraftCourseItem from "./NewDraftCourseItem";
import { gql, useMutation, useQuery } from "@apollo/client";

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
        recentUpdate @client
    }
`;

const get_eval = gql`
    query getEvaluationChartByCourse($course: String!) {
        getEvaluationChartByCourse(course: $course) {
            courseName
            expected_pf {
                score_1
                score_2
                score_3
                score_4
                score_5
            }
            expected_grade {
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
            term
            enrolled_amount
        }
    }
`;

const NewClassSelector = ({ draftSessions, scheduleID }) => {
    const { loading, error, data } = useQuery(get_eval, {
        variables: {
            course: "COMP 540",
        },
    });

    let visibleCreditTotal = draftSessions.reduce(
        (totalCredits, draftSession) => {
            if (draftSession.visible) {
                return totalCredits + draftSession.session.course.creditsMin;
            } else {
                return totalCredits;
            }
        },
        0
    );

    // Calculate absolute total credit hours
    let absoluteCreditTotal = draftSessions.reduce(
        (totalCredits, draftSession) => {
            return totalCredits + draftSession.session.course.creditsMin;
        },
        0
    );
    useEffect(() => {
        if (draftSessions) {
            draftSessions = draftSessions.filter((draft) => draft.session);
        }
    }, [draftSessions]);
    return (
        <div className="classSelectorContainer">
            <div className="classSelectorContent">
                <div
                    style={{
                        marginBottom: 10,
                        display: "flex",
                        alignItems: "center",
                        height: "5%",
                        color: "#1EBFC2",
                    }}
                >
                    <span className="heading">SELECTED</span>
                </div>
                {draftSessions &&
                    draftSessions.map((draftSession, index) => (
                        <NewDraftCourseItem
                            //replace key with uuid
                            index={index}
                            visible={draftSession.visible}
                            session={draftSession.session}
                            course={draftSession.session.course}
                            // prevTermCourses={prevTermCourses.prevTermCourses}
                            instructorsList={draftSession.session.instructors}
                            scheduleID={scheduleID}
                        />
                    ))}
                <div className="tableFooter">
                    Visible Credit Hours: {visibleCreditTotal}
                    <br />
                    Total Credit Hours: {absoluteCreditTotal}
                </div>
            </div>
        </div>
    );
};

export default NewClassSelector;
