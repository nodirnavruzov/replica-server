const moment = require('moment-timezone');
const logger = require("morgan");

logger.token('date', (req, res, tz) => {
  return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
})

logger.format('myformat', ':date[Asia/Tashkent] | :method | :url | :response-time ms');
   
module.exports = logger