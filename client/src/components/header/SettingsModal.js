import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ThemeToggle from "./ThemeToggle";
import LoginButton from "../login/LoginButton";
import FormControl from "@mui/material/FormControl";
import { Button, IconButton } from "@material-ui/core";
import ThemeSelect from "./ThemeSelect";
import SettingsIcon from "@mui/icons-material/Settings";
import { IoCloseOutline } from "react-icons/io5";
import { HoverStyle } from "devextreme-react/chart";

function SettingsModal(props) {
    let feedbackURL = "https://forms.gle/tUiboF8FAQE4AjLs9";
    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "var(--background-color)",
        border: "2px solid var(--shadow-color)",
        boxShadow: 24,
        p: 1,
    };
    const exitStyle = {
        float: "right",
        backgroundColor: "transparent",
    };
    const exitStyleHover = {
        float: "right",
        backgroundColor: "#eeeeee",
        borderRadius:"4px"
    };
    const[exitHover, setExitHover] = useState(false);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setExitHover(false);
        setOpen(false);
    };
    return (
        <div
            style={{
                width: "15%",
                height: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
            }}
        >
            <IconButton
                size="small"
                style={{
                    backgroundColor: "var(--tertiary-bg-color)",
                    color: "var(--primary-color)",
                    // fontSize: 15,
                }}
                onClick={handleOpen}
            >
                <SettingsIcon />
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <div style={exitHover ? exitStyleHover : exitStyle}>
                        <IconButton
                        disableFocusRipple
                        disableRipple
                        style={{       
                            padding: "0",
                            margin: "0",
                            backgroundColor: "transparent",
                        }}
                        onMouseOver={()=>{setExitHover(true)}}
                        onMouseLeave={()=>{setExitHover(false)}}
                        onClick={handleClose}
                    >
                        <IoCloseOutline color={exitHover ? "var(--primary-color)" : "#8e9eb2"} size={30} />
                    </IconButton>
                    </div>
                    <div style={{padding: "0rem 2rem 2rem 2rem"}}>
                        <h2 id="modal-modal-title" variant="h6" component="h2">
                            Authenticate
                        </h2>
                        <p>Currently logged in as {props.email}</p>
                        <LoginButton full_width={true} /> 
                        <h2 id="modal-modal-title" variant="h6" component="h2">
                            Theme Options
                        </h2>
                        <ThemeSelect
                            themeOptions={[
                                { value: "Light", label: "Light" },
                                { value: "Color Blind", label: "Color Blind" },
                                { value: "Red", label: "Red" },
                                { value: "Butter", label: "Butter" },
                                { value: "Dark", label: "Dark" },
                                { value: "High Contrast", label: "High Contrast" },
                                { value: "Purple", label: "Purple" },
                            ]}
                        />
                        <h2 id="modal-modal-title" variant="h6" component="h2">
                            Feedback
                        </h2>
                        <FormControl fullWidth>
                            <Button
                                style={{
                                    color: "var(--primary-color)",
                                    border: "1px solid var(--primary-color)",
                                }}
                                variant="outlined"
                                onClick={() => window.open(feedbackURL, "_blank")}
                            >
                                Feedback
                            </Button>
                        </FormControl>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
export default SettingsModal;
