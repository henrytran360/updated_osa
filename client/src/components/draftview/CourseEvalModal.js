import React from "react";
import Modal from "react-modal";

const CourseEvalModal = (props) => {
    return (
        <div>
            <Modal
                isOpen={props.modalState}
                className="modal"
                onRequestClose={props.closeModal}
            >
                {" "}
                {/* /*style={{ wordWrap: "break-all", whiteSpace: "unset" }}*/}
                {/* <IconButton onClick={onClose}> Close Modal </IconButton> */}
                <div>
                    <div className="courseCode">
                        {/* {props.subject} {props.courseNum} */}
                        Hello
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default CourseEvalModal;
