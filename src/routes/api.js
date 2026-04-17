const express = require("express");
const dbService = require("../services/dbService");
const store = require("../services/store"); // ✅ import store for rules endpoints

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
  res.json(store.commitRules); // ✅ was store.rules (undefined)
});

// update scoring rules
router.post("/rules", (req, res) => {
  const { type, points } = req.body;
  store.commitRules[type] = points; // ✅ was store.rules (undefined)
  res.json(store.commitRules);
});

module.exports = router;