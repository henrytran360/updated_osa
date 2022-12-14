// This will be created when the user logs in
const jwt = require("jsonwebtoken");

import axios from "axios";

var xml2js = require("xml2js");
var stripPrefix = require("xml2js").processors.stripPrefix;

import { SERVICE_URL } from "../config";
import { User } from "../models";

import * as admin from "firebase-admin";

/**
 * Parser used for XML response by CAS
 */
const parser = new xml2js.Parser({
    tagNameProcessors: [stripPrefix],
    explicitArray: false,
});

/**
 * Default failure response when authentication / verification doesn't work.
 */
const failureResponse = { success: false };

let config = {
    CASValidateURL: "https://idp.rice.edu/idp/profile/cas/serviceValidate",
    // thisServiceURL: 'http://localhost:3001/auth',
    secret: "testsec",
};

/**
 * Given a user, creates a new token for them.
 */
export const createToken = (user) => {
    let token = jwt.sign(
        {
            id: user._id,
            netid: user.netid,
        },
        config.secret,
        { expiresIn: 129600 }
    );
    console.log(token);
    return token;
};

/**
 * Given a token, finds the associated user.
 */
export const getUserFromToken = async (token) => {
    let user = await User.find({ token: token });
    return user;
};

/**
 * Given a token, verifies that it is still valid.
 */
export const verifyToken = async (token) => {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return { ...decodedToken };
    try {
        // In the future, we may need the other properties...
        let { id, netid, iat, exp } = await jwt.verify(token, config.secret);
        return { success: true, id };
    } catch (e) {
        return failureResponse;
    }
};

export const extractAuthenticationDetails = (decodedToken) => {
    const uid = decodedToken.uid;
    const samlProfile = decodedToken.firebase.sign_in_attributes;
    return {
        uid: uid,
        firstName: samlProfile["urn:oid:2.5.4.42"],
        lastName: samlProfile["urn:oid:2.5.4.4"],
        netid: samlProfile["urn:oid:0.9.2342.19200300.100.1.1"],
        majors: samlProfile["urn:oid:1.3.6.1.4.1.134.1.1.1.1.4"].split(", "),
        college: samlProfile["urn:oid:1.3.6.1.4.1.134.1.1.1.1.15"],
        affiliation: samlProfile["urn:oid:1.3.6.1.4.1.5923.1.1.1.5"],
    };
};

/**
 * Given a ticket, authenticates it and returns the corresponding netid of the now-authenticated user.
 */
export const authenticateTicket = async (ticket) => {
    try {
        // validate our ticket against the CAS server
        var url = `${config.CASValidateURL}?ticket=${ticket}&service=${SERVICE_URL}`;

        // First validate ticket against CAS, get a data object back
        let { data } = await axios.get(url);

        // Parse returned XML data with xml2js parser
        return parser.parseStringPromise(data).then(
            (parsedResponse) => {
                let serviceResponse = parsedResponse.serviceResponse;
                // This object contains the information as to whether this login was successful
                var authSucceded = serviceResponse.authenticationSuccess;
                if (authSucceded) {
                    // authSucceded.user is the netid
                    let netid = authSucceded.user;
                    return { success: true, netid };
                } else {
                    return failureResponse;
                }
            },
            (err) => {
                console.log("Error!");
                return failureResponse;
            }
        );
    } catch (e) {
        console.log("Something went wrong.");
        return failureResponse;
    }
};
