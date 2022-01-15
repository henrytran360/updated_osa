import React from "react";
import Header from "../header/Header";

import "./About.global.css";

//const blankPhoto = "https://scontent-dfw5-2.xx.fbcdn.net/v/t1.30497-1/c379.0.1290.1290a/84241059_189132118950875_4138507100605120512_n.jpg?_nc_cat=1&ccb=2&_nc_sid=dbb9e7&_nc_ohc=JZ6331lCrccAX-UjApl&_nc_ht=scontent-dfw5-2.xx&oh=bcba58b01e0c04bcafeb8a4edd4105fe&oe=5FC4C338"
const blankPhoto = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"

function About() {
    const students = [
        { 
            name: "Will Mundy",
            title: "Team Lead / Lead Developer",
            description: "alksjdflk",
            //photo: "https://scontent-dfw5-1.xx.fbcdn.net/v/t31.0-8/18237992_1752137914802093_4256050763973513196_o.jpg?_nc_cat=111&ccb=2&_nc_sid=85a577&_nc_ohc=FyPCDTRM4O8AX_XNtOt&_nc_ht=scontent-dfw5-1.xx&oh=e1eae5dd85d38c91bb0101cad9eb3de4&oe=5FC527A5",
            position: 0,
        },
        { 
            name: "Jamie Tan",
            title: "RiceApps 2020-21 Team Lead",
            description: "",
            position: 2.5
        },
        { 
            name: "Peter (Donglin) Wang",
            title: "RiceApps 2020-21 Developer",
            description: "",
            position: 3
        },
        { 
            name: "David Torres",
            title: "RiceApps 2020-21 Developer",
            description: "",
            //photo: "https://scontent-dfw5-2.xx.fbcdn.net/v/t1.0-9/81507831_2474473202803948_5064219217436344320_n.jpg?_nc_cat=109&ccb=2&_nc_sid=85a577&_nc_ohc=oeGvzwNUWU4AX8JAOD9&_nc_ht=scontent-dfw5-2.xx&oh=c667bcbfadc6aa26ebb070eb1aa7fbb4&oe=5FC5A832",
            position: 3
        },
        { 
            name: "Manan Bajaj",
            title: "RiceApps 2020-21 Developer",
            description: "",
            position: 3
        },
        { 
            name: "Max Bowman",
            title: "RiceApps 2020-21 Developer",
            description: "",
            position: 3
        },
        { 
            name: "Cloris Cai",
            title: "Lead Designer",
            description: "",
            //photo: "https://scontent-dfw5-1.xx.fbcdn.net/v/t1.0-9/118318717_2846233512277901_7685803944755894564_n.jpg?_nc_cat=101&ccb=2&_nc_sid=85a577&_nc_ohc=RKzjVWOi0pIAX8piLSq&_nc_ht=scontent-dfw5-1.xx&oh=5f0eaffb39d4d761f61f66443e107e31&oe=5FC70319",
            position: 1
        },
        { 
            name: "Arthur Chen",
            title: "RiceApps OSA 2020 Mentor",
            description: "",
            photo: "https://ca.slack-edge.com/T3MJYNGAY-U014293JQLD-dfee0f641159-512",
            position: 2
        },
        { 
            name: "Luis Clague",
            title: "RiceApps OSA 2020 Mentor",
            description: "",
            photo: "https://ca.slack-edge.com/T3MJYNGAY-U0143EVPCG1-4fda0126f491-512",
            position: 2
        },
        { 
            name: "Adrienne Li",
            title: "RiceApps OSA 2020 Contributor",
            description: "",
            photo: "https://ca.slack-edge.com/T3MJYNGAY-U014VGZKNF2-f8a7c954cc5f-512",
            position: 1
        },
        { 
            name: "Angela Zhang",
            title: "RiceApps OSA 2020 Contributor",
            description: "",
            //photo: "https://scontent-dfw5-1.xx.fbcdn.net/v/t1.0-1/103734047_1146683132365678_7978251794539380359_o.jpg?_nc_cat=105&ccb=2&_nc_sid=dbb9e7&_nc_ohc=cfgyLNE-XMwAX_DNThV&_nc_ht=scontent-dfw5-1.xx&oh=6742c7e2063bb0402d3660904272d2ba&oe=5FC44690",
            position: 1
        },
        { 
            name: "Yanyu Zhong",
            title: "RiceApps OSA 2020 Contributor",
            description: "",
            photo: "https://ca.slack-edge.com/T3MJYNGAY-U01462JCMPC-e5a80ae95ae8-512",
            position: 1
        },
        { 
            name: "Ananya Vaidya",
            title: "RiceApps OSA 2020 Contributor",
            description: "",
            //photo: "https://scontent-dfw5-2.xx.fbcdn.net/v/t1.0-1/56592007_835473243473659_1247818484889419776_n.jpg?_nc_cat=100&ccb=2&_nc_sid=dbb9e7&_nc_ohc=D1SLzzTBaToAX97sPBx&_nc_ht=scontent-dfw5-2.xx&oh=c1754ade2235401118cfe9c3f561461f&oe=5FC5509C",
            position: 1
        },
        { 
            name: "Thushar Mahesh",
            title: "RiceApps OSA 2020 Contributor",
            description: "",
            photo: "https://ca.slack-edge.com/T3MJYNGAY-U014C4SGQAY-4ab8824bdb07-512",
            position: 1
        },
    ];

    return (
        <div className="aboutContainer">
            <Header />
            <h2>about us</h2>
            <p>an ambitious team of students from <b>riceapps</b> that set out to build a course scheduler for the students, by the students.</p>
            <div className="aboutProfiles">
                {students.sort((studentA, studentB) => studentA.position - studentB.position).map(student => (
                    <div className="profile">
                        <img height={"100%"} src={student.photo ? student.photo : blankPhoto} />
                        <p className="profileName">{student.name}</p>
                        <p className="profileTitle">{student.title}</p>
                        {/* <p className="profileDesc">{student.description}</p> */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default About;