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

const MUTATION_ADD_SEMESTER = gql`
    mutation createNewSchedule($term: String!) {
        createNewSchedule(record: { term: $term }) {
            term
            user {
                _id
            }
        }
    }
`;

const DELETE_SEMESTER = gql`
    mutation removeSchedule($_id: MongoID!) {
        removeSchedule(filter: { _id: $_id }) {
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

const DegreePlan = () => {
    // to keep the semester in a list to order them
    const [semesterList, setSemesterList] = useState([]);
    const [userId, setUserId] = useState("");
    // get the data from the query
    const { loading, error, data } = useQuery(QUERY_ALL_USER_SCHEDULES);
    const {
        state: { term },
    } = useContext(TermContext);

    // add a new semester from the mutation
    const [mutateSemester, { loadingMutation, errorMutation, dataMutation }] =
        useMutation(MUTATION_ADD_SEMESTER, {
            refetchQueries: () => [{ query: QUERY_ALL_USER_SCHEDULES }],
        });
    const [
        deleteSemester,
        { loadingMutationDelete, errorMutationDelete, dataMutationDelete },
    ] = useMutation(DELETE_SEMESTER, {
        refetchQueries: () => [{ query: QUERY_ALL_USER_SCHEDULES }],
    });

    const [updateCustomCourses, { loading2, error2, data2 }] = useMutation(
        UPDATE_CUSTOM_COURSES
    );

    // print status to page (NOTE: Raises Rending more hooks than previous... error)
    // if (loading) return <p>Loading</p>;
    // if (error) return <p>Error</p>;
    // if (!data) return <p>Error</p>;

    useEffect(() => {
        // get only the data we need
        // const defaultSchedule = data.scheduleMany.map(schedule =>
        //     (
        //         {"term": schedule.term,
        //         "draftSessions": schedule.draftSessions,
        //         "notes": schedule.notes}
        //     )
        // );
        const user_id = data?.scheduleMany[0].user._id;
        const defaultSchedule = data?.scheduleMany.map((schedule) => ({
            term: schedule.term,
            draftSessions: schedule.draftSessions,
            notes: schedule.notes,
            _id: schedule._id,
            customCourses: schedule.customCourse,
        }));
        setUserId(user_id);
        setSemesterList(defaultSchedule);
    }, [loading, data, error]);

    // adding new semester to semester list (state variable)
    const addNewSem = () => {
        mutateSemester({
            variables: {
                term: term,
                draftSessions: [],
            },
        });
        // const newSem = { term: term, draftSessions: [], notes: "", _id: "" };
        // setSemesterList([...semesterList, newSem]);
    };

    // delete a semester
    const deleteSem = (term, _id) => {
        const updated_list = semesterList.filter(
            (semester) => semester._id != _id
        );
        deleteSemester({
            variables: {
                _id: _id,
            },
        });
        setSemesterList(updated_list);
    };

    const history = useHistory();
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
                                draftSessions={semester.draftSessions}
                                notes={semester.notes}
                                //  id={semester.id}
                                customCourses={semester.customCourses}
                                deleteSem={() =>
                                    deleteSem(semester.term, semester._id)
                                }
                                query={FIND_SCHEDULE_BY_ID}
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
