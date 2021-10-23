import React, { useState, useEffect } from "react";
import Title from "./Title";
import { Button } from "@material-ui/core";
import ReactGA from "react-ga";
import { useMediaQuery } from "react-responsive";

import RiceAppsLogo from "../../riceappslogo.png";
import { initGA, OutboundLink } from "../../utils/analytics";
import { useHistory, useLocation } from "react-router";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import Select from "react-select";

import "./Header.global.css";

// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
    }
`;

const QUERY_USER_SCHEDULES = gql`
    query scheduleMany {
        scheduleMany {
            _id
            term
        }
    }
`;

// const termOptions = [
//     { label: "Spring 2021", value: 202120 },
//     { label: "Fall 2021", value: 202110 },
// ];

function Header() {
    const [updateSchedules, setUpdatedSchedules] = useState([]);

    const { loading, error, data } = useQuery(QUERY_USER_SCHEDULES);

    useEffect(() => {
        let tempSchedules = [];
        if (!loading) {
            console.log(data);
        }
        for (let i = 0; i < data?.scheduleMany.length; i++) {
            let label;
            let value = data?.scheduleMany[i]["term"];

            if (value.substring(4) == "10")
                label = "Fall " + value.substring(0, 4);
            else if (value.substring(4) == "20")
                label = "Spring " + value.substring(0, 4);
            else if (value.substring(4) == "30")
                label = "Summer " + value.substring(0, 4);
            else if (
                value.includes("Spring") ||
                value.includes("Fall") ||
                value.includes("Summer")
            ) {
                label = value;
                if (value.includes("Spring"))
                    value = value.substring(value.indexOf("2")) + "20";
                else if (value.includes("Fall"))
                    value = value.substring(value.indexOf("2")) + "10";
                else if (value.includes("Summer"))
                    value = value.substring(value.indexOf("2")) + "30";
            } else continue;

            tempSchedules.push({ label: label, value: parseInt(value) });
        }

        setUpdatedSchedules(tempSchedules);
    }, [loading, data, error]);

    console.log("updatedschdules", updateSchedules);

    const formatTerm = (schedule) =>
        updateSchedules.filter((termOption) => termOption.value == schedule)[0];

    const history = useHistory();
    const client = useApolloClient();
    const location = useLocation();

    // Get the term
    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    let { term } = storeData;

    // Where we collect feedback

    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-device-width: 608px)",
    });

    let feedbackURL = "https://forms.gle/gSJp5Dy9a2WH7Nk1A";
    let logoutURL = "https://idp.rice.edu/idp/profile/cas/logout";

    // This initializes Google Analytics
    initGA();

    // Redirects people to our Medium page on a new page if they click our logo to learn more about us
    const handleLogoClick = () => {
        OutboundLink(
            "Clicked Logo.",
            window.open("https://medium.com/riceapps", "_blank")
        );
    };
    const handleLogoutClick = async () => {
        // Sign out of firebase first
        await firebase.auth().signOut();
        // Sign out of IDP too
        window.open(logoutURL, "_self");
    };
    const handleTermChange = (newTermObject) =>
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: { term: newTermObject.value },
        });

    return (
        <div className="headerContainer">
            <div className="logoContainer">
                <img
                    src={RiceAppsLogo}
                    style={{ minWidth: 75 }} //added due to Degree Plan Button
                    // style={styles.logo}
                    onClick={() => handleLogoClick()}
                />
            </div>
            <div className="titleContainer">
                <Title />
            </div>
            <div className="buttonsContainer">
                <Button
                    variant="outlined"
                    onClick={() =>
                        location.pathname == "/about"
                            ? history.push("/schedule")
                            : history.push("/about")
                    }
                >
                    {location.pathname == "/about" ? "Schedule" : "About"}
                </Button>

                <Button
                    variant="outlined"
                    style={{ minWidth: 150 }}
                    onClick={() =>
                        location.pathname == "/degree_plan"
                            ? history.push("/schedule")
                            : history.push("/degree_plan")
                    }
                >
                    {location.pathname == "/degree_plan"
                        ? "Schedule"
                        : "Degree Plan"}
                </Button>

                <Button variant="outlined" onClick={() => handleLogoutClick()}>
                    Log Out
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => window.open(feedbackURL, "_blank")}
                >
                    Feedback?
                </Button>
                {location.pathname == "/schedule" ? (
                    <div className="select">
                        <Select
                            value={formatTerm(term)}
                            onChange={handleTermChange}
                            options={updateSchedules}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Header;
