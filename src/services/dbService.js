const Developer = require("../models/Developer");
const Repository = require("../models/Repository");
const Commit = require("../models/Commit");

async function addCommit(commit) {
  try {
    // 🔹 Normalize fields
    const data = {
      repo: commit.repo,
      author: commit.author,
      message: commit.message,
      timestamp: commit.timestamp ? new Date(commit.timestamp) : new Date(),
      url: commit.url,
      type: commit.type || null,
      difficulty: commit.difficulty || null,
      points: commit.points || 0,
      source: commit.source || "commit" // commit | pr
    };

    // 🔹 Save commit/PR
    await Commit.create(data);

    // 🔹 Developer update
    let dev = await Developer.findOne({ username: data.author });

    if (!dev) {
      dev = new Developer({
        username: data.author,
        score: 0,
        commits: 0,
        prCount: 0
      });
    }

    dev.score += data.points;

    if (data.source === "pr") {
      dev.prCount += 1;
    } else {
      dev.commits += 1;
    }

    await dev.save();

    // 🔹 Repository update
    let repo = await Repository.findOne({ name: data.repo });

    if (!repo) {
      repo = new Repository({
        name: data.repo,
        commits: 0,
        contributors: []
      });
    }

    repo.commits += 1;

    if (!repo.contributors.includes(data.author)) {
      repo.contributors.push(data.author);
    }

    await repo.save();

  } catch (err) {
    console.error("❌ DB Service Error:", err);
  }
}

// 🔹 Leaderboard
async function getLeaderboard() {
  return Developer.find().sort({ score: -1 });
}

// 🔹 All commits + PRs
async function getCommits() {
  return Commit.find().sort({ timestamp: -1 });
}

// 🔹 Repo stats
async function getRepos() {
  return Repository.find();
}

module.exports = {
  addCommit,
  getLeaderboard,
  getCommits,
  getRepos
};