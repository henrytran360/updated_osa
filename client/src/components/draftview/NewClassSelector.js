import { CircularProgress } from "@material-ui/core";
import React, { useEffect } from "react";
import "./NewClassSelector.css";
import NewDraftCourseItem from "./NewDraftCourseItem";
import { gql, useMutation, useQuery } from "@apollo/client";

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        evalModalState @client
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
            draftSessions = draftSessions.filter((value, index) => {
                return (
                    index ===
                    draftSessions.findIndex((obj) => {
                        return obj.session._id === value.session._id;
                    })
                );
            });
            draftSessions = draftSessions.filter((draft) => draft.session);
        }
    }, [draftSessions]);

    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    let { evalModalState } = storeData;

    return (
        <div className="classSelectorContainer">
            <div className="classSelectorContent">
                <div
                    style={{
                        marginBottom: 10,
                        display: "flex",
                        alignItems: "center",
                        height: "3%",
                        color: "var(--primary-color)",
                    }}
                >
                    <span className="heading">SELECTED</span>
                </div>
                {draftSessions &&
                    draftSessions
                        .filter((value, index) => {
                            return (
                                index ===
                                draftSessions.findIndex((obj) => {
                                    return (
                                        obj.session._id === value.session._id
                                    );
                                })
                            );
                        })
                        .map((draftSession, index) => (
                            <NewDraftCourseItem
                                //replace key with uuid
                                key={index}
                                index={index}
                                visible={draftSession.visible}
                                session={draftSession.session}
                                course={draftSession.session.course}
                                // prevTermCourses={prevTermCourses.prevTermCourses}
                                instructorsList={
                                    draftSession.session.instructors
                                }
                                scheduleID={scheduleID}
                            />
                        ))}
                <div
                    className="tableFooter"
                    style={{
                        zIndex: evalModalState ? -99 : 10,
                    }}
                >
                    Visible Credit Hours: {visibleCreditTotal}
                    <br />
                    Total Credit Hours: {absoluteCreditTotal}
                </div>
            </div>
        </div>
    );
};

export default NewClassSelector;
