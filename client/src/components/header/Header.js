import React, { useState, useEffect, useContext } from "react";
import Title from "./Title";
import { Button, ButtonGroup, IconButton } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Box from "@material-ui/core/Box";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery } from "react-responsive";
import { initGA, OutboundLink } from "../../utils/analytics";
import { useHistory, useLocation } from "react-router";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import ListIcon from "@material-ui/icons/List";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Context as BottomModeContext } from "../../contexts/bottomModeContext";
import SettingsModal from "./SettingsModal";
import ThemeToggle from "./ThemeToggle";
import Modal from "react-modal";
import { RiDeleteBinLine } from "react-icons/ri";
import { GoDiffAdded } from "react-icons/go";
import { AiOutlineEdit } from "react-icons/ai";
import { Context as EmailContext } from "../../contexts/userEmailContext"

import "./Header.global.css";
// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";
// These imports load individual services into the firebase namespace.
import "firebase/auth";
import SemesterSelect from "../draftview/SemesterSelect";
import DegreePlanSelect from "../draftview/DegreePlanSelect";
import { flexbox } from "@mui/system";
import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import DeleteModal from "./DeleteModal";

const useStyles = makeStyles({
    button: {
        color: "var(--search-background-focused)",
        fontSize: 15,
    },
    button2: {
        color: "var(--search-background-focused)",
        border: "1px solid var(--border-color)",
        width: 150,
    },
    button3: {
        color: "var(--search-background-focused)",
        border: "1px solid var(--search-background-focused)",
        width: 80,
    },
    button4: {
        height: 50,
        color: "red",
        border: "1px solid red",
    },
    button5: {
        height: 50,
        color: "var(--search-background-focused)",
        border: "1px solid var(--search-background-focused)",
    },
});

const QUERY_USER_DEGREE_PLAN_LIST = gql`
    query QUERY_ALL_USER_DEGREE_PLANS_LIST($_id: ID!) {
        findAllDegreePlansListForUsers(_id: $_id) {
            _id
            name
            user {
                firstName
            }
        }
    }
`;

const REMOVE_DEGREE_PLAN = gql`
    mutation removeDegreePlanParent($_id: MongoID) {
        removeDegreePlanParent(filter: { _id: $_id }) {
            name
            _id
        }
    }
`;

const ADD_DEGREE_PLAN = gql`
    mutation createNewDegreePlanList($name: String) {
        createNewDegreePlanList(record: { name: $name }) {
            name
            user {
                firstName
            }
            _id
        }
    }
`;

const UPDATE_DEGREE_PLAN_NAME = gql`
    mutation updateDegreePlanParentName($name: String, $_id: MongoID) {
        updateDegreePlanParentName(
            record: { name: $name }
            filter: { _id: $_id }
        ) {
            name
            _id
        }
    }
`;

const VERIFY_TOKEN = gql`
    query VerifyToken {
        verifyToken {
            _id
            firstName
            lastName
            netid
            majors
            college
            affiliation
            token
        }
    }
`;

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
        recentUpdate @client
        degreeplanparent @client
        degreeplanname @client
        degreeplanlist @client
        evalModalState @client
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
        color: "var(--search-background-focused)",
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        height: "100%",
        width: 100,
    },
}))((props) => <Tab {...props} />);

const NavBarItem = {
    "/schedule": 0,
    "/degree_plan": 1,
    "/about": 2,
};

function Header() {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme'));
    const {
        state: { email },
        getEmail,
    } = useContext(EmailContext)
    const location = useLocation();
    const history = useHistory();
    const [value, setValue] = useState(NavBarItem[location.pathname]);
    const classes = useStyles();
    const handleChange = (e, newValue) => {
        setValue(newValue);
    }
    const navigateTo = (pathname) => {
        history.push(pathname);
        handleChange(NavBarItem[pathname]);
    };
    const {
        state: { bottomMode2 },
        changeBottomMode,
    } = useContext(BottomModeContext);
    const handleClick = (e) => {
        if (e.currentTarget.value == "Search") {
            changeBottomMode({ ...bottomMode2, Search: !bottomMode2.Search });
        } else if (e.currentTarget.value == "Calendar") {
            changeBottomMode({
                ...bottomMode2,
                Calendar: !bottomMode2.Calendar,
            });
        } else {
            changeBottomMode({ ...bottomMode2, Details: !bottomMode2.Details });
        }
    };
    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    let { degreeplanparent, degreeplanlist, evalModalState } = storeData;

    const [addDegreePlan, { loadingMutation1, errorMutation1, dataMutation1 }] =
        useMutation(ADD_DEGREE_PLAN, {
            refetchQueries: () => [
                {
                    query: QUERY_USER_DEGREE_PLAN_LIST,
                    variables: {
                        _id: userId,
                    },
                },
            ],
        });
    const [
        mutateDegreePlan,
        { loadingMutation2, errorMutation2, dataMutation2 },
    ] = useMutation(UPDATE_DEGREE_PLAN_NAME, {
        refetchQueries: () => [
            {
                query: QUERY_USER_DEGREE_PLAN_LIST,
                variables: {
                    _id: userId,
                },
            },
        ],
    });

    const [
        deleteDegreePlan,
        { loadingMutation3, errorMutation3, dataMutation3 },
    ] = useMutation(REMOVE_DEGREE_PLAN, {
        refetchQueries: () => [
            {
                query: QUERY_USER_DEGREE_PLAN_LIST,
                variables: {
                    _id: userId,
                },
            },
        ],
    });

    //modal 1: add new degree plan
    const [modalState, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
    };

    //modal 2: edit current degree plan
    const [modalState2, setModal2] = useState(false);
    const openModal2 = () => {
        setModal2(true);
    };

    const closeModal2 = () => {
        setModal2(false);
    };

    //modal 3: remove current degree plan
    const [modalState3, setModal3] = useState(false);
    const openModal3 = () => {
        setModal3(true);
    };

    const closeModal3 = () => {
        setModal3(false);
    };

    const client = useApolloClient();

    // Where we collect feedback
    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-device-width: 608px)",
    });
    // This initializes Google Analytics
    initGA();
    const renderIcons = () => {
        const icons = [
            <SearchOutlinedIcon />,
            <DateRangeOutlinedIcon />,
            <ListIcon />,
        ];
        const values = ["Search", "Calendar", "Details"];

        return icons.map((icon, index) => (
            <div
                className={`icon-container-2${bottomMode2[`${values[index]}`] ? "-color" : ""
                    }`}
                key={index}
            >
                <IconButton
                    className={classes.button}
                    size="small"
                    onClick={handleClick}
                    value={values[index]}
                    style={{
                        textDecoration: "none",
                    }}
                >
                    {icon}
                </IconButton>
            </div>
        ));
    };
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    console.log("VALUEEEE:", value);

    return (
        <div className="headerContainer">
            <Box
                sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
                className="justifyItems"
            >
                <div className="titleContainer">
                    <Title />
                </div>
                <div className="leftAlign">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        TabIndicatorProps={{
                            style: {
                                backgroundColor:
                                    "var(--search-background-focused)",
                            },
                        }}
                        aria-label="nav tabs"
                    >
                        <LinkTab
                            label="Schedule"
                            onClick={() => navigateTo("/schedule")}
                        />
                        <LinkTab
                            label="Degree Plan"
                            onClick={() => navigateTo("/degree_plan")}
                        />
                        <LinkTab
                            label="About"
                            onClick={() => navigateTo("/about")}
                        />
                    </Tabs>
                </div>
                {location.pathname == "/schedule" ? (
                    <div
                        style={{
                            width: "30%",
                            height: "100%",
                            marginRight: 30,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                            zIndex: evalModalState ? -99 : 10,
                        }}
                    >
                        <SemesterSelect></SemesterSelect>
                        <div className="buttonSelect">{renderIcons()}</div>
                    </div>
                ) : (
                    location.pathname == "/degree_plan" && (
                        <div
                            style={{
                                width: "30%",
                                height: "100%",
                                marginRight: 30,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "65%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "",
                                    alignItems: "center",
                                    zIndex:
                                        modalState || modalState2 || modalState3
                                            ? -99
                                            : 10,
                                }}
                            >
                                <DegreePlanSelect></DegreePlanSelect>
                            </div>
                            <div className="icon-box">
                                <div className="icon-container">
                                    <RiDeleteBinLine
                                        onClick={() => setModal3(true)}
                                        size={20}
                                    />
                                </div>

                                <div className="icon-container">
                                    <AiOutlineEdit
                                        onClick={() => setModal2(true)}
                                        size={20}
                                    />
                                </div>

                                <div className="icon-container">
                                    <GoDiffAdded
                                        onClick={() => setModal(true)}
                                        size={20}
                                    />
                                </div>
                            </div>
                            <CreateModal
                                modalState={modalState}
                                setModal={setModal}
                                closeModal={closeModal}
                                addDegreePlan={addDegreePlan}
                            />

                            <UpdateModal
                                modalState2={modalState2}
                                setModal2={setModal2}
                                closeModal2={closeModal2}
                                mutateDegreePlan={mutateDegreePlan}
                                query={GET_LOCAL_DATA}
                                degreeplanparent={degreeplanparent}
                            />

                            <DeleteModal
                                modalState3={modalState3}
                                setModal3={setModal3}
                                closeModal3={closeModal3}
                                deleteDegreePlan={deleteDegreePlan}
                                query={GET_LOCAL_DATA}
                                degreeplanparent={degreeplanparent}
                                degreeplanlist={degreeplanlist}
                            />
                        </div>
                    )
                )}
                {/* <ThemeToggle /> */}
                <h4 className="emailHeading">
                    {email}
                </h4>
                <SettingsModal />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                    size="medium"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: "block", md: "none" },
                    }}
                >
                    <MenuItem onClick={() => history.push("/schedule")}>
                        <span>Schedule</span>
                    </MenuItem>
                    <MenuItem onClick={() => history.push("/degree_plan")}>
                        <span>Degree Plan</span>
                    </MenuItem>
                    <MenuItem onClick={() => history.push("/about")}>
                        <span>About</span>
                    </MenuItem>
                    {location.pathname == "/schedule" ? (
                        <div
                            style={{
                                width: "30%",
                                height: "100%",
                                marginRight: 30,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}
                        >
                            <MenuItem>
                                <SemesterSelect />
                            </MenuItem>
                            <MenuItem>
                                <div className="buttonSelect">
                                    {renderIcons()}
                                </div>
                            </MenuItem>
                        </div>
                    ) : (
                        location.pathname == "/degree_plan" && (
                            <div
                                style={{
                                    width: "30%",
                                    height: "100%",
                                    marginRight: 30,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        width: "65%",
                                        height: "100%",
                                        display: "flex",
                                        justifyContent: "",
                                        alignItems: "center",
                                        zIndex:
                                            modalState ||
                                                modalState2 ||
                                                modalState3
                                                ? -99
                                                : 10,
                                    }}
                                >
                                    <MenuItem>
                                        <DegreePlanSelect></DegreePlanSelect>
                                    </MenuItem>
                                </div>
                                <div className="icon-box">
                                    <div className="icon-container">
                                        <RiDeleteBinLine
                                            onClick={() => setModal3(true)}
                                            size={20}
                                        />
                                    </div>

                                    <div className="icon-container">
                                        <AiOutlineEdit
                                            onClick={() => setModal2(true)}
                                            size={20}
                                        />
                                    </div>

                                    <div className="icon-container">
                                        <GoDiffAdded
                                            onClick={() => setModal(true)}
                                            size={20}
                                        />
                                    </div>
                                </div>
                                <MenuItem>
                                    <CreateModal
                                        modalState={modalState}
                                        setModal={setModal}
                                        closeModal={closeModal}
                                        addDegreePlan={addDegreePlan}
                                    />
                                </MenuItem>
                                <MenuItem>
                                    <UpdateModal
                                        modalState2={modalState2}
                                        setModal2={setModal2}
                                        closeModal2={closeModal2}
                                        mutateDegreePlan={mutateDegreePlan}
                                        query={GET_LOCAL_DATA}
                                        degreeplanparent={degreeplanparent}
                                    />
                                </MenuItem>
                                <MenuItem>
                                    <DeleteModal
                                        modalState3={modalState3}
                                        setModal3={setModal3}
                                        closeModal3={closeModal3}
                                        deleteDegreePlan={deleteDegreePlan}
                                        query={GET_LOCAL_DATA}
                                        degreeplanparent={degreeplanparent}
                                        degreeplanlist={degreeplanlist}
                                    />
                                </MenuItem>
                            </div>
                        )
                    )}
                    <MenuItem>
                        <SettingsModal />
                        <h4 className="emailHeading">
                            {email}
                        </h4>
                    </MenuItem>
                </Menu>
            </Box>
        </div>
    );
}
export default Header;
