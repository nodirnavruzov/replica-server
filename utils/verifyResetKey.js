const jwt = require("jsonwebtoken");
const config = require("../config/default.json");

module.exports = async function verifyKey(params) {
  const token = params
  
  return jwt.verify(token, config.jwtSecret, async (err, decoded) => {
    if (err) {
      return { statusCode: 404, status: false, message: 'Token expired' }
    } else {
      return { statusCode: 200, status: true, message: 'Token', decodedToken: decoded, token }
    }
  });
}