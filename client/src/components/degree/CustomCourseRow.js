import React, { useState, useContext, useEffect } from "react";
import "./RowBox.css";
import "./LeftCourseBox.css";
import "./RightCourseBox.css";
import SemesterBox from "./SemesterBox";
import { Context as CustomCourseContext } from "../../contexts/customCourseContext";

const CustomCourseRow = (props) => {
    // const courseInfo = props.customCourse ? props.customCourse.split(" ") : [];
    const {
        id,
        editCustomCourse,
        courseDetailString,
        deleteCustomCourse,
        deleteCustomCourseDatabase,
    } = props;
    const [inputCode, setInputCode] = useState();
    const [inputName, setInputName] = useState("");
    const [inputCredit, setInputCredit] = useState(1);
    const customCourseDetail =
        courseDetailString && courseDetailString.split("&");

    const saveCustomCourse = () => {
        if (inputCode && inputName && inputCredit) {
            editCustomCourse(
                `${inputCode}&${inputName}&${inputCredit}`,
                id + 1
            );
        } else {
            alert("Please fill in all the information for the course");
        }
    };
    return (
        <div className="outerRowBox">
            <div className="rowBox">
                <div className="lcbox">
                    {courseDetailString ? (
                        <>
                            <span className="customCourseCode">
                                {customCourseDetail[0]}
                            </span>
                            <span className="customCourseName">
                                {customCourseDetail[1]}
                            </span>
                        </>
                    ) : (
                        <>
                            <input
                                placeholder={
                                    inputCode ? inputCode : "Enter Code"
                                }
                                className="customCourseCode"
                                type="text"
                                onChange={(e) => setInputCode(e.target.value)}
                            />
                            <input
                                placeholder={
                                    inputName ? inputName : "Enter Name"
                                }
                                className="customCourseName"
                                type="text"
                                onChange={(e) => setInputName(e.target.value)}
                            />
                        </>
                    )}
                </div>
                <div className="rccbox">
                    {courseDetailString ? (
                        <>
                            <span className="customCredit">
                                {customCourseDetail[2]}
                            </span>
                        </>
                    ) : (
                        <input
                            placeholder={inputCredit ? inputCredit : "#"}
                            className="customCredit"
                            type="number"
                            min="1"
                            onChange={(e) => setInputCredit(e.target.value)}
                        />
                    )}
                </div>
            </div>
            <div className="button-container">
                {!courseDetailString && (
                    <button
                        // style={{ width: "35px" }}
                        className="deleteButton"
                        onClick={saveCustomCourse}
                    >
                        <span style={{ fontSize: 16 }}>✓</span>
                    </button>
                )}
                <button
                    // style={{ width: "35px" }}
                    className="deleteButton"
                    onClick={
                        !courseDetailString
                            ? deleteCustomCourse
                            : () =>
                                  deleteCustomCourseDatabase(courseDetailString)
                    }
                >
                    x
                </button>
            </div>
        </div>
    );
};
export default CustomCourseRow;
