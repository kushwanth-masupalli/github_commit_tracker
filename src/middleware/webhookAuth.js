const crypto = require("crypto");

module.exports = function verifySignature(req, res, next) {
  const signature = req.headers["x-hub-signature-256"];
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  console.log("🔐 Signature present:", !!signature);
  console.log("🔐 Secret present:", !!secret);

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("❌ Missing webhook secret in production");
      return res.status(500).send("Webhook secret not configured");
    }

    console.warn("⚠️ No webhook secret set, skipping verification in development");
    return next();
  }

  if (!signature || !signature.startsWith("sha256=")) {
    console.error("❌ Invalid or missing signature header");
    return res.status(401).send("Invalid signature header");
  }

  if (!Buffer.isBuffer(req.body)) {
    console.error("❌ req.body is not a Buffer. Use express.raw() for this route.");
    return res.status(500).send("Invalid request body parser configuration");
  }

  const expected =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(req.body).digest("hex");

  console.log("🔐 Expected:", expected);
  console.log("🔐 Received:", signature);

  const isValid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );

  if (!isValid) {
    console.error("❌ Signature mismatch");
    return res.status(401).send("Invalid signature");
  }

  console.log("✅ Signature verified");
  next();
};