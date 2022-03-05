import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Modal from "react-modal";
import { Button, ButtonGroup, IconButton } from "@material-ui/core";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";

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
const UpdateModal = ({
    mutateDegreePlan,
    modalState2,
    closeModal2,
    setModal2,
    query,
    degreeplanparent,
}) => {
    const [inputName, setInputName] = useState("");
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
    const client = useApolloClient();

    return (
        <Modal
            isOpen={modalState2}
            className="modalDegreePlanHeader"
            onRequestClose={closeModal2}
            ariaHideApp={false}
        >
            <div className="contentContainer">
                <div className="nameContainer">Change your plan's name</div>
                <div className="inputContainer">
                    <input
                        type="text"
                        className="header-search"
                        placeholder="New name of your plan"
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
                                mutateDegreePlan({
                                    variables: {
                                        _id: degreeplanparent,
                                        name: inputName,
                                    },
                                });
                                client.writeQuery({
                                    query: query,
                                    data: {
                                        degreeplanname: inputName,
                                    },
                                });
                                setInputName("");
                                setModal2(false);
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

export default UpdateModal;
