import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ThemeToggle from "./ThemeToggle";
import LoginButton from "../login/LoginButton";
import FormControl from "@mui/material/FormControl";
import { Button, IconButton } from "@material-ui/core";
import ThemeSelect from "./ThemeSelect";
import SettingsIcon from "@mui/icons-material/Settings";
function SettingsModal(props) {
    let feedbackURL = "https://forms.gle/tUiboF8FAQE4AjLs9";
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "var(--background-color)",
        border: "2px solid var(--shadow-color)",
        boxShadow: 24,
        p: 4,
    };
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <div
            style={{
                width: "6%",
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
                <Box sx={style}>
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
                </Box>
            </Modal>
        </div>
    );
}
export default SettingsModal;
