import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import CourseSearchRow from "./CourseSearchRow";
import "./EditSchedulePopUp.css";

const FIND_ALL_FOR_DEGREE_PLAN = gql`
    query findAllForDegreePlan($ascending: Boolean!) {
        findAllForDegreePlan(ascending: $ascending) {
            _id
            subject
            courseNum
            longTitle
            distribution
            creditsMin
            creditsMax
            prereqs
            fullCourseName
        }
    }
`;

const FIND_DEGREE_PLAN_BY_ID = gql`
    query findDegreePlan($_id: MongoID!) {
        findDegreePlanById(filter: { _id: $_id }) {
            user {
                firstName
            }
            term
        }
    }
`;

const EditSchedulePopUp = ({ term, _id }) => {
    const [courseName, setCourseName] = useState("");
    const [value, setValue] = useState("");
    const [courseList, setCourseList] = useState([]);
    const {
        loading,
        error,
        data: courseData,
    } = useQuery(FIND_ALL_FOR_DEGREE_PLAN, {
        variables: {
            ascending: true,
        },
    });

    const {
        loading: degreePlanLoading,
        error: degreePlanError,
        data: degreePlanData,
    } = useQuery(FIND_DEGREE_PLAN_BY_ID, {
        variables: {
            _id: _id,
        },
    });

    console.log(_id);

    useEffect(() => {
        if (courseData) {
            setCourseList(courseData.findAllForDegreePlan);
        }
    }, [loading, error, courseData]);

    return (
        <div className="container2">
            <div className="SearchBar">
                <input
                    type="text"
                    className="header-search"
                    placeholder="Search courses"
                    name="s"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button
                    onClick={() => setCourseName(value)}
                    className="button-search"
                >
                    Search
                </button>
            </div>
            <div className="bottomContainer">
                <div className="SearchResult">
                    <div className="SearchHeader">
                        <div className="nameHead">Course</div>
                        <div className="creditsHead">Cred</div>
                        <div className="distributionHead">Dist</div>
                        <div className="checkBoxHead">Add</div>
                    </div>
                    <div className="listCourseSearch">
                        {courseList &&
                            courseList
                                .filter((course) =>
                                    course.fullCourseName
                                        .replace(/\s+/g, "")
                                        .toLowerCase()
                                        .includes(
                                            courseName
                                                .toLowerCase()
                                                .replace(/\s+/g, "")
                                        )
                                )
                                .map((course) => {
                                    return <CourseSearchRow course={course} />;
                                })}
                    </div>
                </div>
                <div className="Cart">
                    <div className="CartHeader">
                        <div className="codeCartHead">Code</div>
                        <div className="creditsCartHead">Credit</div>
                        <div className="titleCartHead">Title</div>
                        <div className="preReqCartHead">Prereqs</div>
                    </div>
                    <div className="listCourseSearch"></div>
                </div>
            </div>
        </div>
    );
};

export default EditSchedulePopUp;
