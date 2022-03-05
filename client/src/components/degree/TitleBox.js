import React from "react";
import LeftTitleBox from "./LeftTitleBox";
import RightTitleBox from "./RightTitleBox";
import "./RowBox.css";
import SemesterBox from "./SemesterBox";
import TermNumber from "../../constants/TermNumber";

const TitleBox = (props) => {
    let convertNumToSem = TermNumber.get(props["term"].substring(4));
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
