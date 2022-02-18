const jwt = require("jsonwebtoken");
const config = require("../config/default.json");

//* NEED REFACTOR
module.exports = async (email) => {
  const token = jwt.sign({ email }, config.jwtSecret, {
    expiresIn: '2h'
  })
  const link = `http://192.168.43.92:8080/reset-password/${token}`
  return link
}