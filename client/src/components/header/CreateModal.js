import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Modal from "react-modal";
import { Button, ButtonGroup, IconButton } from "@material-ui/core";

const useStyles = makeStyles({
    button: {
        color: "var(--primary-color)",
        fontSize: 15,
    },
    button2: {
        color: "var(--primary-color)",
        border: "1px solid var(--border-color)",
        width: 150,
    },
    button3: {
        color: "var(--primary-color)",
        border: "1px solid var(--primary-color)",
        width: 80,
    },
    button4: {
        height: 50,
        color: "red",
        border: "1px solid red",
    },
    button5: {
        height: 50,
        color: "var(--primary-color)",
        border: "1px solid var(--primary-color)",
    },
});
const CreateModal = ({ addDegreePlan, modalState, closeModal, setModal }) => {
    const [inputName, setInputName] = useState("");
    const [value, setValue] = React.useState(0);
    const classes = useStyles();

    return (
        <Modal
            isOpen={modalState}
            className="modalDegreePlanHeader"
            onRequestClose={closeModal}
            ariaHideApp={false}
        >
            <div className="contentContainer">
                <div className="nameContainer">Create a new Degree Plan</div>
                <div className="inputContainer">
                    <input
                        type="text"
                        className="header-search"
                        placeholder="Name of your plan"
                        name="s"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                    />
                    <div className="buttonContainer">
                        <Button
                            style={{
                                color: "var(--primary-color)",
                                border: "1px solid var(--primary-color)",
                            }}
                            className={classes.button3}
                            variant="outlined"
                            onClick={() => {
                                addDegreePlan({
                                    variables: {
                                        name: inputName,
                                    },
                                });
                                setInputName("");
                                setModal(false);
                            }}
                        >
                            {" "}
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreateModal;
