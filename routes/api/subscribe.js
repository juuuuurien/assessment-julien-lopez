const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");

const dotenv = require("dotenv");
dotenv.config({
  path: "./.env.local",
});

const router = express.Router();

const MONGODB_URI = process.env.MONGODB_URI;

router.get("/", async (req, res) => {
  const client = await connectDB();
  const emails = await client
    .db("2leaf_assessment")
    .collection("emails")
    .find({})
    .toArray();

  res.json(emails); // returns a json array of 'users' with {name: string, email:string}
});

router.post("/", async (req, res) => {
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

module.exports = router;
