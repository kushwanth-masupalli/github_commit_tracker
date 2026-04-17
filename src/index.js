require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");

connectDB();

const webhookRoute = require("./routes/webhook");
const apiRoutes = require("./routes/api");

const app = express();

// 🔥 Serve frontend
app.use(express.static("public"));

// 🔥 WEBHOOK FIRST (raw body REQUIRED)
app.use("/webhook", express.raw({ type: "application/json" }));
app.use("/webhook", webhookRoute);

// 🔥 OTHER MIDDLEWARES AFTER
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// 🔥 API routes
app.use("/api", apiRoutes);

// 🔥 PORT FIX (IMPORTANT for Render)
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});