var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("../config/default.json");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const configSQL = require("../config/sql.config");
const DBRequests = require("../sql");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const con = new DBRequests(configSQL);
    const result = await con.checkUserEmail(email);
    console.log(result);

    // res.status(406).json({ message: "This e-mail is already registered" });
    // res.end();
    // return;
    const hashedPassword = await bcrypt.hash(password, 12);
    await con.register({ ...req.body, password: hashedPassword });
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const con = new DBRequests(configSQL);
    const user = await con.getUsers(email);
    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Password or email is wrong, try again" });
    }

    const token = jwt.sign({ user: user.id }, config.jwtSecret, {
      expiresIn: "8h",
    });
    delete user[0].password;
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

router.post("/add-posts", auth, async (req, res) => {
  try {
    console.log(req.body)
    const con = new DBRequests(configSQL);
    const row = await con.addPost(req.body);
    res.json(row);  
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

router.get("/all-posts", async (req, res) => {
  try {
    const con = new DBRequests(configSQL);
    const row = await con.getAllPosts();
    console.log(row);
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

router.get("/get-post/:id", async (req, res) => {
  try {
    const con = new DBRequests(configSQL);
    const row = await con.getPost(req.params.id);
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});
router.get("/user-posts", async (req, res) => {
  try {
    const con = new DBRequests(configSQL);
    const row = await con.user_posts(req.query.user_id);
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});
router.post("/upload-image", upload.single('image'),  async (req, res) => {
  try {
    console.log(req)
    res.end()
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

module.exports = router;
