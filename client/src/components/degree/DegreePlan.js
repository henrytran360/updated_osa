import React, { useState, useEffect, useContext, useReducer } from "react";
import SemesterBox from "./SemesterBox";
import "./DegreePlan.css";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useHistory } from "react-router";
import { Context as TermContext } from "../../contexts/termContext";
import TitleBox from "./TitleBox";
import RiceAppsLogo from "../../riceappslogo.png";
import { initGA, OutboundLink } from "../../utils/analytics";
import DegreePlanNav from "./DegreePlanHeader";

// Redirects people to our Medium page on a new page if they click our logo to learn more about us
const handleLogoClick = () => {
    OutboundLink(
        "Clicked Logo.",
        window.open("https://medium.com/riceapps", "_blank")
    );
};

const GET_EVALUATION_CHART_BY_COURSE = gql`
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
        }
    }
`;

// query all of the schedules for a user
const QUERY_ALL_USER_SCHEDULES = gql`
    query scheduleMany {
        scheduleMany {
            _id
            term
            user {
                _id
            }
            draftSessions {
                session {
                    course {
                        subject
                        longTitle
                        courseNum
                        creditsMin
                        creditsMax
                        prereqs
                        coreqs
                        distribution
                    }
                    instructors {
                        firstName
                        lastName
                    }
                    maxEnrollment
                }
                visible
            }
            customCourse
            notes
        }
    }
`;

const QUERY_ALL_USER_DEGREE_PLANS = gql`
    query QUERY_ALL_USER_SCHEDULES {
        findAllDegreePlansForUsers {
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
        }
    }
`;

// mutation to add semester, call from onclick the buttons
// const MUTATION_ADD_SEMESTER = gql`
//     mutation degreePlanAddTerm($term: String!) {
//         degreePlanAddTerm(record: { term: $term }) {
//             record {
//                 _id
//                 term
//             }
//         }
//     }
// `;

const MUTATION_ADD_DEGREE_PLAN = gql`
    mutation createNewDegreePlan($term: String!) {
        createNewDegreePlan(record: { term: $term }) {
            term
            user {
                firstName
            }
        }
    }
`;

const DELETE_DEGREE_PLAN = gql`
    mutation removeDegreePlan($_id: MongoID!) {
        removeDegreePlan(filter: { _id: $_id }) {
            term
            _id
            customCourse
        }
    }
`;

const UPDATE_CUSTOM_COURSES = gql`
    mutation updateCustomCourses($_id: MongoID!, $customCourse: [String]) {
        updateCustomCourses(
            record: { customCourse: $customCourse }
            filter: { _id: $_id }
        ) {
            _id
            term
            customCourse
        }
    }
`;

const FIND_SCHEDULE_BY_ID = gql`
    query findScheduleById($_id: MongoID!) {
        findScheduleById(filter: { _id: $_id }) {
            _id
            customCourse
            term
        }
    }
`;

const FIND_DEGREE_PLAN_BY_ID = gql`
    query findDegreePlan($_id: MongoID!) {
        findDegreePlanById(filter: { _id: $_id }) {
            user {
                _id
                firstName
            }
            customCourse
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
            notes
            term
        }
    }
`;

const DegreePlan = () => {
    // to keep the semester in a list to order them
    const [semesterList, setSemesterList] = useState([]);
    const [userId, setUserId] = useState("");
    // get the data from the query
    const { loading, error, data } = useQuery(QUERY_ALL_USER_DEGREE_PLANS);
    const { loading3, error3, data3 } = useQuery(
        GET_EVALUATION_CHART_BY_COURSE
    );
    const {
        state: { term },
    } = useContext(TermContext);

    // add a new semester from the mutation

    const [mutateSemester, { loadingMutation, errorMutation, dataMutation }] =
        useMutation(MUTATION_ADD_DEGREE_PLAN, {
            refetchQueries: () => [{ query: QUERY_ALL_USER_DEGREE_PLANS }],
        });

    const [
        deleteSemester,
        { loadingMutationDelete, errorMutationDelete, dataMutationDelete },
    ] = useMutation(DELETE_DEGREE_PLAN, {
        refetchQueries: () => [{ query: QUERY_ALL_USER_DEGREE_PLANS }],
    });

    const [updateCustomCourses, { loading2, error2, data2 }] = useMutation(
        UPDATE_CUSTOM_COURSES
    );

    // print status to page (NOTE: Raises Rending more hooks than previous... error)
    // if (loading) return <p>Loading</p>;
    // if (error) return <p>Error</p>;
    // if (!data) return <p>Error</p>;

    useEffect(() => {
        const user_id = data?.findAllDegreePlansForUsers[0].user._id;
        const defaultSchedule = data?.findAllDegreePlansForUsers.map(
            (schedule) => ({
                term: schedule.term,
                draftCourses: schedule.draftCourses,
                notes: schedule.notes,
                _id: schedule._id,
                customCourses: schedule.customCourse,
            })
        );
        setUserId(user_id);
        setSemesterList(defaultSchedule);
    }, [loading, data, error]);

    // adding new semester to semester list (state variable)
    const addNewSem = () => {
        mutateSemester({
            variables: {
                term: term,
                draftCourses: [],
            },
        });
        // const newSem = { term: term, draftSessions: [], notes: "", _id: "" };
        // setSemesterList([...semesterList, newSem]);
    };

    // delete a semester
    const deleteSem = (term, _id) => {
        if (semesterList.length > 1) {
            const updated_list = semesterList.filter(
                (semester) => semester._id != _id
            );
            deleteSemester({
                variables: {
                    _id: _id,
                },
            });
            setSemesterList(updated_list);
        }
    };

    return (
        <div>
            <DegreePlanNav />
            <div className="layout">
                {/* {defaultSchedule.map((semester) => {
                return (<SemesterBox term={semester.term} draftSessions={semester.draftSessions} notes={semester.notes} />)
            })} */}
                {semesterList &&
                    semesterList.map((semester, index) => {
                        return (
                            <SemesterBox
                                _id={semester._id}
                                term={semester.term}
                                draftCourses={semester.draftCourses}
                                notes={semester.notes}
                                //  id={semester.id}
                                customCourses={semester.customCourses}
                                deleteSem={() =>
                                    deleteSem(semester.term, semester._id)
                                }
                                query={FIND_DEGREE_PLAN_BY_ID}
                                mutation={UPDATE_CUSTOM_COURSES}
                                selector={false}
                            />
                        );
                    })}

                <div className="addNewScheduleContainer">
                    <TitleBox term={""} credits={0} selector={true} />

                    <button
                        onClick={() => {
                            addNewSem();
                        }}
                        className="addBtn"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DegreePlan;
