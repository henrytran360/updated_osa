import React from "react";
import "./RightTitleBox.css";
import { creditSum } from "./SemesterBox";

const RightTitleBox = (props) => {
    return (
        <div className="rtbox">
            <div className="totalCredit">
                {props.credits ? props.credits : "0"} credits
            </div>
        </div>
    );
};

export default RightTitleBox;
