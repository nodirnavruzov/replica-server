function createPool() {
  try {
    const mysql = require('mysql2');

    const pool = mysql.createPool({
      host: "127.0.0.1",
      user: "root",
      password: "root",
      database: "blog",
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0
    });

    const promisePool = pool.promise();

    return promisePool;
  } catch (error) {
    return console.log(`Could not connect - ${error}`);
  }
}

const pool = createPool();

module.exports = {
  connection: async () => pool.getConnection(),
  execute: (...params) => pool.execute(...params)
};