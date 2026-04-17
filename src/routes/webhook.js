const express = require("express");
const verifySignature = require("../middleware/webhookAuth");
const activityService = require("../services/activityService");

const router = express.Router();

router.post("/github", verifySignature, async (req, res) => {
  try {
    const event = req.headers["x-github-event"];
    const payload = JSON.parse(req.body.toString("utf8"));

    if (event === "push") {
      const repo = payload.repository?.name;
      const commits = payload.commits || [];

      for (const commit of commits) {
        await activityService.addActivity({
          repo,
          author: commit.author?.username || commit.author?.name || payload.sender?.login || "unknown",
          message: commit.message,
          timestamp: new Date(commit.timestamp),
          url: commit.url
        });
      }

      return res.status(200).json({
        message: "Push event processed",
        commitsProcessed: commits.length
      });
    }

    if (event === "pull_request") {
      const action = payload.action;
      const pr = payload.pull_request;

      if (!pr) {
        return res.status(400).json({ message: "No pull request data found" });
      }

      if (action === "opened" || action === "closed" || action === "synchronize") {
        await activityService.addActivity(
          {
            repo: payload.repository?.name,
            author: pr.user?.login || "unknown",
            message: pr.title,
            timestamp: new Date(pr.created_at || pr.updated_at || Date.now()),
            url: pr.html_url
          },
          true
        );
      }

      return res.status(200).json({
        message: "Pull request event processed"
      });
    }

    return res.status(200).json({
      message: `Ignored event: ${event}`
    });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    return res.status(500).json({
      error: "Failed to process webhook",
      details: err.message
    });
  }
});

module.exports = router;