var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

require("../db");

import { composeWithMongoose } from "graphql-compose-mongoose";
import { User } from "./UserModel";
import { Session } from "./SessionModel";

var DraftSessionSchema = new Schema({
    visible: { type: Number, enum: [0, 1], default: 1 },
    session: { type: Schema.Types.ObjectID, ref: Session },
});

var ScheduleSchema = new Schema({
    term: { type: String, required: true },
    draftSessions: [DraftSessionSchema],
    customCourse: { type: [String], required: false },
    notes: { type: [String], required: false },
    user: { type: Schema.Types.ObjectID, ref: User },
});

export const Schedule = mongoose.model("schedules", ScheduleSchema);
export const ScheduleTC = composeWithMongoose(Schedule);
