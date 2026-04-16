const limits = {};

module.exports = function rateLimiter(req, res, next) {
  const ip = req.ip;

  if (!limits[ip]) {
    limits[ip] = { count: 0, time: Date.now() };
  }

  const elapsed = Date.now() - limits[ip].time;

  if (elapsed < 60000 && limits[ip].count > 100) {
    return res.status(429).send("Too many requests");
  }

  if (elapsed > 60000) {
    limits[ip] = { count: 1, time: Date.now() };
  } else {
    limits[ip].count++;
  }

  next();
};