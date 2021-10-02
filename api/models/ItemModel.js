import { composeWithMongoose } from "graphql-compose-mongoose";

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
require("../db");

/**
 * @todo: What other models do we need to import?
 */
import { Course } from "./CourseModel";

var ItemSchema = new Schema({
    /**
     * @todo: What fields do we need here?
     */
    title: { type: String, required: true },
    version: { type: String, required: false },
    year: { type: Number, required: false },
    courses: [{ type: Schema.Types.ObjectId, ref: Course, required: true }],
    author: String,
    type: { type: String, enum: ["Textbook", "Lab", "Hardware", "Other"] },
    isbn: { type: Number, required: false },
});

export const Item = mongoose.model("items", ItemSchema);
export const ItemTC = composeWithMongoose(Item);
