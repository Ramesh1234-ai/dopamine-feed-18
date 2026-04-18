import mongoose from "mongoose";
const TeamSchema = new mongoose.Schema({
  name: String,
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  score: Number,
  analysis: Object
},{
  timestamps:true
});

export const Team = mongoose.model("Team", TeamSchema);
