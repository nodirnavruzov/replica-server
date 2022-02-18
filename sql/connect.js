const sqlConfig = ('../config/sql.config.js') 

function createPool() {
  try {
    const mysql = require('mysql2');
    const pool = mysql.createPool({
      host: sqlConfig.HOST,
      user: sqlConfig.USER,
      password: sqlConfig.PASSWORD,
      database: sqlConfig.DB,
      connectionLimit: sqlConfig.connectionLimit,
      waitForConnections: true,
      queueLimit: 0
    });
    return pool.promise();
  } catch (error) {
    return console.log(`Could not connect - ${error}`);
  }
}

const pool = createPool();

module.exports = {
  connection: async () => pool.getConnection(),
  execute: (...params) => pool.execute(...params)
};