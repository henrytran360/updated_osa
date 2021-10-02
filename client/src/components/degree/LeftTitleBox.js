import React, { useContext, useEffect } from "react";
import "./LeftTitleBox.css";
import { useState } from "react";
import { Context as TermContext } from "../../contexts/termContext";

const LeftTitleBox = (props) => {
    // for the drop-down box for semester selection
    const { getTerm } = useContext(TermContext);
    // 2021 and Fall are the current year default value
    const [year, setYear] = useState(2021);
    const [sem, setSem] = useState("Fall");
    const saveSelections = (e) => {
        setYear(e.target.value);
        setSem(e.target.value);
    };

    useEffect(() => {
        if (year && sem) {
            let curTerm = `${year}${sem == "Fall" ? "10" : "20"}`;
            getTerm(curTerm);
        }
    }, [year, sem]);

    return (
        <div className="ltbox">
            {!props.selector ? (
                <>
                    <div className="year">{props.year}</div>
                    <div className="semester">{props.semester}</div>
                </>
            ) : (
                <>
                    <select
                        name="year"
                        id="y"
                        className="yearSelect"
                        onChange={(e) => setYear(e.target.value)}
                    >
                                      <option value="2021">2021</option>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                    </select>
                                
                    <select
                        name="sem"
                        id="s"
                        className="semesterSelect"
                        onChange={(e) => setSem(e.target.value)}
                    >
                                        <option value="Fall">Fall</option>
                                        <option value="Spring">Spring</option>
                                    
                    </select>
                                
                    {/* <button onClick={saveSelections} className="saveBtn">
                        Save
                    </button> */}
                </>
            )}
                    
        </div>
    );
};

export default LeftTitleBox;
