var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

require("../db");

import { composeWithMongoose } from "graphql-compose-mongoose";
import { User } from "./UserModel";
import { Course } from "./CourseModel";
import { DegreePlanParent } from "./DegreePlanParentModel";

var DraftCourseSchema = new Schema({
    visible: { type: Number, enum: [0, 1], default: 1 },
    course: { type: Schema.Types.ObjectID, ref: Course },
});

var DegreePlanSchema = new Schema({
    term: { type: String, required: true },
    degreeplanparent: { type: Schema.Types.ObjectID, ref: DegreePlanParent },
    draftCourses: [DraftCourseSchema],
    customCourse: { type: [String], required: false },
    notes: { type: String, default: "", required: false },
    user: { type: Schema.Types.ObjectID, ref: User },
});

export const DegreePlan = mongoose.model(
    "degreeplans",
    DegreePlanSchema,
    "degreeplans"
);
export const DegreePlanTC = composeWithMongoose(DegreePlan);
