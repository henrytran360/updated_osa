import React, { useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { Button, IconButton } from "@material-ui/core";
import ThemeSelect from './ThemeSelect'
import SettingsIcon from "@mui/icons-material/Settings";

function SettingsModal(props) {
    let feedbackURL = "https://forms.gle/gSJp5Dy9a2WH7Nk1A";
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'var(--background-color)',
        border: '2px solid var(--shadow-color)',
        boxShadow: 24,
        p: 4,
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>
                <IconButton
                    size="small"
                    style={{
                        backgroundColor:
                            "var(--border-color)",
                        color: "var(--search-background-focused)",
                        fontSize: 15,
                    }}
                >
                    <SettingsIcon />
                </IconButton>
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Button
                        style={{
                            color: "var(--search-background-focused)",
                            border: "1px solid var(--search-background-focused)",
                        }}
                        variant="outlined"
                        onClick={() => window.open(feedbackURL, "_blank")}
                    >
                        Feedback
                    </Button>
                    <h2 id="modal-modal-title" variant="h6" component="h2">
                        Theme Options
                    </h2>
                    <ThemeSelect themeCategory="Light" themeOptions={['Light', 'Color Blind']} />
                    <ThemeSelect themeCategory="Dark" themeOptions={['Dark', 'High Contrast']} />
                </Box>
            </Modal>
        </div>
    );
}

export default SettingsModal;