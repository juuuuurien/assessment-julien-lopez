const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config({
  path: "./.env.local",
});

const PORT = process.env.PORT;

// Initialize middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// method to authenticate person entering parent portal

// statically serve some html
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

app.get("/parentportal", (req, res, next) => {
  const cookies = req.cookies;

  if (cookies.parentportal_password === "HireMe123") {
    console.log("auth");
    next();
  } else {
    res.redirect("http://localhost:8080/");
  }
});
app.get("/parentportal", (req, res) =>
  res.sendFile(__dirname + "/parentportal.html")
);

// Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/subscribe", require("./routes/api/subscribe"));

app.listen(PORT, () => {
  console.log("Server started on port 8080");
  console.log(" > http://localhost:8080/");
});
