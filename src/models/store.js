class Store {
  constructor() {
    this.developers = {}; // { username: { score, commits } }
    this.repositories = {}; // { repo: { commits, contributors } }
    this.commits = [];
    this.rules = {
      fix: 5,
      feature: 10,
      refactor: 3,
      docs: 1
    };
  }

  addCommit(commit) {
    this.commits.push(commit);

    // developer tracking
    if (!this.developers[commit.author]) {
      this.developers[commit.author] = { score: 0, commits: 0 };
    }

    this.developers[commit.author].score += commit.points;
    this.developers[commit.author].commits++;

    // repo tracking
    if (!this.repositories[commit.repo]) {
      this.repositories[commit.repo] = {
        commits: 0,
        contributors: new Set()
      };
    }

    this.repositories[commit.repo].commits++;
    this.repositories[commit.repo].contributors.add(commit.author);
  }

  getLeaderboard() {
    return Object.entries(this.developers)
      .map(([user, data]) => ({
        user,
        score: data.score,
        commits: data.commits
      }))
      .sort((a, b) => b.score - a.score);
  }
}

module.exports = new Store();