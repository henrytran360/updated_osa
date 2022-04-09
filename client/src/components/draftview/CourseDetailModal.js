import React, { useEffect, useState } from "react";
import "./CourseDetailModal.css";
import { BsBoxArrowUpRight } from "react-icons/bs";

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
            <div className="closeModalButton">
                <Tooltip className="iconButton" title="Close">
                    <IconButton
                        aria-label="delete"
                        size="small"
                        disableFocusRipple
                        disableRipple
                        onClick={() => closeModal()}
                    >
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <div className="float-container">
                <div className="float-child">
                    <div className="category">
                        <b>{props.time}</b>
                    </div>
                    <div className="category">
                        <b>CRN: </b>
                        {props.crn}
                    </div>
                    <div className="category">
                        <b>Credits: </b>
                        {props.creditsMin}
                    </div>
                    <div className="category">
                        <b>Distribution: </b>
                        {props.distribution}
                    </div>
                    <div className="category">
                        <b>Prerequisites: {props.prereqs}</b>
                    </div>
                    <div className="category">
                        <b>Corequisites: {props.coreqs}</b>
                    </div>
                </div>
                <div className="float-child">
                    <div className="category">
                        <b>Max Enrollment: </b>
                        {props.maxEnrollment}
                    </div>
                    <div className="category">
                        <b>Current Enrollment: {props.enrollment}</b>
                    </div>
                    <div className="category">
                        <b>Max Waitlisted: {props.maxWaitlisted}</b>
                    </div>
                    <div className="category">
                        <b>Waitlisted: {props.waitlisted}</b>
                    </div>
                </div>
            </div>
            <div className="course-instructor">
                <b>Course Instructor: </b>
                {props.instructors}
            </div>
        </div>
    );
};

export default CourseDetailModal;
