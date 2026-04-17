const crypto = require("crypto");

module.exports = function verifySignature(req, res, next) {
  // const signature = req.headers["x-hub-signature-256"];
  // const secret = process.env.GITHUB_WEBHOOK_SECRET;

  // console.log("🔐 Auth check — signature present:", !!signature);
  // console.log("🔐 Secret present:", !!secret);

  // if (!secret) {
  //   // ✅ If no secret configured, skip verification (useful for initial testing)
  //   console.warn("⚠️ No webhook secret set, skipping verification");
  //   return next();
  // }

  // if (!signature) {
  //   console.error("❌ No signature header");
  //   return res.status(401).send("No signature");
  // }

  // // ✅ req.body is a Buffer from express.raw() — this is correct
  // const hash =
  //   "sha256=" +
  //   crypto
  //     .createHmac("sha256", secret)
  //     .update(req.body) // Buffer — correct
  //     .digest("hex");

  // console.log("🔐 Expected:", hash);
  // console.log("🔐 Received:", signature);

  // if (hash !== signature) {
  //   console.error("❌ Signature mismatch");
  //   return res.status(401).send("Invalid signature");
  // }

  // console.log("✅ Signature verified");
  next();
};