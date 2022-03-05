import React from "react";
import LoadingScreen from "../LoadingScreen";
import { gql, useQuery } from "@apollo/client";
import { Redirect, useHistory, useLocation } from "react-router";
import Error from "../error/Error";

const VERIFY_TOKEN = gql`
    query VerifyToken {
        verifyToken {
            _id
            firstName
            lastName
            netid
            majors
            college
            affiliation
            token
        }
    }
`;

const Auth = () => {
    // Get history & location from router; get samlProfile (profile object returned from saml) via state
    const history = useHistory();
    const location = useLocation();

    if (!location.state) {
        history.push("/login");
        return null;
    }

    const { data, loading, error } = useQuery(VERIFY_TOKEN);

    if (error) return <Error message={error.message}/>;
    if (loading) return <LoadingScreen />;
    if (!data) return <h2>No data returned...</h2>;

    // Redirect to schedule
    history.replace("/schedule");

    return null;
};

export default Auth;
