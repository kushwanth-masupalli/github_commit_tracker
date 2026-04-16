
const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  score: { type: Number, default: 0 },
  commits: { type: Number, default: 0 }
});

module.exports = mongoose.model("Developer", developerSchema);