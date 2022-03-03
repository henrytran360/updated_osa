import React from "react";
import "./Footer.css";
import { BsFillHeartFill } from "react-icons/bs";

const Footer = () => {
    let feedbackURL = "https://forms.gle/tUiboF8FAQE4AjLs9";
    return (
        <div className="footerContainer">
            <BsFillHeartFill size={10} color="red" />
            Made with by Rice Apps <br></br>
            Let us know if you have any feedback on our product{" "}
            <a href={feedbackURL}>here</a>
        </div>
    );
};

export default Footer;
