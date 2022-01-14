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
const DegreePlanHeader = () => {
    const history = useHistory();
    return (
        <div className="DegreePlanNav">
            <div className="logoContainer">
                <img
                    src={RiceAppsLogo}
                    // style={styles.logo}
                    onClick={() => handleLogoClick()}
                />
            </div>
            <h1 className="title">My Degree Plan</h1>
            <button
                className="toschedule"
                onClick={() => history.push("/schedule")}
            >
                Back To Schedule
            </button>
        </div>
    );
};

export default DegreePlanHeader;
