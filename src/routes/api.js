const express = require("express");
const dbService = require("../services/dbService");

const router = express.Router();

router.get("/leaderboard", async (req, res) => {
  const data = await dbService.getLeaderboard();
  res.json(data);
});

router.get("/commits", async (req, res) => {
  const data = await dbService.getCommits();
  res.json(data);
});

router.get("/repos", async (req, res) => {
  const data = await dbService.getRepos();
  res.json(data);
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