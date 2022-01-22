import React from "react";

// Load CSS
import "./Login.global.css";
import LoginButton from './LoginButton'

// componentDidMount(){
//     this.loginButton.current.focus();
// }

const Login = () => {

    return (
        <div className="loginContainer">
            <div className="loginText">
                <h2>the app formerly known as schedule planner</h2>
                <h4>brought to you by riceapps</h4>
            </div>
            <LoginButton></LoginButton>
        </div>
    );
};

export default Login;
