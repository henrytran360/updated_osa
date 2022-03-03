import React from "react";
import "./Footer.css";
import { BsFillHeartFill } from "react-icons/bs";

const Footer = () => {
    let feedbackURL = "https://forms.gle/tUiboF8FAQE4AjLs9";
    return (
        <div className="footerContainer">
            <h4>
                Made with
                <BsFillHeartFill size={10} color="red" style={{ marginLeft: '3px', marginRight: '3px' }} />by Rice Apps <br></br>
                Let us know if you have any feedback on our product{" "}
                <a href={feedbackURL} target="_blank">here</a>
            </h4>
        </div>
    );
};

export default Footer;
