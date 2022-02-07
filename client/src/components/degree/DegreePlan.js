import React, { useState, useEffect, useContext, useReducer } from "react";
import SemesterBox from "./SemesterBox";
import "./DegreePlan.css";
import {
    gql,
    useQuery,
    useMutation,
    useLazyQuery,
    useApolloClient,
} from "@apollo/client";
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
    mutation createNewDegreePlan($term: String!, $degreeplanparent: MongoID!) {
        createNewDegreePlan(
            record: { term: $term, degreeplanparent: $degreeplanparent }
        ) {
            degreeplanparent {
                _id
                name
            }
            _id
            user {
                firstName
            }
            term
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

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
        recentUpdate @client
        degreeplanparent @client
        degreeplanname @client
    }
`;

const QUERY_USER_DEGREE_PLAN_LIST_BY_ID = gql`
    query findDegreePlanParentById($_id: ID) {
        findDegreePlanParentById(_id: $_id) {
            _id
            name
        }
    }
`;

const DegreePlan = () => {
    // to keep the semester in a list to order them
    const [semesterList, setSemesterList] = useState([]);
    const [userId, setUserId] = useState("");
    const [degreePlanName, setDegreePlanName] = useState("");

    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    let { degreeplanparent, degreeplanname } = storeData;

    const [loadDegreePlanData, { loading, error, data }] = useLazyQuery(
        QUERY_ALL_USER_DEGREE_PLANS,
        {
            variables: {
                _id: userId,
                degreeplanparent: degreeplanparent,
            },
        }
    );
    useEffect(() => {
        if (degreeplanparent) {
            loadDegreePlanData();
        }
    }, [degreeplanparent]);

    const {
        loading: loading4,
        error: error4,
        data: data4,
    } = useQuery(VERIFY_TOKEN);

    const {
        state: { term },
    } = useContext(TermContext);

    // add a new semester from the mutation

    const [mutateSemester, { loadingMutation, errorMutation, dataMutation }] =
        useMutation(MUTATION_ADD_DEGREE_PLAN, {
            refetchQueries: () => [
                {
                    query: QUERY_ALL_USER_DEGREE_PLANS,
                    variables: {
                        _id: userId,
                        degreeplanparent: degreeplanparent,
                    },
                },
            ],
        });

    const [
        deleteSemester,
        { loadingMutationDelete, errorMutationDelete, dataMutationDelete },
    ] = useMutation(DELETE_DEGREE_PLAN, {
        refetchQueries: () => [
            {
                query: QUERY_ALL_USER_DEGREE_PLANS,
                variables: {
                    _id: userId,
                    degreeplanparent: degreeplanparent,
                },
            },
        ],
    });

    // print status to page (NOTE: Raises Rending more hooks than previous... error)
    // if (loading) return <p>Loading</p>;
    // if (error) return <p>Error</p>;
    // if (!data) return <p>Error</p>;

    useEffect(() => {
        if (data4) {
            setUserId(data4.verifyToken._id);
        }
    }, [loading4, data4, error4]);
    useEffect(() => {
        const defaultSchedule = data?.findAllDegreePlansForUsers.map(
            (schedule) => ({
                term: schedule.term,
                draftCourses: schedule.draftCourses,
                notes: schedule.notes,
                _id: schedule._id,
                customCourses: schedule.customCourse,
                degreeplanparent: schedule.degreeplanparent,
            })
        );
        setDegreePlanName(degreeplanname && degreeplanname);
        setSemesterList(defaultSchedule);
    }, [degreeplanparent, loading, data, error]);

    // adding new semester to semester list (state variable)
    const addNewSem = () => {
        if (
            semesterList &&
            !semesterList.map((ele) => ele.term).includes(term)
        ) {
            mutateSemester({
                variables: {
                    term: term,
                    draftCourses: [],
                    degreeplanparent: degreeplanparent && degreeplanparent,
                },
            });
        } else {
            alert("You have already created a schedule of this term");
        }
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
            <DegreePlanNav degreePlanName={degreePlanName} />
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
