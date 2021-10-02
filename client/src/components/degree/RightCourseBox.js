import React from 'react';
import './RightCourseBox.css'

const RightCourseBox = (props) => {
    return (
        <div className='rcbox'>
            <div className='courseCredit'>{props["credits"]}</div>
        </div>
    )
}

export default RightCourseBox
