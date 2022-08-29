const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({
  path: "./.env.local",
});
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/"));

app.get("/api/auth", (req, res) => {
  const headers = req.headers.authorization.split(" "); // so headers comes in as "Basic 'encoded data'" So we gotta split it

  if (headers.length < 2) res.json({ error: "Not Authorized!", status: 401 }); // Guard clause to reject early if no cookies
  if (headers.length > 1) {
    // if cookies present
    headers.slice(0, 1); // cut off 'Basic' element from array

    let cookies = {};

    headers.forEach((header) => {
      // split each cookie apart and store each cookie into an object
      [cname, value] = header.split("=");
      cookies[cname] = value;
    });

    if ("password" in cookies)
      res.json({ message: "Authorized!", status: 200 }); // if 'password' cookie was sent, user is 'authorized'
  }
});

app.get("/api/emails", async (req, res) => {
  const client = await connectDB();
  const emails = await client
    .db("2leaf_assessment")
    .collection("emails")
    .find({})
    .toArray();

  res.json(emails); // returns a json array of 'users' with {name: string, email:string}
});

app.post("/api/emails", async (req, res) => {
  const { name, email } = req.body;
  console.log(name, email);
  const client = await connectDB();

  try {
    await client
      .db("2leaf_assessment")
      .collection("emails")
      .insertOne({ email: email, name: name });

    res.json({ status: 200, message: `${name} subscribed!` });
  } catch (e) {
    console.log("error");
    console.error(e);

    res.json({ status: 400, message: e });
  }
});

// mongoDB connection helper fn
const connectDB = async () => {
  const options = {
    // mongodb client options from my previous projects
    useUnifiedTopology: true,
    useNewUrlParser: true,
  };

  const client = new MongoClient(MONGODB_URI, options);
  try {
    await client.connect();
    console.log("client connected");
    return client;
  } catch (e) {
    console.error(e);
  }
};

app.listen(PORT || 8080, () => {
  console.log("Server started on port 8080");
});
