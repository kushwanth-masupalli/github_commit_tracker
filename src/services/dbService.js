const Developer = require("../models/Developer");
const Repository = require("../models/Repository");
const Commit = require("../models/Commit");

async function addCommit(commit) {
  // save commit
  await Commit.create(commit);

  // developer update
  let dev = await Developer.findOne({ username: commit.author });

  if (!dev) {
    dev = new Developer({ username: commit.author });
  }

  dev.score += commit.points;
  dev.commits += 1;

  await dev.save();

  // repo update
  let repo = await Repository.findOne({ name: commit.repo });

  if (!repo) {
    repo = new Repository({ name: commit.repo });
  }

  repo.commits += 1;

  if (!repo.contributors.includes(commit.author)) {
    repo.contributors.push(commit.author);
  }

  await repo.save();
}

async function getLeaderboard() {
  return Developer.find().sort({ score: -1 });
}

async function getCommits() {
  return Commit.find().sort({ timestamp: -1 });
}

async function getRepos() {
  return Repository.find();
}

module.exports = {
  addCommit,
  getLeaderboard,
  getCommits,
  getRepos
};