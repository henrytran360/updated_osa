import { composeWithMongoose } from "graphql-compose-mongoose";

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
require("../db");

/**
 * @todo: What other models do we need to import?
 */
import { Course } from "./CourseModel";

var StudyGroupSchema = new Schema({
    /**
     * @todo: What fields do we need here?
     */
    term: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: Course, required: true },
    groupMeId: { type: String, required: true },
});

export const StudyGroup = mongoose.model("studygroups", StudyGroupSchema);
export const StudyGroupTC = composeWithMongoose(StudyGroup);
