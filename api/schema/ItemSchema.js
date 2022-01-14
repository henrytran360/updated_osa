import { Course, CourseTC, Item, ItemTC } from "../models";

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */
ItemTC.addRelation("courses", {
    resolver: () => CourseTC.getResolver("findByIds"),
    prepareArgs: {
        _ids: (source) => source.courses,
    },
    projection: { courses: 1 },
});

// CRUD Operations

// Create

// Read

ItemTC.addResolver({
    name: "findByClass",
    type: [ItemTC],
    args: { input: "String!" },
    resolve: async ({ source, args, context, info }) => {
        let { input } = args;

        // 1: Split input at the space
        let [subject, courseNum] = input.split(" ");

        // 2: Search courses by course subject & course number -> gets course associated with that
        let course = await Course.findOne({
            subject: subject,
            courseNum: courseNum,
        });

        // Error Check: If course does not exist, no items exist with it
        if (!course) {
            return [];
        }

        // // 3: Find items associated with course object we retrieved
        let items = await Item.find({ course: course.id });

        return items;
    },
});

// Update

// Delete / Destroy

const ItemQuery = {
    findCourse: ItemTC.getResolver("findByClass"),
    itemFindOne: ItemTC.getResolver("findOne"),
};

const ItemMutation = {
    itemCreateOne: ItemTC.getResolver("createOne"),
    itemUpdateOne: ItemTC.getResolver("updateOne"),
    itemRemoveOne: ItemTC.getResolver("removeOne"),
};

export { ItemQuery, ItemMutation };
