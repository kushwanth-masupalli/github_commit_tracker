const crypto = require("crypto");

module.exports = function verifySignature(req, res, next) {
  const signature = req.headers["x-hub-signature-256"];
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!signature) {
    return res.status(401).send("No signature");
  }

  const hash =
    "sha256=" +
    crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

  if (hash !== signature) {
    return res.status(401).send("Invalid signature");
  }

  next();
};