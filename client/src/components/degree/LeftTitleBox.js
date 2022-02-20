import React, { useContext, useEffect } from "react";
import "./LeftTitleBox.css";
import { useState } from "react";
import { Context as TermContext } from "../../contexts/termContext";
import TermName from "../../constants/TermName";

const LeftTitleBox = (props) => {
    // for the drop-down box for semester selection
    const { getTerm } = useContext(TermContext);
    // 2022 and Spring are the current year default value
    const [year, setYear] = useState(2022);
    const [sem, setSem] = useState("Spring");
    const saveSelections = (e) => {
        setYear(e.target.value);
        setSem(e.target.value);
    };
    useEffect(() => {
        if (year && sem) {
            let curTerm = `${year}${TermName.get(sem)}`;
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
                                      <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                    </select>
                                
                    <select
                        name="sem"
                        id="s"
                        className="semesterSelect"
                        onChange={(e) => setSem(e.target.value)}
                    >
                                        <option value="Fall">Fall</option>
                                        <option value="Spring">Spring</option>
                                        <option value="Summer">Summer</option>
                                        <option value="Winter">Winter</option>
                                    
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
