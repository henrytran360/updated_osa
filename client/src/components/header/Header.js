import React, { useState, useEffect, useContext } from "react";
import Title from "./Title";
import LoginButton from "../login/LoginButton";
import { Button, ButtonGroup, IconButton } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import ReactGA from "react-ga";
import { useMediaQuery } from "react-responsive";
import RiceAppsLogo from "../../riceappslogo.png";
import { initGA, OutboundLink } from "../../utils/analytics";
import { useHistory, useLocation } from "react-router";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import ListIcon from "@material-ui/icons/List";
import SearchIcon from "@mui/icons-material/Search";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Context as BottomModeContext } from "../../contexts/bottomModeContext";

import "./Header.global.css";
// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";
// These imports load individual services into the firebase namespace.
import "firebase/auth";
import SemesterSelect from "../draftview/SemesterSelect";

const useStyles = makeStyles({
    button: {
        color: "#1DC2C4",
        fontSize: 15,
    },
});

// const termOptions = [
//     { label: "Spring 2021", value: 202120 },
//     { label: "Summer 2021", value: 202130 },
//     { label: "Fall 2021", value: 202210 },
//     { label: "Spring 2022", value: 202220 },
// ];

// const formatTerm = (term) =>
//     termOptions.filter((termOption) => termOption.value == term)[0];

// This import loads the firebase namespace along with all its type information.
// const termOptions = [
//     { label: "Spring 2021", value: 202120 },
//     { label: "Fall 2021", value: 202110 },
// ];
function LinkTab(props) {
    return (
        <StyledTab
            component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            value={props.value}
            {...props}
        />
    );
}

const StyledTab = withStyles((theme) => ({
    root: {
        textTransform: "none",
        color: "#1DC2C4",
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        height: "100%",
        width: 100,
    },
}))((props) => <Tab {...props} />);

function Header() {
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const history = useHistory();
    const {
        state: { bottomMode2 },
        changeBottomMode,
    } = useContext(BottomModeContext);

    const handleClick = (e) => {
        if (bottomMode2) {
            changeBottomMode("");
        } else {
            changeBottomMode(e.currentTarget.value);
        }
    };

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
    const renderIcons = () => {
        const icons = [
            <SearchOutlinedIcon />,
            <DateRangeOutlinedIcon />,
            <ListIcon />,
        ];
        const values = ["Search", "Calendar", "Details"];

        return icons.map((icon, index) => (
            <IconButton
                className={classes.button}
                size="small"
                onClick={handleClick}
                value={values[index]}
                style={{
                    backgroundColor:
                        bottomMode2 != values[index] ? "#BBECED" : "",
                }}
            >
                {icon}
            </IconButton>
        ));
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
            <div className="titleContainer">
                <Title />
            </div>
            <div className="leftAlign">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    TabIndicatorProps={{
                        style: { backgroundColor: "#1DC2C4" },
                    }}
                    tabItemContainerStyle={{ width: 50 }}
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
            <div className="buttonSelect">{renderIcons()}</div>
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
            <SemesterSelect></SemesterSelect>

            <LoginButton></LoginButton>
        </div>
    );
}
export default Header;
