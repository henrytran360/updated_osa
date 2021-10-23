import React, { useState } from 'react';
import './LeftCourseBox.css'
import Modal from 'react-modal';

const createURL = (courseNum, subject) =>{
    return `https://courses.rice.edu/courses/courses/!SWKSCAT.cat?p_action=CATALIST&p_acyr_code=2022&p_crse_numb=${courseNum}&p_subj=${subject}`
}

const LeftCourseBox = (props) => {

    //for the course info modal
    const [modalState, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    }
    const closeModal = () => {
        setModal(false);
    }

    let prereqs = props["prereqs"]
    let coreqs = props["coreqs"]

    if (prereqs === undefined || prereqs.length == 0) prereqs = "None";
    if (coreqs === undefined || coreqs.length == 0) coreqs = "None";

    return (
        <div>
        <div className='lcbox'>
            <div className='courseCode'>{props.subject} {props.courseNum}</div>
            <a href="#" className='courseName' onClick={openModal}>{props.longTitle}</a>
        </div>

        <Modal isOpen={modalState} className='modal' onRequestClose={closeModal} /*style={{wordWrap: "break-all", whiteSpace: 'unset'}}*/
>
            <div className='courseInfoContent'>
            <div>
                {/* <pre class="text"><b>  Course Instructor:</b> <ul> {props['instructorName'].map((name)=>{
                    <li>{name}</li>
                })} </ul></pre> */}
                <pre class="text"><b>Course Instructor:</b> {props['instructorFN']} {props['instructorLN']}</pre>
                <pre class="text"><b>Max Enrollment:   </b> {props["maxEnrollment"]}</pre>
                <pre class="text"><b>Prerequisites:    </b> {prereqs}</pre>
                <pre class="text"><b>Corerequisites:   </b> {coreqs}</pre>
                <pre class="text"><b>Corerequisites:   </b> {coreqs}</pre>
                <pre class="text"><a style={{textDecoration: "underline", fontWeight: 900, color: "#12B0B2"}} href={createURL(props.courseNum, props.subject)} target="_blank">More Info</a></pre>
            </div>
            </div>
        </Modal>
        </div>
    )
}

export default LeftCourseBox
