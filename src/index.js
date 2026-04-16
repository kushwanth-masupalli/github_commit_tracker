require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const webhookRoute = require("./routes/webhook");
const apiRoutes = require("./routes/api");

const app = express();
app.use(express.static("public"));
// IMPORTANT: raw body needed for webhook verification
app.use("/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/webhook", webhookRoute);
app.use("/api", apiRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));