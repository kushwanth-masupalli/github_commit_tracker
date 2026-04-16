const express = require("express");
const store = require("../models/store");

const router = express.Router();

// leaderboard
router.get("/leaderboard", (req, res) => {
  res.json(store.getLeaderboard());
});

// all commits
router.get("/commits", (req, res) => {
  res.json(store.commits);
});

// repos
router.get("/repos", (req, res) => {
  const repos = Object.entries(store.repositories).map(([name, data]) => ({
    name,
    commits: data.commits,
    contributors: [...data.contributors]
  }));

  res.json(repos);
});

// scoring rules
router.get("/rules", (req, res) => {
  res.json(store.rules);
});

// update scoring rules (extensible)
router.post("/rules", (req, res) => {
  const { type, points } = req.body;
  store.rules[type] = points;
  res.json(store.rules);
});

module.exports = router;