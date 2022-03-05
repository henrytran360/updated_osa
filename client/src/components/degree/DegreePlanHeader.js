import React from "react";
import { useHistory } from "react-router";
import RiceAppsLogo from "../../riceappslogo.png";
import { initGA, OutboundLink } from "../../utils/analytics";
import "./DegreePlanHeader.css";

// Redirects people to our Medium page on a new page if they click our logo to learn more about us
const handleLogoClick = () => {
    OutboundLink(
        "Clicked Logo.",
        window.open("https://medium.com/riceapps", "_blank")
    );
};
const DegreePlanHeader = (props) => {
    return (
        <div className="DegreePlanNav">
            <h1 className="title">{props.degreePlanName}</h1>
        </div>
    );
};

export default DegreePlanHeader;
