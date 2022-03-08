import React from "react";
import Header from "../header/Header";
import { students } from "./students";
import blankPhoto from "../../assets/images/blankPhoto.jpg";
import Fade from "react-reveal/Fade";

import "./About.global.css";

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

function About() {
    return (<><Header/>
        <div className = "container">
            <div className="aboutHeader aboutContainer" style = {{padding: "0 20px"}}>
                <h1>about us!</h1>
                <p>
                    an ambitious team of students from{" "}
                    <a href="https://medium.com/riceapps" target="_blank">
                        <b>riceapps</b>
                    </a>{" "}
                    that set out to build a course scheduler for the students,
                    by the students.
                </p>
            </div>
            {students.map((team, idx) => (
                <div className={idx % 2 == 0 && "backgroundColor"} style = {{padding: "0 20px"}}>
                    <div className="aboutContainer">
                        <h3>{team.team}</h3>
                        <div className="aboutProfiles">
                            {team.people.map((student) => (
                                <Fade bottom>
                                    <div className="profile">
                                        <img
                                            height={"100%"}
                                            src={
                                                student.photo
                                                    ? student.photo
                                                    : blankPhoto
                                            }
                                        />
                                        <div className="profileText">
                                            <p className="profileName">
                                                {student.name}
                                            </p>
                                            <p className="profileTitle">
                                                {student.title}
                                            </p>
                                        </div>
                                    </div>
                                </Fade>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div></>
    );
}

export default About;
