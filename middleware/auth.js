const jwt = require("jsonwebtoken");
const config = require("../config/default.json");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Unauthorized" });
      } else {
        next();
      }
    });
  } catch (error) {
    res.status(401).json({
      error: new Error("Invalid request"),
    });
  }
};
