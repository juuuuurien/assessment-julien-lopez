const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/auth", (req, res) => {
  const headers = req.headers.authorization.split(" "); // so headers comes in as "Basic 'encoded data'" So we gotta split it
  console.log(headers);
  if (headers.length < 2) {
    res.json({ error: "Not Authorized!", status: 401 });
  } else {
    const authorization = headers[1];
    console.log(authorization);
    res.json({ message: "Authorized!", status: 200 });
  }
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
