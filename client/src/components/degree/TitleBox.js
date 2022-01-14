import React from "react";
import LeftTitleBox from "./LeftTitleBox";
import RightTitleBox from "./RightTitleBox";
import "./RowBox.css";
import SemesterBox from "./SemesterBox";

const TitleBox = (props) => {
    let convertNumToSem = props["term"].substring(4);

    if (convertNumToSem === "10") {
        convertNumToSem = "Fall Semester";
    } else if (convertNumToSem === "20") {
        convertNumToSem = "Spring Semester";
    } else {
        convertNumToSem = "Summer Semester";
    }
    return (
        <div className="rowBox">
            <LeftTitleBox
                year={props.term.substring(0, 4)}
                semester={convertNumToSem}
                selector={props.selector}
            />
            <RightTitleBox credits={props["credits"]} />
        </div>
    );
};

export default TitleBox;
