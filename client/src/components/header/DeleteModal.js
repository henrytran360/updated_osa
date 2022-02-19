import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Modal from "react-modal";
import { Button, ButtonGroup, IconButton } from "@material-ui/core";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";

const useStyles = makeStyles({
    button: {
        color: "var(--search-background-focused)",
        fontSize: 15,
    },
    button2: {
        color: "#1DC2C4",
        border: "1px solid #BBECED",
        width: 150,
    },
    button3: {
        color: "#1DC2C4",
        border: "1px solid #1DC2C4",
        width: 80,
    },
    button4: {
        height: 50,
        color: "red",
        border: "1px solid red",
    },
    button5: {
        height: 50,
        color: "#1DC2C4",
        border: "1px solid #1DC2C4",
    },
});
const DeleteModal = ({
    deleteDegreePlan,
    modalState3,
    closeModal3,
    setModal3,
    query,
    degreeplanparent,
    degreeplanlist,
}) => {
    const [inputName, setInputName] = useState("");
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
    const client = useApolloClient();

    return (
        <Modal
            isOpen={modalState3}
            className="modalDegreePlanHeader"
            onRequestClose={closeModal3}
            ariaHideApp={false}
        >
            <div className="contentContainer">
                <div className="nameContainerDelete">
                    Are you sure you want to remove the current degree plan ?
                </div>
                <div
                    style={{
                        width: "90%",
                        height: "50%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
                    <Button
                        className={classes.button4}
                        variant="outlined"
                        onClick={() => {
                            if (
                                degreeplanlist.findAllDegreePlansListForUsers
                                    .length > 1
                            ) {
                                deleteDegreePlan({
                                    variables: {
                                        _id: degreeplanparent,
                                    },
                                });
                                setModal3(false);
                            } else {
                                alert("You must have at least 1 degree plan");
                            }
                        }}
                    >
                        {" "}
                        Remove
                    </Button>
                    <Button
                        style={{
                            color: "#1DC2C4",
                            border: "1px solid 1DC2C4",
                        }}
                        className={classes.button5}
                        variant="outlined"
                        onClick={() => setModal3(false)}
                    >
                        {" "}
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteModal;
