var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

require("../db");

import { composeWithMongoose } from "graphql-compose-mongoose";
import composeWithDataloader from "graphql-compose-dataloader";

var EvaluationPerYearContentSchema = new Schema({
    Term: { type: String },
    CRN: { type: String },
    Reviews: [String],
    title: { type: String },
    Instructor: [String],
    Department: { type: String },
    yearID: { type: String, required: true },
});

var EvaluationSchema = new Schema({
    course: { type: String, required: true },
    evalInfo: [EvaluationPerYearContentSchema],
});

export const Evaluation = mongoose.model(
    "courseEvaluations",
    EvaluationSchema,
    "courseEvaluations"
);
// export const CourseTC = composeWithDataloader(composeWithMongoose(Course), {
//     cacheExpiration: 3000,
//     removeProjection: true,
//     debug: true,
// });
export const EvaluationTC = composeWithMongoose(Evaluation);
