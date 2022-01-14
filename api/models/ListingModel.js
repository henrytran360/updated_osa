var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

require("../db");
import { composeWithMongoose } from "graphql-compose-mongoose";    
import { Item } from "./ItemModel";
import { User } from "./UserModel";

const CONDITIONS = ['NEW', 'LIKE NEW', 'USED'];
const STATUSES = ['AVAILABLE', 'PENDING', 'SOLD'];

var ListingSchema = new Schema({
    item: { type: Schema.Types.ObjectID, ref: Item, required: true },
    condition: { type: String, required: true, enum: CONDITIONS },
    seller: { type: Schema.Types.ObjectID, ref: User, required: true },
    price: { type: Number, required: true },
    negotiable: { type: Boolean, required: true, default: true },
    description: { type: String, required: false },
    availability: { type: String, required: true, enum: STATUSES },
    pictures: [{ type: String, required: false }],
}, { timestamps: true });

export const Listing = mongoose.model("listings", ListingSchema);
export const ListingTC = composeWithMongoose(Listing);

