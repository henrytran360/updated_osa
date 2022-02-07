import React, { useState, useEffect, useContext } from "react";
import Title from "./Title";
import LoginButton from "../login/LoginButton";
import { Button, ButtonGroup, IconButton } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { useMediaQuery } from "react-responsive";
import { initGA, OutboundLink } from "../../utils/analytics";
import { useHistory, useLocation } from "react-router";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import ListIcon from "@material-ui/icons/List";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Context as BottomModeContext } from "../../contexts/bottomModeContext";
import Modal from "react-modal";
import { RiDeleteBinLine } from "react-icons/ri";
import { GoDiffAdded } from "react-icons/go";
import { AiOutlineEdit } from "react-icons/ai";

import "./Header.global.css";
// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";
// These imports load individual services into the firebase namespace.
import "firebase/auth";
import SemesterSelect from "../draftview/SemesterSelect";
import DegreePlanSelect from "../draftview/DegreePlanSelect";
import { flexbox } from "@mui/system";

const useStyles = makeStyles({
    button: {
        color: "#1DC2C4",
        fontSize: 15,
    },
    button2: {
        color: "#1DC2C4",
        border: "1px solid #BBECED",
        width: 150,
    },
});

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
    const location = useLocation();

    const [modalState, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
    };

    const [inputName, setInputName] = useState("");
    const [degreeName, setDegreeName] = useState("");
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            setDegreeName(inputName);
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
                    {/* <LinkTab
                        label="Feedback"
                        onClick={() => window.open(feedbackURL, "_blank")}
                    /> */}
                </Tabs>
            </div>
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
            {location.pathname == "/schedule" ? (
                <>
                    <SemesterSelect></SemesterSelect>
                    <div className="buttonSelect">{renderIcons()}</div>
                </>
            ) : (
                <div
                    style={{
                        width: "30%",
                        height: "100%",
                        marginRight: 50,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                    }}
                >
                    <div style={{ width: "65%", height: "100%" }}>
                        <DegreePlanSelect></DegreePlanSelect>
                    </div>
                    <div
                        style={{
                            width: "35%",
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <RiDeleteBinLine />
                        </div>

                        <div>
                            <GoDiffAdded />
                        </div>
                        <div>
                            <AiOutlineEdit />
                        </div>
                        {/* <Button
                            style={{
                                color: "#1DC2C4",
                                border: "1px solid 1DC2C4",
                            }}
                            className={classes.button2}
                            variant="outlined"
                            onClick={() => setModal(true)}
                        >
                            {" "}
                            Add Plans
                        </Button>
                        <Modal
                            isOpen={modalState}
                            className="modalDegreePlanHeader"
                            onRequestClose={closeModal}
                            ariaHideApp={false}
                        >
                            <div>
                                <div>Create a new Degree Plan</div>
                                <input
                                    type="text"
                                    className="header-search"
                                    placeholder="Search courses"
                                    name="s"
                                    value={inputName}
                                    onChange={(e) =>
                                        setInputName(e.target.value)
                                    }
                                    onKeyUp={handleKeyPress}
                                />
                            </div>
                        </Modal> */}
                    </div>
                </div>
            )}

            <LoginButton></LoginButton>
        </div>
    );
}
export default Header;
