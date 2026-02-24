
const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: String,
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  score: Number,
  analysis: Object
});

module.exports = mongoose.model("Team", TeamSchema);
