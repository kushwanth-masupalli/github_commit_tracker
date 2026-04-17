const mongoose = require("mongoose");

const commitSchema = new mongoose.Schema({
  repo: { type: String, required: true },
  author: { type: String, required: true },

  message: String,
  timestamp: Date,
  url: String,

  type: String,          // feature, fix, etc
  difficulty: String,    // easy, medium, hard (for PRs)

  points: Number,

  source: {              // 🔥 NEW FIELD
    type: String,
    enum: ["commit", "pr"],
    default: "commit"
  }
});

module.exports = mongoose.model("Commit", commitSchema);