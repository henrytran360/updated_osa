import React, { useState, useEffect } from "react";
import Title from "./Title";
import LoginButton from "../login/LoginButton";
import { Button } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import ReactGA from "react-ga";
import { useMediaQuery } from "react-responsive";
import RiceAppsLogo from "../../riceappslogo.png";
import { initGA, OutboundLink } from "../../utils/analytics";
import { useHistory, useLocation } from "react-router";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import "./Header.global.css";
// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";
// These imports load individual services into the firebase namespace.
import "firebase/auth";
// const termOptions = [
//     { label: "Spring 2021", value: 202120 },
//     { label: "Fall 2021", value: 202110 },
// ];
function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}
function Header() {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const history = useHistory();
    const location = useLocation();
    // Where we collect feedback
    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-device-width: 608px)",
    });
    let feedbackURL = "https://forms.gle/gSJp5Dy9a2WH7Nk1A";
    // This initializes Google Analytics
    initGA();
    // Redirects people to our Medium page on a new page if they click our logo to learn more about us
    const handleLogoClick = () => {
        OutboundLink(
            "Clicked Logo.",
            window.open("https://medium.com/riceapps", "_blank")
        );
    };
    return (
        <div className="headerContainer">
            {/* <div className="logoContainer">
                <img
                    src={RiceAppsLogo}
                    style={{ minWidth: 75 }}//added due to Degree Plan Button
                    // style={styles.logo}
                    onClick={() => handleLogoClick()}
                />
            </div> */}
            {/* <div className="titleContainer">
                <Title />
            </div> */}
            <div className="buttonsContainer">
                <div className="titleContainer">
                    <Title />
                </div>
                <div className="leftAlign">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="nav tabs"
                    >
                        <LinkTab
                            label="Schedule"
                            onClick={() => history.push("/schedule")}
                        />
                        <LinkTab
                            label="Degree Plan"
                            onClick={() => history.push("/degree_plan")}
                        />
                        <LinkTab
                            label="About"
                            onClick={() => history.push("/about")}
                        />
                        <LinkTab
                            label="Feedback"
                            onClick={() => window.open(feedbackURL, "_blank")}
                        />
                    </Tabs>
                </div>
                <div className="rightAlign">
                    {/* <Button
                        variant="outlined"
                        onClick={() => handleLogoClick()}
                    >
                        <img
                            src={RiceAppsLogo}
                            style={{ minWidth: 75 }}//added due to Degree Plan Button
                        // style={styles.logo}
                        />
                    </Button> */}
                    <LoginButton></LoginButton>
                </div>
            </div>
        </div>
    );
}
export default Header;
