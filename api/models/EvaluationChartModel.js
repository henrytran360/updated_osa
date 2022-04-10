var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

require("../db");

import { composeWithMongoose } from "graphql-compose-mongoose";
import composeWithDataloader from "graphql-compose-dataloader";

var ChartSchema = new Schema({
    score_1: String,
    score_2: String,
    score_3: String,
    score_4: String,
    score_5: String,
    class_mean: String,
    responses: String,
});

var CommentSchema = new Schema({
    text: String,
    time: String,
});

var EvaluationChartSchema = new Schema({
    term: String,
    name: { type: String, required: true },
    XLists: String,
    enrolled_amount: String,
    instructor: String,
    courseName: String,
    termValue: Number,
    organization: { type: ChartSchema },
    assignments: { type: ChartSchema },
    overall: { type: ChartSchema },
    challenge: { type: ChartSchema },
    workload: { type: ChartSchema },
    why_taking: { type: ChartSchema },
    expected_grade: { type: ChartSchema },
    expected_pf: { type: ChartSchema },
    comments: [CommentSchema],
});

export const EvaluationChart = mongoose.model(
    "course_evaluations_new",
    EvaluationChartSchema,
    "course_evaluations_new"
);
// export const CourseTC = composeWithDataloader(composeWithMongoose(Course), {
//     cacheExpiration: 3000,
//     removeProjection: true,
//     debug: true,
// });
export const EvaluationChartTC = composeWithMongoose(EvaluationChart);
