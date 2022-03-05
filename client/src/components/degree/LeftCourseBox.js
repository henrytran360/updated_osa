import React, { useState } from "react";
import "./LeftCourseBox.css";
import Modal from "react-modal";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";

const createURL = (courseNum, subject) => {
    return `https://courses.rice.edu/courses/courses/!SWKSCAT.cat?p_action=CATALIST&p_acyr_code=2022&p_crse_numb=${courseNum}&p_subj=${subject}`;
};
const GET_LOCAL_DATA = gql`
    query GetLocalData {
        eachCourseModalState @client
    }
`;
const LeftCourseBox = (props) => {
    const client = useApolloClient();
    //for the course info modal
    const [modalState, setModal] = useState(false);
    const openModal = () => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: {
                eachCourseModalState: true,
            },
        });
        setModal(true);
    };
    const closeModal = () => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: {
                eachCourseModalState: false,
            },
        });
        setModal(false);
    };

    let prereqs = props["prereqs"];
    let coreqs = props["coreqs"];

    if (prereqs === undefined || prereqs.length == 0) prereqs = "None";
    if (coreqs === undefined || coreqs.length == 0) coreqs = "None";

    return (
        <div className="lcbox">
            <div className="courseCode">
                {props.subject} {props.courseNum}
            </div>
            <a href="#" className="courseName" onClick={openModal}>
                {props.longTitle}
            </a>
            <Modal
                isOpen={modalState}
                className="modal"
                onRequestClose={
                    closeModal
                } /*style={{wordWrap: "break-all", whiteSpace: 'unset'}}*/
            >
                <div className="courseInfoContent">
                    {/* <pre class="text"><b>  Course Instructor:</b> <ul> {props['instructorName'].map((name)=>{
                    <li>{name}</li>
                })} </ul></pre> */}
                    <pre class="text">
                        <b>COURSE CODE:</b> {props.subject} {props.courseNum}
                    </pre>
                    <pre class="text">
                        <b>TITLE: </b> {props.longTitle}
                    </pre>
                    <pre class="text">
                        <b>DISTRIBUTION: </b> {props.distribution}
                    </pre>
                    <pre class="text">
                        <b>CREDITS: </b> {props.credits}
                    </pre>
                    <pre class="text">
                        <b>PREREQS: </b> {props.prereqs}
                    </pre>
                    <pre class="text">
                        <a
                            style={{
                                textDecoration: "underline",
                                fontWeight: 900,
                                color: "var(--link-color)",
                            }}
                            href={createURL(props.courseNum, props.subject)}
                            target="_blank"
                        >
                            MORE INFO
                        </a>
                    </pre>
                </div>
            </Modal>
        </div>
    );
};

export default LeftCourseBox;
