const express = require("express");
const verifySignature = require("../middleware/webhookAuth");
const { parsePushEvent, parsePullRequestEvent } = require("../services/githubParser");
const dbService = require("../services/dbService");

const router = express.Router();

router.post("/", verifySignature, async (req, res) => {
  try {
    // 🔥 FIX: safe payload parsing
    const payload = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const event = req.headers["x-github-event"];

    // ✅ PUSH EVENT
    if (event === "push") {
      const commits = parsePushEvent(payload);

      await Promise.all(
        commits.map(c => dbService.addCommit(c))
      );

      return res.status(200).send("Push processed");
    }

    // ✅ PR EVENT (only merged)
    if (
      event === "pull_request" &&
      payload.action === "closed" &&
      payload.pull_request.merged
    ) {
      const prData = parsePullRequestEvent(payload);

      await dbService.addCommit(prData);

      return res.status(200).send("PR processed");
    }

    // ignore others
    return res.status(200).send("Ignored");

  } catch (err) {
    console.error("❌ Webhook error:", err);

    // 🔥 IMPORTANT: NEVER return 400 to GitHub
    return res.status(200).send("Handled with error");
  }
});

module.exports = router;