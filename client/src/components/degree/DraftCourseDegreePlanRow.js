import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import "./DraftCourseDegreePlanRow.css";

const ADD_NEW_COURSE_TO_DEGREE_PLAN = gql`
    mutation addNewCourse($degreePlanID: ID!, $push: Boolean, $courseID: ID!) {
        addNewCourseToDegreePlan(
            degreePlanID: $degreePlanID
            push: $push
            courseID: $courseID
        ) {
            user {
                firstName
            }
            term
            draftCourses {
                course {
                    courseNum
                    longTitle
                }
            }
        }
    }
`;
const QUERY_ALL_USER_DEGREE_PLANS = gql`
    query QUERY_ALL_USER_DEGREE_PLANS($_id: ID, $degreeplanparent: ID) {
        findAllDegreePlansForUsers(
            _id: $_id
            degreeplanparent: $degreeplanparent
        ) {
            _id
            term
            user {
                _id
                firstName
            }
            customCourse
            notes
            draftCourses {
                _id
                course {
                    _id
                    courseNum
                    subject
                    creditsMin
                    longTitle
                    fullCourseName
                    distribution
                    prereqs
                }
            }
            degreeplanparent {
                name
                _id
            }
        }
    }
`;

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
        recentUpdate @client
        degreeplanparent @client
    }
`;

const VERIFY_TOKEN = gql`
    query VerifyToken {
        verifyToken {
            _id
            firstName
            lastName
            netid
            majors
            college
            affiliation
            token
        }
    }
`;

const DraftCourseDegreePlanRow = ({ course, degreePlanID, queryRemove }) => {
    const removeCourseFromDegreePlan = (degreePlanID, push, courseID) => {
        removeCourseMutation({
            variables: {
                degreePlanID: degreePlanID,
                push: push,
                courseID: courseID,
            },
        });
    };
    const [userId, setUserId] = useState("");
    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    let { degreeplanparent } = storeData;
    const {
        loading: loading4,
        error: error4,
        data: data4,
    } = useQuery(VERIFY_TOKEN);
    useEffect(() => {
        if (data4) {
            setUserId(data4.verifyToken._id);
        }
    }, [loading4, data4, error4]);
    const [
        removeCourseMutation,
        { loadingMutationAdd, errorMutationAdd, dataMutationAdd },
    ] = useMutation(ADD_NEW_COURSE_TO_DEGREE_PLAN, {
        refetchQueries: () => [
            {
                query: queryRemove,
                variables: {
                    _id: degreePlanID,
                },
            },
            {
                query: QUERY_ALL_USER_DEGREE_PLANS,
                variables: {
                    _id: userId,
                    degreeplanparent: degreeplanparent,
                },
            },
        ],
    });
    return (
        <div className="row-container-draft">
            <div className="code-draft">
                <div>
                    <span
                        style={{ fontSize: "0.9rem", color: "rgb(54, 54, 54)" }}
                    >
                        {course.subject} {course.courseNum}
                    </span>
                </div>
            </div>
            <div className="credits-draft">
                <span style={{ fontSize: "0.9rem" }}>{course.creditsMin}</span>
            </div>
            <div className="title-draft">
                <span style={{ fontSize: "0.9rem" }}>{course.longTitle}</span>
            </div>
            <div className="prereqs-draft">
                <span style={{ fontSize: "0.9rem", textOverflow: "ellipsis" }}>
                    {course.prereqs}
                </span>
            </div>
            <div className="removeCourse-draft">
                <button
                    // style={{ width: "35px" }}
                    className="deleteButtonEachCourse"
                    onClick={() =>
                        removeCourseFromDegreePlan(
                            degreePlanID,
                            false,
                            course._id
                        )
                    }
                >
                    <span style={{ fontSize: 16 }}>x</span>
                </button>
            </div>
        </div>
    );
};

export default DraftCourseDegreePlanRow;
