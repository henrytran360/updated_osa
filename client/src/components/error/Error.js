import React from "react";

import "./Error.global.css";

//error message for missing page
const errorPageMessage = (
    <div>
        <h2>It looks like this page doesn't exist 😰</h2>
        <h3>You may have mistyped the address or the page may have moved. </h3>
        <h3>Please return to the previous page. </h3>
    </div>
);

const renderSwitch = (props) => {
    switch (props.message) {
        case "page": 
            console.log("page error");
            return errorPageMessage;

        default: 
            return props.message;
    }
  }

const Error = (props) => {
    return (
        <div className="errorContainer">
            {console.log(props.message)}
            {renderSwitch(props)}
        </div>
    );
};

export default Error;
