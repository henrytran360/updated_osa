import React from 'react';
import './RowBox.css';
import LeftCourseBox from './LeftCourseBox';
import RightCourseBox from './RightCourseBox';

const CourseRowBox = (props) => {
    return (
        <div className='rowBox'>
            <LeftCourseBox  courseNum     = {props["courseNum"]} 
                            longTitle     = {props["longTitle"]} 
                            subject       = {props["subject"]}
                            // instructorName  = {props["instructorName"]}
                            instructorFN  = {props["instructorFN"]}
                            instructorLN  = {props["instructorLN"]}
                            prereqs       = {props["prereqs"]}
                            coreqs        = {props["coreqs"]}
                            maxEnrollment = {props["maxEnrollment"]}/>
            <RightCourseBox credits       = {props["credits"]}/>
        </div>
    )
}

export default CourseRowBox

