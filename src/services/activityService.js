function extractType(message) {
  const match = message.match(/^\[(.*?)\]/);
  return match ? match[1].toLowerCase() : null;
}

function extractDifficulty(message) {
  const match = message.match(/\((easy|medium|hard)\)/i);
  return match ? match[1].toLowerCase() : null;
}

// 🔹 Commit scoring
const commitRules = {
  feature: 10,
  fix: 7,
  perf: 9,
  refactor: 5,
  test: 5,
  docs: 2,
  style: 1,
  chore: 1
};

// 🔹 PR scoring
const prRules = {
  feature: { hard: 20, medium: 15, easy: 10 },
  bug: { hard: 15, medium: 10, easy: 5 },
  refactor: { default: 7 },
  performance: { default: 12 },
  test: { default: 6 },
  documentation: { default: 3 },
  chore: { default: 2 }
};

function calculateCommitPoints(type) {
  return commitRules[type] || 0;
}

function calculatePRPoints(type, difficulty) {
  const rule = prRules[type];
  if (!rule) return 0;
  return rule[difficulty] || rule.default || 0;
}
function parsePushEvent(payload) {
  const repo = payload.repository?.name;

  if (!payload.commits || payload.commits.length === 0) {
    console.log("❌ No commits in payload");
    return [];
  }

  return payload.commits.map(c => {
    const message = c.message;

    const typeMatch = message.match(/^\[(.*?)\]/);
    const type = typeMatch ? typeMatch[1].toLowerCase() : null;

    const pointsMap = {
      feature: 10,
      fix: 7,
      perf: 9,
      refactor: 5,
      test: 5,
      docs: 2,
      style: 1,
      chore: 1
    };

    const points = type ? (pointsMap[type] || 0) : 0;

    const author =
      c.author?.username ||
      c.author?.name ||
      payload.sender?.login ||
      "unknown";

    const parsed = {
      repo,
      author,
      message,
      timestamp: c.timestamp,
      url: c.url,
      type,
      points,
      source: "commit"
    };

    console.log("✅ Parsed commit:", parsed);

    return parsed;
  });
}

// 🔥 PR PARSER
function parsePullRequestEvent(payload) {
  const pr = payload.pull_request;
  const repo = payload.repository?.name;
  const message = pr.title;

  const type = extractType(message);
  const difficulty = extractDifficulty(message);

  return {
    repo,
    author: pr.user?.login || "unknown",
    message,
    timestamp: pr.created_at,
    url: pr.html_url,
    type,
    difficulty,
    points: calculatePRPoints(type, difficulty),
    source: "pr"
  };
}

module.exports = {
  parsePushEvent,
  parsePullRequestEvent
};