const jwt = require("jsonwebtoken");
const config = require("../config/default.json");

//* NEED REFACTOR
module.exports = async (email) => {
  const token = jwt.sign({ email }, config.jwtSecret, {
    expiresIn: '8h'
  })
  const link = `${config.baseUrl}:${config.fontendPort}/reset-password/${token}`
  console.log('link', link)
  return link
}