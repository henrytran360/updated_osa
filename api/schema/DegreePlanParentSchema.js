import {
    DegreePlan,
    DegreePlanTC,
    DegreePlanParent,
    DegreePlanParentTC,
    UserTC,
    User,
} from "../models";
import { checkScheduleUserMatch } from "../utils/authorizationUtils";

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */
DegreePlanParentTC.addRelation("user", {
    resolver: () => UserTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.user,
    },
    projection: { user: 1 },
});

/**
 * Add relation for a nested field: https://github.com/graphql-compose/graphql-compose/issues/2
 * But the .getByPath(path) method doesn't exist anymore, so to get the TypeComposer of the nested field (in this case, "items")
 * We need to use .getFieldTC(path)
 */
// const DegreePlansListTC = DegreePlanParentTC.getFieldTC("degreePlansList");
// DegreePlansListTC.addRelation("degreeplan", {
//     resolver: () => DegreePlanTC.getResolver("findById"),
//     prepareArgs: {
//         _id: (source) => source.degreeplan,
//     },
//     projection: { course: 1 },
// });

/**
 * Used to find all schedules for a particular user
 */
DegreePlanParentTC.addResolver({
    name: "findAllDegreePlansListForUsers",
    type: [DegreePlanParentTC],
    args: { _id: "ID", filter: DegreePlanParentTC.getInputTypeComposer() },
    resolve: async ({ source, args, context, info }) => {
        let filter = { user: args._id };
        if (args.filter) {
            // For all fields in the filter, add them to our filter
            for (let key of Object.keys(args.filter)) {
                filter[key] = args.filter[key];
            }
        }
        return DegreePlanParent.find(filter);
    },
});

DegreePlanParentTC.addResolver({
    name: "createNewDegreePlanList",
    type: DegreePlanParentTC,
    args: DegreePlanParentTC.getResolver("createOne").getArgs(),
    resolve: async ({ source, args, context, info }) => {
        const { user } = args.filter;
        return await DegreePlanParent.create({
            user: user,
            name: args.record.name,
        });
    },
});

/**
 * Update notes
 */
DegreePlanParentTC.addResolver({
    name: "updateDegreePlanParentName",
    type: DegreePlanParentTC,
    args: DegreePlanParentTC.getResolver("updateOne").getArgs(),
    resolve: async ({ source, args, context, info }) => {
        let CC = args.record.name;
        console.log(CC);
        console.log(args);
        const degreeplanparent = await DegreePlanParent.updateOne(
            { _id: args.filter._id },
            { $set: { name: args.record.name } }
        );
        if (!degreeplanparent) return null;
        return DegreePlanParent.findById(args.filter._id);
        // return await Schedule.findByIdAndUpdate(args.filter._id, {
        //     customCourse: args.record.customCourse,
        // });
    },
});

/**
 * Remove a term from the degree planner
 */
DegreePlanParentTC.addResolver({
    name: "removeDegreePlanParent",
    type: DegreePlanParentTC,
    args: DegreePlanParentTC.getResolver("removeOne").getArgs(),
    resolve: async ({ source, args, context, info }) => {
        // Create if it doesn't exist
        // console.log(args);
        return await DegreePlanParent.findByIdAndRemove({
            _id: args.filter._id,
        });
    },
});

const DegreePlanParentQuery = {
    findAllDegreePlansListForUsers: DegreePlanParentTC.getResolver(
        "findAllDegreePlansListForUsers",
        [authMiddleware]
    ),
};

const DegreePlanParentMutation = {
    // Schedule.create({ term: term, user: user })
    createNewDegreePlanList: DegreePlanParentTC.getResolver(
        "createNewDegreePlanList",
        [authMiddleware]
    ),
    removeDegreePlanParent: DegreePlanParentTC.getResolver(
        "removeDegreePlanParent",
        [authMiddleware]
    ),
    updateDegreePlanParentName: DegreePlanParentTC.getResolver(
        "updateDegreePlanParentName",
        [authMiddleware]
    ),
};

async function authMiddleware(resolve, source, args, context, info) {
    // Without header, throw error
    if (!context.decodedJWT) {
        throw new Error("You need to be logged in.");
    }

    let { uid } = context.decodedJWT;

    // Use the uid from the JWT to extract the user's _id
    const { _id } = await User.findOne({ uid });

    // Allows a user to only access THEIR schedules, while still maintaining any other filters from the request
    return resolve(
        source,
        { ...args, filter: { ...args.filter, user: _id } },
        context,
        info
    );
}

export { DegreePlanParentQuery, DegreePlanParentMutation };
