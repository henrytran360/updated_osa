var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

require("../db");

import { composeWithMongoose } from "graphql-compose-mongoose";
import composeWithDataloader from "graphql-compose-dataloader";

var RestrictionSchema = new Schema({
    type: String,
    setting: { type: String, enum: ["I", "E"] }, // Only inclusive or exclusive
    params: [String],
});

var CourseSchema = new Schema({
    subject: String,
    courseNum: Number,
    longTitle: String,
    creditsMin: Number,
    creditsMax: Number,
    restrictions: [{ type: RestrictionSchema }],
    prereqs: String,
    coreqs: [String],
    mutualExclusions: [String],
    distribution: String,
});

export const Course = mongoose.model("courses", CourseSchema);
// export const CourseTC = composeWithDataloader(composeWithMongoose(Course), {
//     cacheExpiration: 3000,
//     removeProjection: true,
//     debug: true,
// });
export const CourseTC = composeWithMongoose(Course);
