const mysql = require("mysql2/promise");

module.exports = class DBRequests {
  constructor(config) {
    this.config = config;
  }

  async register(req) {
    try {
      const connection = await mysql.createConnection(this.config);
      await connection.execute(
        `INSERT INTO users(first_name,last_name, email, password) VALUES ('${req.name}','${req.surname}', '${req.email}', '${req.password}')`
      );
    } catch (error) {
      console.log(error);
    }
  }
  async getUsers(userEmail) {
    try {
      const connection = await mysql.createConnection(this.config);
      const [rows] = await connection.execute(
        `SELECT *  FROM users WHERE email = '${userEmail}'`
      );

      return rows;
    } catch (error) {
      console.log(error);
    }
  }

  async checkUserEmail(email) {
    try {
      const connection = await mysql.createConnection(this.config);
      const [rows] = await connection.execute(
        `SELECT * FROM users WHERE email = '${email}'`
      );
      if (rows) {
        console.log("already registered");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getAllPosts() {
    try {
      const connection = await mysql.createConnection(this.config);
      const [rows] = await connection.execute("SELECT * FROM posts");

      return rows;
    } catch (error) {
      console.log(error);
    }
  }

  async addPost(data) {
    try {
      const post = mysql.escape(data.post);
      const connection = await mysql.createConnection(this.config);
      const [rows] = await connection.execute(
        `INSERT INTO
        posts
        (
          category,
          title,
          post,
          name,
          surname,
          jsonData,
          date,
          description_preview,
          user_id
        )
        VALUES
        (
          "${data.category}",
          "${data.title}",
          ${post},
          "${data.author.name}",
          "${data.author.surname}",
          "${data.jsonData}",
          "${data.date}",
          "${data.preview}",
          "${data.user_id}"
          
        )`
      );

      return rows;
    } catch (error) {
      console.log(error);
    }
  }
  async getPost(id) {
    try {
      const connection = await mysql.createConnection(this.config);
      const [rows] = await connection.execute(
        `SELECT * FROM  posts WHERE id = '${id}'`
      );

      return rows;
    } catch (error) {
      console.log(error);
    }
  }
  async user_posts(id) {
    try {
      const connection = await mysql.createConnection(this.config);
      const [rows] = await connection.execute(
        `SELECT * FROM  posts WHERE user_id = '${id}'`
      );

      return rows;
    } catch (error) {
      console.log(error);
    }
  }
};
