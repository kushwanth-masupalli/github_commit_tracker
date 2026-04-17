require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");

const app = express();

app.set("trust proxy", true);

connectDB();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.static("public"));

const webhookRoute = require("./routes/webhook");
app.use("/webhook", express.raw({ type: "*/*" }), webhookRoute);

app.use(express.json());

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});