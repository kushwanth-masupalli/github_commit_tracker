const express = require("express");
const activityService = require("../services/activityService");
const Commit = require("../models/Commit");
const Repository = require("../models/Repository");

const router = express.Router();

router.get("/leaderboard", async (req, res) => {
  try {
    const data = await activityService.getLeaderboard();
    res.json(data);
  } catch (err) {
    console.error("❌ Leaderboard fetch error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

router.get("/commits", async (req, res) => {
  try {
    const data = await Commit.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    console.error("❌ Commits fetch error:", err);
    res.status(500).json({ error: "Failed to fetch commits" });
  }
});

router.get("/repos", async (req, res) => {
  try {
    const data = await Repository.find().sort({ commits: -1, name: 1 });
    res.json(data);
  } catch (err) {
    console.error("❌ Repos fetch error:", err);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
});

router.get("/rules", (req, res) => {
  res.json(activityService.getRules());
});

module.exports = router;