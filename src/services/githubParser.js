function extractType(message) {
  if (!message || typeof message !== "string") return null;
  const match = message.match(/^\[(.*?)\]/);
  return match ? match[1].trim().toLowerCase() : null;
}

function extractDifficulty(message) {
  if (!message || typeof message !== "string") return null;
  const match = message.match(/\((easy|medium|hard)\)/i);
  return match ? match[1].toLowerCase() : null;
}

function parsePushEvent(payload) {
  const repo = payload.repository?.name;
  const commits = payload.commits || [];

  return commits.map((c) => ({
    repo,
    author: c.author?.username || c.author?.name || payload.sender?.login || "unknown",
    message: c.message,
    timestamp: c.timestamp,
    url: c.url,
    type: extractType(c.message),
    source: "commit"
  }));
}

function parsePullRequestEvent(payload) {
  const pr = payload.pull_request;

  if (!pr) return null;

  return {
    repo: payload.repository?.name,
    author: pr.user?.login || "unknown",
    message: pr.title,
    timestamp: pr.created_at || pr.updated_at,
    url: pr.html_url,
    type: extractType(pr.title),
    difficulty: extractDifficulty(pr.title),
    source: "pr"
  };
}

module.exports = {
  extractType,
  extractDifficulty,
  parsePushEvent,
  parsePullRequestEvent
};