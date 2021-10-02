import React, { useState, useEffect, useContext, useCallback } from "react";
import "./SemesterBox.css";
import CourseRowBox from "./CourseRowBox";
import TitleBox from "./TitleBox";
import { useHistory } from "react-router";
import Modal from "react-modal";
import CustomCourseRow from "./CustomCourseRow";
import { Context as CustomCourseContext } from "../../contexts/customCourseContext";
import { gql, useQuery, useMutation } from "@apollo/client";

// import CustomCourse from "./CustomCourse";

let creditSum;

const SemesterBox = (props) => {
    // for the edit schedule button
    const history = useHistory();
    // for the notes modal
    const [modalState, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
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
        const customCoursesFromDatabase = data?.findScheduleById.customCourse;
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

    const saveCustomCoursesToDatabase = () => {
        let checkValid = true;
        extractedCustomCourseList.forEach(function (course) {
            if (!course) {
                alert("Please check all the custom courses");
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

    const defaultDraftSessions = props["draftSessions"].map((sessions) => {
        return sessions.session
            ? {
                  subject: sessions.session.course
                      ? sessions.session.course.subject
                      : "N/A",
                  courseNum: sessions.session.course
                      ? sessions.session.course.courseNum
                      : "N/A",
                  longTitle: sessions.session.course
                      ? sessions.session.course.longTitle
                      : "N/A",
                  credits: sessions.session.course
                      ? sessions.session.course.creditsMin
                      : 0,
                  // "instructors": (sessions.session.instructors.length != 0) ? sessions.session.instructors : "N/A",
                  instructorFN:
                      sessions.session.instructors.length != 0
                          ? sessions.session.instructors[0].firstName
                          : "N/A",
                  instructorLN:
                      sessions.session.instructors.length != 0
                          ? sessions.session.instructors[0].lastName
                          : "",
                  prereqs: sessions.session.course
                      ? sessions.session.course.prereqs
                      : "N/A",
                  coreqs: sessions.session.course
                      ? sessions.session.course.coreqs
                      : "N/A",
                  maxEnrollment: sessions.session.maxEnrollment,
              }
            : {
                  subject: "N/A",
                  courseNum: "N/A",
                  longTitle: "N/A",
                  credits: 0,
                  instructorFN: "N/A",
                  instructorLN: "N/A",
                  prereqs: "N/A",
                  coreqs: "N/A",
                  maxEnrollment: "N/A",
              };
    });

    // useEffect(() => {
    //     console.log("enter the use effect")
    //     defaultDraftSessions && defaultDraftSessions.map((session) => {
    //     const instructorsPerSession = []
    //     console.log('entered')
    //     if (session['instructors'].length != 0) {
    //         console.log("hi")
    //         session['instructors'] && session['instructors'].map((instructor) => (
    //             instructorsPerSession.push({
    //                 'instructorName': instructor.firstName + ' ' + instructor.lastName
    //             })
    //         ))
    //     } else {
    //         instructorsPerSession.push({'instructorName': "N/A"})
    //     }
    //     setInstructorList([...instructorList, instructorsPerSession])
    // })
    // })

    // if (defaultDraftSessions[0]["instructors"].length != 0){
    //     instructorList = defaultDraftSessions["instructors"].map((instructor) => (
    //         {
    //             'instructorName' : instructor.firstName + ' ' + instructor.lastName,
    //         }
    //     ))
    // } else {
    //     instructorDict = {
    //         'instructorName' : "N/A",
    //     }
    //     instructorList.push(instructorDict)
    // }
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
    // creditSum = defaultDraftSessions.reduce(function (sum, arr) {
    //     return sum + arr.credits;
    // }, 0);

    // console.log('instructor list', instructorList)
    return (
        <div className="bigBox">
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
                    onClick={() => history.push(`/schedule`)}
                >
                    Edit Schedule
                </button>

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
                    Save Course
                </button>
                <Modal
                    isOpen={modalState}
                    className="modal"
                    onRequestClose={closeModal}
                >
                    <div className="notesContent">
                        <textarea
                            maxlength="689"
                            placeholder="Write your notes here..."
                            className="textbox"
                            value={inputVal}
                            onChange={(e) => changeInputVal(e.target.value)}
                        ></textarea>
                    </div>
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
