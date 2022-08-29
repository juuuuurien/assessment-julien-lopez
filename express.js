const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config({
  path: "./.env.local",
});

const PORT = process.env.PORT;

// Initialize middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/"));

// Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/subscribe", require("./routes/api/subscribe"));

app.listen(PORT | 8080, () => {
  console.log("Server started on port 8080");
});
