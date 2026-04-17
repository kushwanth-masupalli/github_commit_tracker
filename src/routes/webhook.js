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
        return res.status(200).send("No commits");
      }

      const results = [];
      for (const commit of commits) {
        console.log("➡️ Sending to DB:", commit);
        try {
          const result = await dbService.addCommit(commit);
          results.push(result);
          console.log("✅ Successfully saved commit");
        } catch (dbErr) {
          console.error("❌ Failed to save commit:", dbErr.message);
          // Continue processing other commits
        }
      }

      console.log(`✅ Processed ${results.length}/${commits.length} commits`);
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

      try {
        await dbService.addCommit(prData);
        console.log("✅ Successfully saved PR");
        return res.status(200).send("PR processed");
      } catch (dbErr) {
        console.error("❌ Failed to save PR:", dbErr.message);
        return res.status(200).send("PR failed to save");
      }
    }

    return res.status(200).send("Ignored");

  } catch (err) {
    console.error("❌ WEBHOOK ERROR:", err.message);
    console.error("Stack:", err.stack);
    return res.status(500).send("Error");
  }
});

module.exports = router;