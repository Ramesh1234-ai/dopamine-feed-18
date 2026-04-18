import mongoose from "mongoose";
const dataSchema = new mongoose.Schema({}, { strict: false });
export const data = mongoose.model("data", dataSchema, "ds");
