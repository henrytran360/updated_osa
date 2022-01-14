/**
 * @todo: What TypeComposers do we need to import?
 */
import { StudyGroup, StudyGroupTC } from "../models"

/**
 * @todo: What utils do we need to import?
 */
 import { createGroup } from "../utils/invitelinksUtils"

/* Some imports you'll need */
import fetch from "node-fetch";
import { GROUPME_ACCESS_TOKEN } from "../config";

/**
 * @todo: What additional fields (virtual fields) do we need here?
 */
StudyGroupTC.addFields({
    fetchGroupInfo: {
        type: /** @todo: Fill in type of object this resolver will return */ "String",
        args:
            /** @todo: Fill in list of arguments needed for this resolver */
            { term: "Int!" }

        ,
        resolve: async (source, args, context, info) => {
            /**
             * @todo: Fill in what fields we need to extract from args
             */
            // const { } = args;

            const object = await StudyGroup.findById(source._id);

            const groupMeId = object["groupMeId"];

            console.log(groupMeId);

            // const groupMeId = source.groupMeId;
            // 27839292

            // make groupme api call
            const raw = await fetch("https://api.groupme.com/v3/" + `groups/${groupMeId}?token=${GROUPME_ACCESS_TOKEN}`);
            console.log(raw);
            const json = await raw.json();

            console.log(json)

            //parse the response 

            // return/store the url
            const url = json['response']['share_url']
            

            /**
             * @todo: Fill in the logic necessary for this resolver
             */

            /**
             * @todo: Change return type to correct type
             */
            return url;
        },
    }


});

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 *
 * @todo: What additional relations do we need here?
 */
// StudyGroupTC.addRelation("relationOne", {
//     resolver: () => {
//         /** @todo: Fill in the resolver we need for this relation */
//     },
//     prepareArgs: {
//         /**
//          * @todo: What arguments do we need for the resolver used above?
//          */
//     },
// });

/**
 * Custom Resolvers
 *
 * @todo: What resolvers do we need here?
 */


 //look for link if there is one and give it 
 //if no link then create 
 // call on Groupme API to create the group and look for existing group 

 //query database for this course , check if there is a link 
 //if no link create then store in data base, then return 
StudyGroupTC.addResolver({
    name: "findOrCreate",
    type: StudyGroupTC,  
    args: StudyGroupTC.getResolver("findOne").getArgs(),
    resolve: async ({ source, args, context, info }) => {
        /**
         * @todo: Fill in what fields we need to extract from args
         */
        let  { term, course } = args.filter;

        let studygroup = await StudyGroup.findOne({
            term: term,
            course: course
        }).exec();

        //const {} = args;

        /**
         * @todo: Fill in the logic necessary for this resolver
         */

        // query database for course and link
        // Return if it exists
        if (studygroup) return studygroup;

        const link = await createGroup(course, term);

        return await StudyGroup.create({ term: term, course: course, groupMeId: link});

        //Create if it doesnt exist --> store link in db --> return 

    },
});

StudyGroupTC.addResolver({
    name: "fetchGroupInfo",
    type: /** @todo: Fill in type of object this resolver will return */ "String",
    args: {
        /** @todo: Fill in list of arguments needed for this resolver */
        // { term: "Int!", course:  }

    },
    resolve: async ({ source, args, context, info }) => {
        /**
         * @todo: Fill in what fields we need to extract from args
         */
        const { } = args;

        console.log(source);

        /**
         * @todo: Fill in the logic necessary for this resolver
         */

        /**
         * @todo: Change return type to correct type
         */
        return null;
    },
});

/**
 * @todo: What queries do we need for Study Groups?
 */
const StudyGroupQuery = {
    findOrCreateGroupMe: StudyGroupTC.getResolver("findOrCreate"),
    groups: StudyGroupTC.getResolver("findMany")
};

/**
 * @todo: What mutations do we need for Study Groups?
 */
const StudyGroupMutation = {};

/** @todo: What middleware(s) do we need? */
async function someMiddleware(resolve, source, args, context, info) {
    /**
     * @todo: Perform checks / validations here
     */

    /**
     * @todo: Perform filtering on resolve object to limit scope
     */
    return resolve(source, args, context, info);
}

export { StudyGroupQuery, StudyGroupMutation };
