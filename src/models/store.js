class Store {
  constructor() {
    this.developers = {}; // { username: { score, commits } }
    this.repositories = {}; // { repo: { commits, contributors } }
    this.activities = []; // commits + PRs

    // 🔹 Updated Commit Rules
    this.commitRules = {
      feature: 10,
      fix: 7,
      perf: 9,
      refactor: 5,
      test: 5,
      docs: 2,
      style: 1,
      chore: 1
    };

    // 🔹 PR Rules
    this.prRules = {
      feature: { hard: 20, medium: 15, easy: 10 },
      bug: { hard: 15, medium: 10, easy: 5 },
      refactor: { default: 7 },
      performance: { default: 12 },
      test: { default: 6 },
      documentation: { default: 3 },
      chore: { default: 2 }
    };
  }

  // 🔹 Extract type from [type]
  extractType(message) {
    const match = message.match(/^\[(.*?)\]/);
    return match ? match[1].toLowerCase() : null;
  }

  // 🔹 Extract difficulty from (easy/medium/hard)
  extractDifficulty(message) {
    const match = message.match(/\((easy|medium|hard)\)/i);
    return match ? match[1].toLowerCase() : "default";
  }

  // 🔹 Calculate commit points
  calculateCommitPoints(type) {
    return this.commitRules[type] || 0;
  }

  // 🔹 Calculate PR points
  calculatePRPoints(type, difficulty) {
    const rule = this.prRules[type];
    if (!rule) return 0;
    return rule[difficulty] || rule.default || 0;
  }

  // 🔹 Add activity (commit or PR)
  addActivity(data, isPR = false) {
    let type = this.extractType(data.message);
    let points = 0;

    if (isPR) {
      const difficulty = this.extractDifficulty(data.message);
      points = this.calculatePRPoints(type, difficulty);
    } else {
      points = this.calculateCommitPoints(type);
    }

    const activity = {
      ...data,
      type,
      points
    };

    this.activities.push(activity);

    // 🔹 Developer tracking
    if (!this.developers[data.author]) {
      this.developers[data.author] = { score: 0, commits: 0 };
    }

    this.developers[data.author].score += points;
    this.developers[data.author].commits++;

    // 🔹 Repo tracking
    if (!this.repositories[data.repo]) {
      this.repositories[data.repo] = {
        commits: 0,
        contributors: new Set()
      };
    }

    this.repositories[data.repo].commits++;
    this.repositories[data.repo].contributors.add(data.author);
  }

  // 🔹 Leaderboard
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