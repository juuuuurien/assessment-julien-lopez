const express = require("express");
const app = express();

const router = express.Router();

router.get("/", (req, res) => {
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

    // check if password exists in cookies, and password is the magic password
    if (
      "parentportal_password" in cookies &&
      cookies["parentportal_password"] === "HireMe123"
    ) {
      res.json({ message: "Authorized!", status: 200 });
    } else {
      res.json({ message: "Error: Unauthorized!", status: 401 });
    }
  }
});

module.exports = router;
