const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    commits: { type: Number, default: 0 },
    contributors: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Repository", repoSchema);