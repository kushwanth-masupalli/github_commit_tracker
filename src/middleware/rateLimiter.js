const limits = {};
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

setInterval(() => {
  const now = Date.now();

  for (const ip in limits) {
    if (now - limits[ip].time > WINDOW_MS) {
      delete limits[ip];
    }
  }
}, WINDOW_MS);

module.exports = function rateLimiter(req, res, next) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : req.ip;

  if (!limits[ip]) {
    limits[ip] = { count: 1, time: Date.now() };
    return next();
  }

  const elapsed = Date.now() - limits[ip].time;

  if (elapsed > WINDOW_MS) {
    limits[ip] = { count: 1, time: Date.now() };
    return next();
  }

  if (limits[ip].count >= MAX_REQUESTS) {
    return res.status(429).send("Too many requests");
  }

  limits[ip].count++;
  next();
};