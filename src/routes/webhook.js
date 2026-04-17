const express = require("express");
const verifySignature = require("../middleware/webhookAuth");
const { parsePushEvent, parsePullRequestEvent } = require("../services/githubParser");
const dbService = require("../services/dbService");

const router = express.Router();

router.post("/", verifySignature, async (req, res) => {
  try {
    const payload = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const event = req.headers["x-github-event"];

    console.log("📩 Event received:", event);

    // 🔹 PUSH
    if (event === "push") {
      const commits = parsePushEvent(payload);

      console.log("🔥 Parsed commits:", commits);

      await Promise.all(commits.map(c => dbService.addCommit(c)));

      return res.status(200).send("Push processed");
    }

    // 🔹 PR
    if (
      event === "pull_request" &&
      payload.action === "closed" &&
      payload.pull_request.merged
    ) {
      const prData = parsePullRequestEvent(payload);

      console.log("🔥 Parsed PR:", prData);

      await dbService.addCommit(prData);

      return res.status(200).send("PR processed");
    }

    return res.status(200).send("Ignored");

  } catch (err) {
    console.error("❌ Webhook error:", err);
    return res.status(200).send("Handled with error");
  }
});

module.exports = router;