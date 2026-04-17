const express = require("express");
const verifySignature = require("../middleware/webhookAuth");
const { parsePushEvent, parsePullRequestEvent } = require("../services/githubParser");
const dbService = require("../services/dbService");

const router = express.Router();

router.post("/", verifySignature, async (req, res) => {
  try {
    const payload = JSON.parse(req.body.toString());
    const event = req.headers["x-github-event"];

    // 🔹 Handle PUSH (commits)
    if (event === "push") {
      const commits = parsePushEvent(payload);

      await Promise.all(
        commits.map(c => dbService.addCommit(c))
      );

      return res.status(200).send("Push processed");
    }

    // 🔹 Handle PR (only when merged)
    if (
      event === "pull_request" &&
      payload.action === "closed" &&
      payload.pull_request.merged
    ) {
      const prData = parsePullRequestEvent(payload);

      await dbService.addCommit(prData);

      return res.status(200).send("PR processed");
    }

    // 🔹 Ignore other events
    return res.status(200).send("Ignored");

  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(400).send("Invalid payload");
  }
});

module.exports = router;