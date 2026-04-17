const express = require("express");
const verifySignature = require("../middleware/webhookAuth");
const { parsePushEvent, parsePullRequestEvent } = require("../services/githubParser");
const dbService = require("../services/dbService");

const router = express.Router();

router.post("/", verifySignature, async (req, res) => {
  try {
    const payload = typeof req.body === "string"
      ? JSON.parse(req.body)
      : JSON.parse(req.body.toString());

    const event = req.headers["x-github-event"];

    console.log("📩 EVENT:", event);

    // 🔥 PUSH EVENT
    if (event === "push") {
      const commits = parsePushEvent(payload);

      console.log("🔥 Parsed commits:", commits);

      if (!commits || commits.length === 0) {
        console.log("❌ No commits parsed");
      }

      for (const commit of commits) {
        console.log("➡️ Sending to DB:", commit);
        await dbService.addCommit(commit);
      }

      return res.status(200).send("Push processed");
    }

    // 🔥 PR EVENT
    if (
      event === "pull_request" &&
      payload.action === "closed" &&
      payload.pull_request.merged
    ) {
      const prData = parsePullRequestEvent(payload);

      console.log("➡️ Sending PR to DB:", prData);

      await dbService.addCommit(prData);

      return res.status(200).send("PR processed");
    }

    return res.status(200).send("Ignored");

  } catch (err) {
    console.error("❌ WEBHOOK ERROR:", err);
    return res.status(200).send("Handled");
  }
});

module.exports = router;