import React, { useState, useEffect } from "react";
import SemesterBox from "./SemesterBox";
import "./DegreePlan.css";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useHistory } from "react-router";

// query all of the schedules for a user
const QUERY_ALL_USER_SCHEDULES = gql`
    query scheduleMany {
        scheduleMany {
            _id
            term
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
const MUTATION_ADD_SEMESTER = gql`
    mutation degreePlanAddTerm($term: String!) {
        degreePlanAddTerm(record: {term: $term}) {
        record {
            _id
            term
        }
    }
}
`;

// mutation to delete semester, call from onclick the buttons
// const MUTATION_DELETE_SEMESTER = gql`
//     mutation
// `;

const DegreePlan = () => {
    // to keep the semester in a list to order them
    const [semesterList, setSemesterList] = useState([]);
    const [curLength, setCurLength] = useState(0);
    // get the data from the query
    const { loading, error, data } = useQuery(QUERY_ALL_USER_SCHEDULES);

    // add a new semester from the mutation
    const [mutateSemester, {loadingMutation, errorMutation, dataMutation}] = useMutation(MUTATION_ADD_SEMESTER);

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
        const defaultSchedule = data?.scheduleMany.map((schedule) => ({
            term: schedule.term,
            draftSessions: schedule.draftSessions,
            notes: schedule.notes,
        }));
        setSemesterList(defaultSchedule);
        setCurLength(defaultSchedule && defaultSchedule.length);
    }, [loading, data, error]);

    // adding new semester to semester list (state variable)
    const addNewSem = () => {
        console.log("entered")
        mutateSemester({ variables: {term: "201710", draftSessions: []}})
        const newSem = {'term': "201710", "draftSessions": [], "notes": ""}
        setSemesterList([...semesterList, newSem])
    }

    // delete a semester
    const deleteSem = (term) => {
        const updated_list = semesterList.filter(
            (semester) => semester.term != term
        );
        setSemesterList(updated_list);
    };

    const history = useHistory();
    return (
        <div>
            <button
                className="button"
                onClick={() => history.push("/schedule")}
            >
                Back To Schedule
            </button>
            <h1 className="title">My Degree Plan</h1>
            <div className="layout">
                {/* {defaultSchedule.map((semester) => {
                return (<SemesterBox term={semester.term} draftSessions={semester.draftSessions} notes={semester.notes} />)
            })} */}
                {semesterList &&
                    semesterList.map((semester, index) => {
                        return (
                            <SemesterBox
                                term={semester.term}
                                draftSessions={semester.draftSessions}
                                notes={semester.notes}
                                //  id={semester.id}
                                deleteSem={() => deleteSem(semester.term)}
                                currentLength={semesterList.length}
                                index={index}
                            />
                        );
                    })}
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
    );
};
export default DegreePlan;