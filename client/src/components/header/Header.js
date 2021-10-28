import React from "react";
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

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
    }
`;

const termOptions = [
    { label: "Spring 2021", value: 202120 },
    { label: "Summer 2021", value: 202130 },
    { label: "Fall 2021", value: 202210 },
    { label: "Spring 2022", value: 202220 },
];

const formatTerm = (term) =>
    termOptions.filter((termOption) => termOption.value == term)[0];

// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";

function Header() {
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
                            options={termOptions}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Header;
