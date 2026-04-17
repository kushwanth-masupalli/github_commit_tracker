require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");

const app = express(); // ✅ DECLARE app FIRST

connectDB();

// ✅ MIDDLEWARES
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// ✅ Serve frontend
app.use(express.static("public"));

// ✅ WEBHOOK — raw body MUST come before express.json()
const webhookRoute = require("./routes/webhook");
app.use("/webhook", express.raw({ type: "application/json" }), webhookRoute);

// ✅ JSON body parser for all other routes
app.use(express.json());

// ✅ API routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});