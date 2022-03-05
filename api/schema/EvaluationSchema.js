import { Evaluation, EvaluationTC } from "../models/EvaluationModel";
import {
    EvaluationChart,
    EvaluationChartTC,
} from "../models/EvaluationChartModel";

import { User, UserTC } from "../models/UserModel";

EvaluationTC.addResolver({
    name: "getAllEvaluation",
    type: [EvaluationTC],
    args: {},
    resolve: async ({ source, args, context, info }) => {
        // -(field) puts into descending order
        return await Evaluation.find({});
    },
});

EvaluationTC.addResolver({
    name: "getEvaluationByCourse",
    type: EvaluationTC,
    args: { course: "String!" },
    resolve: async ({ source, args, context, info }) => {
        // -(field) puts into descending order
        return await Evaluation.findOne({ course: args.course });
    },
});

EvaluationChartTC.addResolver({
    name: "getAllEvaluationChart",
    type: [EvaluationChartTC],
    args: {},
    resolve: async ({ source, args, context, info }) => {
        // -(field) puts into descending order
        return await EvaluationChart.find({});
    },
});

EvaluationChartTC.addResolver({
    name: "getEvaluationChartByCourse",
    type: [EvaluationChartTC],
    args: { course: "String!" },
    resolve: async ({ source, args, context, info }) => {
        // -(field) puts into descending order
        return await EvaluationChart.find({ courseName: args.course });
    },
});

const EvaluationQuery = {
    getEvaluationByCourse: EvaluationTC.getResolver("getEvaluationByCourse", [
        authMiddleware,
    ]),
    getAllEvaluation: EvaluationTC.getResolver("getAllEvaluation", [
        authMiddleware,
    ]),
    getEvaluationChartByCourse: EvaluationChartTC.getResolver(
        "getEvaluationChartByCourse",
        [authMiddleware]
    ),
    getAllEvaluationChart: EvaluationChartTC.getResolver(
        "getAllEvaluationChart",
        [authMiddleware]
    ),
};

const EvaluationMutation = {};

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

export { EvaluationQuery, EvaluationMutation };
