import React, { useState } from "react";
import "./LeftCourseBox.css";
import Modal from "react-modal";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import { BsBoxArrowUpRight } from 'react-icons/bs';

const createURL = (courseNum, subject) => {
    return `https://courses.rice.edu/courses/courses/!SWKSCAT.cat?p_action=CATALIST&p_acyr_code=2022&p_crse_numb=${courseNum}&p_subj=${subject}`;
};
const GET_LOCAL_DATA = gql`
    query GetLocalData {
        eachCourseModalState @client
        term @client
    }
`;
const LeftCourseBox = (props) => {
    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    let { term } = storeData;

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
    console.log(props);
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
                className="model-info-content"
                onRequestClose={
                    closeModal
                } /*style={{wordWrap: "break-all", whiteSpace: 'unset'}}*/
            >
                <div className="course-info-content">
                    {/* <pre class="text"><b>  Course Instructor:</b> <ul> {props['instructorName'].map((name)=>{
                    <li>{name}</li>
                })} </ul></pre> */}
                    <div className="course-title">
                        {props.subject} {props.courseNum}: {props.longTitle}
                        <a 
                        style={{marginLeft:"1rem"}}
                        href={createURL(props.courseNum, props.subject)} 
                        target="_blank">  
                        <BsBoxArrowUpRight />
                        </a>
                    </div>
                    <pre class="category">
                        <b>DISTRIBUTION: </b> {props.distribution}
                    </pre>
                    <pre class="category">
                        <b>CREDITS: </b> {props.credits}
                    </pre>
                    <pre class="category">
                        <b>PREREQS: </b> {props.prereqs}
                    </pre>
                    <pre class="category">
                        <b>COREQS: </b> {props.coreqs}
                    </pre>
                </div>
            </Modal>
        </div>
    );
};

export default LeftCourseBox;
