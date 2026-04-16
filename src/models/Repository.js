const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  commits: { type: Number, default: 0 },
  contributors: [String]
});

module.exports = mongoose.model("Repository", repoSchema);