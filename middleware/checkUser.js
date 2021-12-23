const jwt = require("jsonwebtoken");
const config = require("../config/default.json");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log('token', token)
    
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      console.log('token', token)
      
      if (err) {
        res.status(401).json({ error: "error token" });
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
