const mongoose = require("mongoose");

const commitSchema = new mongoose.Schema(
  {
    repo: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },

    message: { type: String, required: true, trim: true },
    timestamp: { type: Date, required: true },
    url: { type: String, required: true, trim: true },

    type: { type: String, default: null, trim: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "default", null],
      default: null
    },

    points: { type: Number, default: 0 },

    source: {
      type: String,
      enum: ["commit", "pr"],
      default: "commit"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commit", commitSchema);