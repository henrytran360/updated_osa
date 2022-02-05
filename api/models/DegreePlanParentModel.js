var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

require("../db");

import { composeWithMongoose } from "graphql-compose-mongoose";
import { User } from "./UserModel";
import { Course } from "./CourseModel";
import { DegreePlan } from "./DegreePlanModel";

var DegreePlanParentSchema = new Schema({
    name: { type: String, default: "New Degree Plan", required: false },
    user: { type: Schema.Types.ObjectID, ref: User },
    degreePlansList: [{ type: Schema.Types.ObjectID, ref: DegreePlan }],
});

export const DegreePlanParent = mongoose.model(
    "degreeplanparents",
    DegreePlanParentSchema,
    "degreeplanparents"
);
export const DegreePlanParentTC = composeWithMongoose(DegreePlanParent);
