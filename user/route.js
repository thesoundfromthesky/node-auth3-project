const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const db = require("../data/db");

const express = require("express");
const router = express.Router();
// | POST   | /api/register | Creates a `user` using the information sent inside the `body` of the request. **Hash the password** before saving the user to the database.                                                                                                                            |
// | POST   | /api/login    | Use the credentials sent inside the `body` to authenticate the user. On successful login, create a new JWT with the user id as the subject and send it back to the client. If login fails, respond with the correct status code and the message: 'You shall not pass!' |
// | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in respond with the correct status code and the message: 'You shall not pass!'.                                                                  |

router.post("/register", (req, res) => {
  req.body.password = bcryptjs.hashSync(req.body.password);
  db("users")
    .insert(req.body)
    .then(isCreated => {
      res.status(201).json("account creation success");
    })
    .catch(err => {
      res.status(500).json("Internal Server Error");
    });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const [user] = await db("users").where({ username });

    if (user && bcryptjs.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ access_token: token });
    } else {
      res.status(401).json("Unauthorized");
    }
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
});
router.get("/", authenticate, async (req, res) => {
  try {
    console.log(req.decoded);
    const users = await db("users");
    res.status(200).json(users);
  } catch {
    res.status(500).json("Internal Server Error");
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    username: user.username
    // ...otherData
  };

  const options = {
    expiresIn: "1d" // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, process.env.JWT_SECRET || "Demo key", options); // this method is synchronous
}

function authenticate(req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET || "Demo key", function(
      err,
      decoded
    ) {
      if (err) {
        res.status(401).json({ message: "Error with token" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
}
module.exports = router;
