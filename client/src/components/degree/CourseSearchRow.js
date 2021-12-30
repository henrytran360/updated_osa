import React from "react";
import "./CourseSearchRow.css";

const CourseSearchRow = ({ course }) => {
    return (
        <div className="row-container">
            <div className="name">
                <div>
                    <span
                        style={{ fontSize: "1rem", color: "rgb(54, 54, 54)" }}
                    >
                        {course.subject} {course.courseNum}
                    </span>
                </div>
                <div>
                    <span
                        style={{
                            fontSize: "0.7em",
                            color: "rgb(136, 136, 136)",
                        }}
                    >
                        {course.longTitle}
                    </span>
                </div>
            </div>
            <div className="credits">{course.creditsMin}</div>
            <div className="distribution">
                {course.distribution ? course.distribution.split(" ")[1] : "-"}
            </div>
            <div className="checkbox">
                <button
                    // style={{ width: "35px" }}
                    className="deleteButtonEachCourse"
                >
                    <span style={{ fontSize: 16 }}>✓</span>
                </button>
            </div>
        </div>
    );
};

export default CourseSearchRow;
