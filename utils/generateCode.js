const crypto = require("crypto");

module.exports = async (email) => {
  const code = crypto.randomBytes(5).toString("hex");
  const date = Date.now()
  const data = {
    email,
    code,
    exp: date
  }
  return data
}
