import { InstructorTC, SessionTC } from "../models";
import axios from "axios";
import { GraphQLString } from "graphql";
import { getInstructors } from "../utils/courseUtils";

const xml2js = require("xml2js");
const parser = new xml2js.Parser();

// API GET request to fetch the instructors with their webIds
InstructorTC.addResolver({
    name: "fetchInstructors",
    type: [InstructorTC],
    args: { termcode: "String!" },
    resolve: async ({ source, args, context, info }) => {
        return await axios
            .get(
                "https://esther.rice.edu/selfserve/!swkscmp.ajax?p_data=INSTRUCTORS&p_term=" +
                    (parseInt(args.termcode) - 100) // using -100 in order to get the previous year's reviews (from the same term ~ fall/spring/summer) (ex: 202120 - 100 = 202020)
            )
            .then(async (response) => {
                // Parse xml to json
                const test = await parser
                    .parseStringPromise(response.data)
                    .then((result) => {
                        const mapped = result["INSTRUCTORS"]["INSTRUCTOR"].map(
                            (instructor) => {
                                const flattened = instructor["$"];
                                const { INI, NAME, WEBID } = flattened;
                                // Get the instructors firstname and lastname
                                const split = NAME.split(",");
                                const corrected = split.map((val, index) => {
                                    // Remove the extra " " in front of firstname
                                    if (!index) return val;
                                    return val.substring(1);
                                });
                                return {
                                    INI,
                                    webId: WEBID,
                                    firstName: corrected[1],
                                    lastName: corrected[0],
                                };
                            }
                        );
                        return mapped;
                    });
                return test;
            })
            .catch((error) => {
                console.log("error fetching data", error);
                return [];
            });
    },
});

// Create a field NOT on the mongoose model; easy way to fetch sessions that an instructor teaches
InstructorTC.addFields({
    webId: {
        type: GraphQLString,
    },
    sessions: {
        type: [SessionTC],
        args: SessionTC.getResolver("findMany").getArgs(),
        resolve: (source, args, context, info) =>
            SessionTC.getResolver("findMany").resolve({
                source,
                // Copy any args the user passes in for this subfield, but also filter by the parent course
                args: {
                    ...args,
                    filter: { ...args.filter, instructors: source._id },
                },
                context,
                info,
            }),
        projection: {
            _id: true,
        },
    },
});

const InstructorQuery = {
    instructorList: InstructorTC.getResolver("fetchInstructors"),
    instructors: {
        name: "instructors",
        type: [InstructorTC],
        args: { term: "Int!" },
        resolve: async (_, args) => {
            return await getInstructors(args.term);
        }
    },
    instructorMany: InstructorTC.getResolver("findMany"),
    instructorOne: InstructorTC.getResolver("findOne")
        .addFilterArg({
            name: "coursefirstNameRegExp", // From here: https://github.com/graphql-compose/graphql-compose-examples/blob/master/examples/northwind/models/product.js#L38,L49
            type: "String",
            description: "Search for courses by instructor's first name",
            query: (query, value) => {
                let firstName = value;
                query.firstName = firstName;
            },
        })
        .addFilterArg({
            name: "courselastNameRegExp", // From here: https://github.com/graphql-compose/graphql-compose-examples/blob/master/examples/northwind/models/product.js#L38,L49
            type: "String",
            description: "Search for a course by instructor's last name",
            query: (query, value) => {
                let lastName = value;
                query.lastName = lastName;
            },
        }),
};

const InstructorMutation = {
    instructorCreateOne: InstructorTC.getResolver("createOne"),
};

export { InstructorQuery, InstructorMutation };
