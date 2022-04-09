import React, { useEffect, useState } from "react";
import "./CourseDetailModal.css";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { IconButton, Tooltip } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";

const CourseDetailModal = (props) => {
    //props: title, time, crn, creditsMin, distribution,
    //prereqs, coreqs, maxEnrollment, enrollment, maxWaitlisted, waitlisted, instructors
    return (
        <div className="course-info-content">
            <div className="course-title">
                <b>{props.title}</b>
                <a
                    style={{ marginLeft: "1rem" }}
                    href={
                        "https://courses.rice.edu/courses/!SWKSCAT.cat?p_action=COURSE&p_term=" +
                        props.term +
                        "&p_crn=" +
                        props.crn
                    }
                    target="_blank"
                >
                    {" "}
                    <BsBoxArrowUpRight />
                </a>
            </div>
            <div className="float-container">
                <div className="float-child">
                    <div className="category">
                        <b>Time:</b>
                            <span className='detail-content'>
                                {props.time}
                            </span>
                    </div>
                    <div className="category">
                        <b>CRN:</b>
                        <span className='detail-content'>
                            {props.crn}
                        </span>
                    </div>
                    <div className="category">
                        <b>Credits:</b>
                        <span className='detail-content'>
                            {props.creditsMin}
                        </span>
                    </div>
                    <div className="category">
                        <b>Distribution:</b>
                        <span className='detail-content'>
                            {props.distribution}
                        </span>
                    </div>
                    <div className="category">
                        <b>Prerequisites:{" "}</b>
                            <span className='detail-content'>
                                {props.prereqs}
                            </span>
                    </div>
                    <div className="category">
                        <b>Corequisites:</b>
                        <span className='detail-content'> 
                            {props.coreqs}
                        </span>
                    </div>
                </div>
                <div className="float-child">
                    <div className="category">
                        <b>Max Enrollment:</b>
                        <span className='detail-content'> 
                            {props.maxEnrollment}
                        </span>
                    </div>
                    <div className="category">
                        <b>Current Enrollment:{" "}</b>
                            <span className='detail-content'> 
                                {props.enrollment}
                            </span>
                    </div>
                    <div className="category">
                        <b> Max Waitlisted:{" "}</b>
                            <span className='detail-content'> 
                                {props.maxWaitlisted}
                            </span>
                    </div>
                    <div className="category">
                        <b>Waitlisted:</b>
                        <span className='detail-content'> 
                            {props.waitlisted}
                        </span>
                    </div>
                </div>
            </div>
            <div className="course-instructor">
                <b>Course Instructor:</b>
                <span className='detail-content'>
                    {props.instructors}
                </span>
            </div>
        </div>
    );
};

export default CourseDetailModal;
