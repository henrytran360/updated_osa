import { User, UserTC, ScheduleTC } from "../models";
import {
    authenticateTicket,
    verifyToken,
    createToken,
    extractAuthenticationDetails,
} from "../utils/authenticationUtils";

import mongoose from "mongoose";

// Create a field NOT on the mongoose model; easy way to fetch schedule for a user in one trip
UserTC.addFields({
    schedules: {
        type: [ScheduleTC],
        args: ScheduleTC.getResolver("findMany").getArgs(),
        resolve: (source, args, context, info) =>
            ScheduleTC.getResolver("findMany").resolve({
                source,
                // Copy any args the user passes in for this subfield, but also filter by the parent course
                args: { ...args, filter: { ...args.filter, user: source._id } },
                context,
                info,
            }),
        projection: {
            _id: true,
        },
    },
});

/**
 * Custom Resolvers
 */

/**
 * Authentication-related resolvers
 */

UserTC.addResolver({
    name: "authenticate",
    type: UserTC,
    args: { ticket: "String!" },
    resolve: async ({ source, args, context, info }) => {
        let authenticationResponse = await authenticateTicket(args.ticket);
        if (authenticationResponse.success) {
            let user; // this will be used as the return object

            // Get the netid of the authenticated user
            let { netid } = authenticationResponse;

            // Check if user exists based on netid
            let exists = await User.exists({ netid: netid });
            if (!exists) {
                // Create user
                user = await User.create({ netid: netid });
            } else {
                user = await User.findOne({ netid: netid });
            }

            // Get a new token for the user
            let token = createToken(user);

            // Update the user's token and get their updated information
            return await User.findByIdAndUpdate(
                user._id,
                { token: token },
                { new: true }
            );
        } else {
            console.log("Bad auth!");
            throw Error("Bad authentication.");
        }
    },
});

UserTC.addResolver({
    name: "verify",
    type: UserTC,
    args: { token: UserTC.getFieldTC("token") },
    resolve: async ({ source, args, context, info }) => {
        let verificationResponse = await verifyToken(args.token);
        if (verificationResponse.success) {
            let { id } = verificationResponse;
            // Return logged in user's info
            return await User.findById(id);
        } else {
            console.log("Bad verify!");
            throw Error("Bad Verification.");
        }
    },
});

UserTC.addResolver({
    name: "verifyToken",
    type: UserTC,
    args: {},
    resolve: async ({ source, args, context, info }) => {
        const profile = extractAuthenticationDetails(context.decodedJWT);
        let exists = await User.exists({ netid: profile.netid });

        let user;
        if (!exists) {
            // Create user with profile
            user = await User.create(profile);
        } else {
            // Find user and update their profile with most recent info
            user = await User.findOneAndUpdate(
                { netid: profile.netid },
                profile,
                { useFindAndModify: false }
            );
        }

        return user;
    },
});

// Using auth middleware for sensitive info: https://github.com/graphql-compose/graphql-compose-mongoose/issues/158
const UserQuery = {
    userOne: UserTC.getResolver("findOne", [authMiddleware]),
};

const UserMutation = {
    userUpdateOne: UserTC.getResolver("updateOne", [authMiddleware]),
};

async function authMiddleware(resolve, source, args, context, info) {
    // Without header, throw error
    if (!context.decodedJWT) {
        throw new Error("You need to be logged in.");
    }

    const profile = extractAuthenticationDetails(context.decodedJWT);
    console.log(profile);
    const { netid } = profile;

    // Allows a user to only access THEIR user object
    return resolve(
        source,
        { ...args, filter: { netid: netid } },
        context,
        info
    );
}

export { UserQuery, UserMutation };
