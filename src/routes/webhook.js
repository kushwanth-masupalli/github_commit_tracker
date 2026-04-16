const express = require("express");
const verifySignature = require("../middleware/webhookAuth");
const { parsePushEvent } = require("../services/githubParser");
const store = require("../models/store");

const router = express.Router();

router.post("/", verifySignature, (req, res) => {
  try {
    const payload = JSON.parse(req.body.toString());

    if (req.headers["x-github-event"] !== "push") {
      return res.status(200).send("Ignored");
    }

    const commits = parsePushEvent(payload);

    commits.forEach((c) => store.addCommit(c));

    res.status(200).send("Processed");
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid payload");
  }
});

module.exports = router;