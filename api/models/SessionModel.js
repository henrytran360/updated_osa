var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

require("../db");
import { composeWithMongoose } from "graphql-compose-mongoose";
import composeWithDataLoader from "graphql-compose-dataloader";

import { Instructor } from "./InstructorModel";
import { Course } from "./CourseModel";

var ClassSchema = new Schema({
    startTime: String,
    endTime: String,
    days: [{ type: String, enum: ["M", "T", "W", "R", "F", "S", "U"] }],
});

var LabSchema = new Schema({
    startTime: String,
    endTime: String,
    days: [{ type: String, enum: ["M", "T", "W", "R", "F", "S", "U"] }],
});

var SessionSchema = new Schema({
    class: ClassSchema,
    lab: LabSchema,
    crosslistCourses: [{ type: Schema.Types.ObjectID, ref: Course }],
    crn: Number,
    term: Number, // such as: "202010", "202120", etc.
    enrollment: Number,
    maxEnrollment: Number,
    crossEnrollment: Number,
    maxCrossEnrollment: Number,
    waitlisted: Number,
    maxWaitlisted: Number,
    course: { type: Schema.Types.ObjectID, ref: Course },
    instructors: [{ type: Schema.Types.ObjectID, ref: Instructor }],
    instructionMethod: String,
    fullCourseName: String,
});

export const Session = mongoose.model("sessions", SessionSchema);
export const SessionTC = composeWithDataLoader(composeWithMongoose(Session), {
    cacheExpiration: 3000,
    removeProjection: true,
});
// export const SessionTC = composeWithMongoose(Session);
