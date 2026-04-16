const store = require("../models/store");

function extractType(message) {
  const match = message.match(/^\[(.*?)\]/);
  return match ? match[1].toLowerCase() : null;
}

function calculatePoints(type) {
  return store.rules[type] || 0;
}

function parsePushEvent(payload) {
  const repo = payload.repository?.name;
  const commits = payload.commits || [];
  const sender = payload.sender?.login;

  return commits.map((c) => {
    const author = c.author?.name || sender;
    const message = c.message || "";
    const type = extractType(message);
    const points = calculatePoints(type);

    return {
      repo,
      author,
      message,
      timestamp: c.timestamp,
      url: c.url,
      type,
      points
    };
  });
}

module.exports = { parsePushEvent };