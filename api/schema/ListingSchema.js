import { Course, ItemTC, Listing, ListingTC } from "../models";

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */
 ListingTC.addRelation("item", {
    resolver: () => ItemTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.item,
    },
    projection: { item: 1 },
});

// CRUD Operations

// Create

// Read

// ListingTC.addResolver({
//     name: "findByClass",
//     type: [ListingTC],
//     args: { input: "String!" },
//     resolve: async ({ source, args, context, info }) => {
//         let { input } = args;
        
//         // 1: Split input at the space
//         let [ subject, courseNum ] = input.split(" ");

//         // 2: Search courses by course subject & course number -> gets course associated with that
//         let course = await Course.findOne({ subject: subject, courseNum: courseNum });

//         // Error Check: If course does not exist, no Listings exist with it
//         if (!course) {
//             return [];
//         }

//         // // 3: Find Listings associated with course object we retrieved
//         let Listings = await Listing.find({ course: course.id});

//         return Listings;
//     }
// })

// Update

// Delete / Destroy

const ListingQuery = {
    listingFindMany: ListingTC.getResolver("findMany"),
    listingFindOne: ListingTC.getResolver("findOne")
};

const ListingMutation = {
    listingCreateOne: ListingTC.getResolver("createOne"),
    listingUpdateOne: ListingTC.getResolver("updateOne"),
    listingRemoveOne: ListingTC.getResolver("removeOne")
};

export { ListingQuery, ListingMutation };
