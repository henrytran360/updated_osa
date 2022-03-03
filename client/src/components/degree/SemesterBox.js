import React, { useState, useEffect, useContext, useCallback } from "react";
import "./SemesterBox.css";
import CourseRowBox from "./CourseRowBox";
import TitleBox from "./TitleBox";
import { useHistory } from "react-router";
import Modal from "react-modal";
import CustomCourseRow from "./CustomCourseRow";
import { Context as CustomCourseContext } from "../../contexts/customCourseContext";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import EditSchedulePopUp from "./EditSchedulePopUp";
import EditorJS from "@editorjs/editorjs";
import NotesModal from "./NotesModal";
import Alert from "@mui/material/Alert";

// import CustomCourse from "./CustomCourse";

let creditSum;

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
        recentUpdate @client
        degreeplanparent @client
        degreeplanname @client
        degreeplanlist @client
        evalModalState @client
        editModalState @client
        notesModalState @client
        eachCourseModalState @client
    }
`;

const SemesterBox = (props) => {
    const client = useApolloClient();
    // for the notes modal
    const [modalState, setModal] = useState(false);
    const [modalState2, setModal2] = useState(false);
    const openModal = () => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: {
                notesModalState: true,
            },
        });
        setModal(true);
    };
    const openModal2 = () => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: {
                editModalState: true,
            },
        });
        setModal2(true);
    };
    const closeModal = () => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: {
                notesModalState: false,
            },
        });
        setModal(false);
    };
    const closeModal2 = () => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: {
                editModalState: false,
            },
        });
        setModal2(false);
    };
    // for the notes content
    const [inputVal, changeInputVal] = useState("");

    const saveInput = (e) => {
        changeInputVal(document.getElementById("notes").value);
        document.getElementById("notes").value = inputVal;
    };
    const { loading, error, data, refetch } = useQuery(props.query, {
        variables: { _id: props._id },
    });
    if (error) return <Error message={error.message} />;
    const [updateCustomCourses, { loading2, error2, data2 }] = useMutation(
        props.mutation
    );
    const [customCourseList, setCustomCourseList] = useState([]);
    const [databaseCustomCourse, setDatabaseCustomCourse] = useState([]);
    const [extractedCustomCourseList, setExtractedCustomCourseList] = useState(
        []
    );
    const [creditSumState, setCreditSumState] = useState(0);
    const editCustomCourse = (course, id) => {
        if (
            customCourseList &&
            customCourseList.find((course) => course.id == id)
        ) {
            const newState = [...customCourseList];
            console.log("in the array");
            const index = newState.findIndex((course) => course.id == id);
            if (index >= 0) {
                newState[index] = {
                    course: course,
                    id: id,
                };
            }
            setCustomCourseList(newState);
        }
    };
    useEffect(() => {
        const customCoursesFromDatabase = data?.findDegreePlanById.customCourse;
        setDatabaseCustomCourse(customCoursesFromDatabase);
    }, [loading, data, error]);

    useEffect(() => {
        if (databaseCustomCourse && customCourseList) {
            let extractedCourse = customCourseList
                .map((course) => course.course)
                .filter((course) => !databaseCustomCourse.includes(course));
            let combinedCourse = databaseCustomCourse.concat(extractedCourse);
            setExtractedCustomCourseList(combinedCourse);
        }
    }, [databaseCustomCourse, customCourseList]);

    const newCustomCourse = {
        course: "",
        id: extractedCustomCourseList.length + 1,
    };
    const addCustomCourseAction = () => {
        // setCustomCourseList(customCourseList.concat(customCourses));
        setCustomCourseList([...customCourseList, newCustomCourse]);
    };

    const deleteCustomCourse = () => {
        const newCustomCourseList = [...customCourseList];
        newCustomCourseList.pop();
        setCustomCourseList(newCustomCourseList);
    };

    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);

    const saveCustomCoursesToDatabase = () => {
        let checkValid = true;
        extractedCustomCourseList.forEach(function (course) {
            if (!course) {
                setErrorAlert(true);
                checkValid = false;
                return;
            }
        });
        if (checkValid) {
            updateCustomCourses({
                variables: {
                    _id: props._id,
                    customCourse: extractedCustomCourseList,
                },
            });
            refetch();
            setSuccessAlert(true);
        }
    };

    const deleteCustomCourseDatabase = (courseDetailString) => {
        setCustomCourseList(
            customCourseList.filter(
                (course) => course.course != courseDetailString
            )
        );
        updateCustomCourses({
            variables: {
                _id: props._id,
                customCourse: extractedCustomCourseList.filter(
                    (course) => course != courseDetailString && course != ""
                ),
            },
        });
        refetch();
    };

    // console.log('checkmark', props["draftSessions"][6].session)
    // console.log('checkmark', props["draftSessions"][6].session)

    // const instructorFN = (typeof props["draftSessions"].session.instructors[0].firstName !== undefined) ? props["draftSessions"].sessions.instructors[0].firstName : "N/A"
    // const instructorLN = (typeof props["draftSessions"].session.instructors[0].lastName !== undefined) ? props["draftSessions"].sessions.instructors[0].lastName : "N/A"

    // console.log("check", props["draftSessions"]);
    // console.log('check1', props["draftSessions"][6].session.instructors)
    const defaultDraftSessions = props["draftCourses"].map((courses) => {
        return courses.course
            ? {
                  subject: courses.course ? courses.course.subject : "N/A",
                  courseNum: courses.course ? courses.course.courseNum : "N/A",
                  longTitle: courses.course ? courses.course.longTitle : "N/A",
                  credits: courses.course ? courses.course.creditsMin : 0,
                  prereqs: courses.course ? courses.course.prereqs : "N/A",
                  coreqs: courses.course ? courses.course.coreqs : "N/A",
                  distribution: courses.course
                      ? courses.course.distribution
                      : "N/A",
              }
            : {
                  subject: "N/A",
                  courseNum: "N/A",
                  longTitle: "N/A",
                  credits: 0,
                  prereqs: "N/A",
                  coreqs: "N/A",
              };
    });

    useEffect(() => {
        if (defaultDraftSessions && extractedCustomCourseList) {
            let creditSum = defaultDraftSessions.reduce(function (sum, arr) {
                return sum + arr.credits;
            }, 0);

            let creditSumCustomCourse = extractedCustomCourseList.reduce(
                function (sum, arr) {
                    return sum + parseInt(arr.split("&")[2]);
                },
                0
            );
            setCreditSumState(creditSum + creditSumCustomCourse);
        }
    }, [defaultDraftSessions, extractedCustomCourseList]);

    return (
        <div className="bigBox">
            {errorAlert && (
                <Alert onClose={() => setErrorAlert(false)} severity="error">
                    Please check all the custom courses
                </Alert>
            )}

            {successAlert && (
                <Alert
                    onClose={() => setSuccessAlert(false)}
                    severity="success"
                >
                    Your custom courses have been successfully saved!
                </Alert>
            )}

            <div className="buttonNav">
                <button
                    onClick={props.deleteSem}
                    // style={{ width: "35px" }}
                    className="deleteButton"
                >
                    x
                </button>
                <button
                    className="button"
                    // style={{ width: "170px" }}
                    // onClick={() => history.push(`/schedule`)}
                    onClick={openModal2}
                >
                    Edit
                </button>

                <Modal
                    isOpen={modalState2}
                    className="modalDegreePlan"
                    onRequestClose={closeModal2}
                >
                    <EditSchedulePopUp term={props.term} _id={props._id} />
                </Modal>

                <button
                    className="button"
                    // style={{ width: "170px" }}
                    onClick={openModal}
                >
                    Notes
                </button>

                <button
                    className="button"
                    // style={{ width: "170px" }}
                    onClick={saveCustomCoursesToDatabase}
                >
                    Save Custom
                </button>
                <Modal
                    isOpen={modalState}
                    className="modalNotes"
                    ariaHideApp={false}
                    onRequestClose={closeModal}
                >
                    <NotesModal _id={props._id} term={props.term} />
                </Modal>
                <button
                    className="customButton"
                    // style={{ width: "170px" }}
                    onClick={addCustomCourseAction}
                >
                    Custom Course
                </button>
            </div>
            <div className="semesterFlexBox">
                <TitleBox
                    term={props.term}
                    credits={creditSumState}
                    selector={props.selector}
                />

                {defaultDraftSessions &&
                    defaultDraftSessions.map((session) => {
                        return (
                            <CourseRowBox
                                subject={session["subject"]}
                                courseNum={session["courseNum"]}
                                longTitle={session["longTitle"]}
                                credits={session["credits"]}
                                distribution={session["distribution"]}
                                instructorFN={session["instructorFN"]}
                                instructorLN={session["instructorLN"]}
                                prereqs={session["prereqs"]}
                                coreqs={session["coreqs"]}
                                maxEnrollment={session["maxEnrollment"]}
                            />
                        );
                    })}
                {extractedCustomCourseList &&
                    extractedCustomCourseList.map((course, index) => {
                        return (
                            <CustomCourseRow
                                customCourses={props.customCourses}
                                id={index}
                                editCustomCourse={editCustomCourse}
                                deleteCustomCourse={deleteCustomCourse}
                                deleteCustomCourseDatabase={
                                    deleteCustomCourseDatabase
                                }
                                courseDetailString={course}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export { creditSum };
export default SemesterBox;
