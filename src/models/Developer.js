const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    score: { type: Number, default: 0 },
    commits: { type: Number, default: 0 },
    prCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Developer", developerSchema);