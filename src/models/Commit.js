const mongoose = require("mongoose");

const commitSchema = new mongoose.Schema({
  repo: String,
  author: String,
  message: String,
  timestamp: String,
  url: String,
  type: String,
  points: Number
});

module.exports = mongoose.model("Commit", commitSchema);