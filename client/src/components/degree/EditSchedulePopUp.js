import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import CourseSearchRow from "./CourseSearchRow";
import DraftCourseDegreePlanRow from "./DraftCourseDegreePlanRow";
import { AiOutlineSearch } from "react-icons/ai";
import "./EditSchedulePopUp.css";
import TermName from "../../constants/TermName";
import TermNumber from "../../constants/TermNumber";

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

const EditSchedulePopUp = ({ term, _id }) => {
    const [courseName, setCourseName] = useState("");
    const [value, setValue] = useState("");
    const [courseList, setCourseList] = useState([]);
    const [draftCourseList, setDraftCourseList] = useState([]);
    const [year, setYear] = useState("");
    const [sem, setSem] = useState("");
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

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            setCourseName(value.replace(/\s+/g, "").toLowerCase());
        }
    };

    useEffect(() => {
        if (courseData) {
            setCourseList(courseData.findAllForDegreePlan);
        }
    }, [loading, error, courseData]);
    useEffect(() => {
        if (degreePlanData) {
            setDraftCourseList(degreePlanData.findDegreePlanById.draftCourses);
        }
    }, [degreePlanData, degreePlanError, degreePlanLoading]);

    useEffect(() => {
        if (term) {
            let y = term.substring(0, 4);
            let s = term.substring(4, 6);
            setSem(TermNumber.get(s));
            setYear(y);
        }
    }, [term]);

    console.log(
        courseList.filter(
            (course) =>
                course.fullCourseName && course.fullCourseName.includes("univ")
        )
    );

    return (
        <div className="container2">
            <div className="SearchBar">
                <div className="header-semester-name">
                    <span style={{ fontSize: 25 }}>
                        {year} {sem} Semester
                    </span>
                </div>
                <div className="searchInputs">
                    <input
                        type="text"
                        className="header-search"
                        placeholder="Search courses"
                        name="s"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyUp={handleKeyPress}
                    />
                    <div className="searchIcon">
                        <AiOutlineSearch
                            size={25}
                            onClick={() =>
                                setCourseName(
                                    value.replace(/\s+/g, "").toLowerCase()
                                )
                            }
                        />
                    </div>
                </div>
            </div>
            <div className="bottomContainer">
                <div className="SearchResult">
                    <div className="SearchHeader">
                        <div className="nameHead">COURSE</div>
                        <div className="creditsHead">CRED</div>
                        <div className="checkBoxHead">ADD</div>
                    </div>
                    <div className="listCourseSearch">
                        {courseList.length > 0 &&
                            (courseName
                                ? courseList.filter(
                                      (course) =>
                                          course.fullCourseName &&
                                          course.fullCourseName.includes(
                                              courseName
                                          )
                                  )
                                    ? courseList
                                          .filter(
                                              (course) =>
                                                  course.fullCourseName &&
                                                  course.fullCourseName.includes(
                                                      courseName
                                                  )
                                          )
                                          .map((course) => {
                                              return (
                                                  <CourseSearchRow
                                                      course={course}
                                                      degreePlanID={_id}
                                                      queryAdd={
                                                          FIND_DEGREE_PLAN_BY_ID
                                                      }
                                                  />
                                              );
                                          })
                                    : "There are no courses that match your search"
                                : courseList.slice(100, 150).map((course) => {
                                      return (
                                          <CourseSearchRow
                                              course={course}
                                              degreePlanID={_id}
                                              queryAdd={FIND_DEGREE_PLAN_BY_ID}
                                          />
                                      );
                                  }))}
                    </div>
                </div>
                <div className="Cart">
                    <div className="CartHeader">
                        <div className="codeCartHead">CODE</div>
                        <div className="creditsCartHead">CRED</div>
                        <div className="titleCartHead">TITLE</div>
                        <div className="preReqCartHead">PREREQS</div>
                    </div>
                    <div className="listCourseSearch">
                        {draftCourseList &&
                            draftCourseList.map((course) => {
                                return (
                                    <DraftCourseDegreePlanRow
                                        course={course.course}
                                        degreePlanID={_id}
                                        queryRemove={FIND_DEGREE_PLAN_BY_ID}
                                    />
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditSchedulePopUp;
