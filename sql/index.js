// const e = require("express");
const mysql = require('mysql2/promise')
// TODO fix 'To many connections' con.end() not working check con.relase()

const connect = require('../sql/connect');


module.exports = class DBRequests {
  constructor(config) {
    this.config = config
  }

  async register(req) {
    let connection
    try {
      const connection = await mysql.createConnection(this.config)
      await connection.execute(
        `INSERT INTO users(name,surname, email, password, registration_date, avatar) VALUES ('${req.name}','${req.surname}', '${req.email}', '${req.password}', '${req.registration_date}', '')`
      )
      return true
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }
  async getUsersByEmail(userEmail) {
    let connection
    try {
      connection = await mysql.createConnection(this.config)
      const [rows] = await connection.execute(`SELECT *  FROM users WHERE email = '${userEmail}'`)
      return rows
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }

  async getUsersById(id) {
    let connection
    try {
      connection = await mysql.createConnection(this.config)
      const [users] = await connection.execute(`SELECT *  FROM users WHERE id = '${id}'`)
      return users
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }
  async getUsers(id) {
    let connection
    try {
      connection = await mysql.createConnection(this.config)
      const [users] = await connection.execute(`SELECT *  FROM users`)
      return users
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }

  async checkUserEmail(email) {
    let connection
    console.log(email)

    try {
      connection = await mysql.createConnection(this.config)
      const [rows] = await connection.execute(`SELECT * FROM users WHERE email = '${email}'`)
      console.log(!!rows.length)
      console.log(rows.length)

      if (rows.length) {
        return { status: false, message: 'already registered' }
      } else {
        return { status: true }
      }
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }

  async getAllPosts() {
    let connection

    try {
      connection = await mysql.createConnection(this.config)
      const [rows] = await connection.execute('SELECT * FROM posts  order by date DESC')

      return rows
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }

  async getAllNews() {
    let connection
    try {
      // connection = await mysql.createConnection(this.config)
      const [rows] = await connect.execute(
        "SELECT * FROM posts WHERE category = 'News' order by original_date DESC"
      )

      return rows
    } catch (error) {
      console.log(error)
    }
    // connection.end()
  }

  async getAllArticles() {
    let connection

    try {
      // connection = await mysql.createConnection(this.config)
      const [rows] = await connect.execute(`SELECT * FROM posts WHERE category != 'News'`)

      return rows
    } catch (error) {
      console.log(error)
    }
    // connection.end()
  }
  async getArticlesCategory(category) {
    let connection

    try {
      connection = await mysql.createConnection(this.config)
      const [rows] = await connection.execute(
        `SELECT * FROM posts WHERE category = '${category}'
        order by date DESC
        `
      )
      return rows
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }

  async addPost(data) {
    let connection
    try {
      const post = mysql.escape(data.post)
      // const imgPreview = mysql.escape(data.previewImage);
      connection = await mysql.createConnection(this.config)
      const [status] = await connection.execute(
        `INSERT INTO
        posts
        (
          category,
          title,
          post,
          jsonData,
          date,
          description_preview,
          image_preview,
          user_id,
          original_date

        )
        VALUES
        (
          "${data.categories.name}",
          "${data.title}",
          ${post},
          "${data.jsonData}",
          "${data.date}",
          "${data.preview}",
          "${data.previewImage}",
          "${data.user_id}",
          "${data.original_date}"
        )`
      )

      return status
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }
  async getPost(id) {
    let connection
    try {
      connection = await mysql.createConnection(this.config)
      const [rows] = await connection.execute(`SELECT * FROM  posts WHERE id = '${id}'`)
      let views = rows[0].views + 1
      rows[0].views = views
      await connection.execute(`UPDATE posts SET views=${views} WHERE id = '${id}'`)

      return rows
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }
  async user_posts(user) {
    console.log('USER', user)

    let connection
    try {
      connection = await mysql.createConnection(this.config)
      const [posts] = await connection.execute(
        `SELECT * FROM  posts WHERE user_id = '${user.user_id}' order by date DESC`
      )
      return posts
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }
  async update_post_count(count, body) {
    let connection

    try {
      connection = await mysql.createConnection(this.config)
      await connection.execute(`UPDATE users SET post_count=${count} WHERE id=${body.user_id}`)
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }

  async user(id) {
    let connection
    try {
      connection = await mysql.createConnection(this.config)
      const [user] = await connection.execute(`SELECT * FROM users WHERE id = '${id}'`)
      return user
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }

  async getSavedPosts(id) {
    let connection
    try {
      connection = await mysql.createConnection(this.config)
      const [ides] = await connection.execute(`SELECT * FROM saved_posts  WHERE user_id = '${id.user_id}'`)
      const posts = []
      for (const iterator of ides) {
        const [post] = await connection.execute(`SELECT * FROM posts WHERE id = '${iterator.post_id}'`)
        posts.push(post)
      }

      return posts
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }
  async save_post(ides) {
    let connection
    try {
      let row = []
      connection = await mysql.createConnection(this.config)
      const [saved_posts_row] = await connection.execute(
        `SELECT * FROM saved_posts WHERE post_id = '${ides.post_id}' `
      )

      if (saved_posts_row.length) {
        ;[row] = await connection.execute(`DELETE FROM saved_posts WHERE post_id = '${ides.post_id}' `)

        return { message: 'deleted', post_id: ides.post_id }
      } else {
        ;[row] = await connection.execute(
          `INSERT INTO saved_posts(user_id,post_id) VALUES (${ides.user_id},${ides.post_id})`
        )
        connection.end()

        return { message: 'added', post_id: ides.post_id }
      }
    } catch (error) {
      console.error(error)
    }
    connection.end()
  }

  async check_saved_posts(ides) {
    let connection
    try {
      // connection = await mysql.createConnection(this.config)
      const [status] = await connect.execute(`
      SELECT * FROM saved_posts WHERE post_id = '${ides.post_id}' && user_id = '${ides.user_id}'`)
      // connection.end()
      return status
    } catch (error) {
      console.log(error)
    }
    // connection.end()
  }
  // DRY - dont repeat yourself
  async content_like(body) {
    // variables
    let ex_result = null // result
    let connection // database connection

    // initial parameters
    const is_like = body.value == 'like' ? 1 : 0
    let step = is_like ? 1 : -1 // step for update post count

    try {
      connection = await mysql.createConnection(this.config)
      const [exsists] = await connection.execute(
        `SELECT * FROM likes_table WHERE post_id = ${body.post_id} && user_id = ${body.user_id}`
      )
      if (exsists.length) {
        let status = exsists[0].status_like

        if (status == is_like) {
          ;[ex_result] = await connection.execute(
            `DELETE FROM likes_table WHERE post_id = '${body.post_id}' && user_id = '${body.user_id}'`
          )
          step = is_like ? -1 : 1
        } else {
          ;[ex_result] = await connection.execute(
            `UPDATE likes_table SET status_like=${is_like} WHERE post_id = '${body.post_id}' && user_id = '${body.user_id}'`
          )
          step = is_like ? 2 : -2
        }
      } else {
        await connection.execute(
          `INSERT INTO likes_table (user_id, post_id, status_like) VALUES ('${body.user_id}', '${body.post_id}', ${is_like})`
        )
      }

      ;[ex_result] = await connection.execute(`
          UPDATE posts SET likes_count=likes_count + ${step} WHERE id = '${body.post_id}'
            `)
    } catch (error) {
      console.log(error)
    }
    if (connection) connection.end()
    return ex_result
  }

  async get_content_likes_count(query) {
    // let connection
    let likes
    try {
      // connection = await mysql.createConnection(this.config)
      ;[likes] = await connect.execute(`SELECT likes_count FROM posts WHERE id = ${query.post_id}`)
    } catch (error) {
      console.log(error)
    }
    // connection.end()
    return likes
  }

  async get_user_likes(query) {
    let connection
    try {
      // connection = await mysql.createConnection(this.config)
      const [row] = await connect.execute(
        `SELECT * FROM likes_table WHERE post_id = ${query.post_id} && user_id = ${query.user_id}`
      )
      return row
    } catch (error) {
      console.log(error)
    }
    // connection.end()
  }

  async upload_avatar(obj) {
    const url_avatar = mysql.escape(obj.url)
    let connection

    try {
      connection = await mysql.createConnection(this.config)
      const [row] = await connection.execute(
        `UPDATE users SET avatar = ${url_avatar} WHERE id = ${obj.user_id}`
      )
      if (row.changedRows == 1) {
        return obj.url
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }

  async remove_avatar(id) {
    let connection
    try {
      connection = await mysql.createConnection(this.config)
      const [row] = await connection.execute(`UPDATE users SET avatar='' WHERE id=${id}`)
      return row
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }

  async change_settings(user) {
    let connection
    let query = `UPDATE users SET name='${user.name}', surname='${user.surname}', email='${user.email}'`
    if (user.avatar != '') {
      query += `, avatar='${user.avatar}'`
    }
    query += ` WHERE id='${user.id}'`
    try {
      connection = await mysql.createConnection(this.config)
      const [res] = await connection.execute(query)
      return res
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }

  async change_password(user_info) {
    console.log(user_info)
    let connection
    try {
      connection = await mysql.createConnection(this.config)
      const row = await connection.execute(
        `UPDATE users SET password='${user_info.password}' WHERE id='${user_info.id}'`
      )
      return row
    } catch (error) {
      console.log(error)
    }
  }

  async get_user_password(user_id) {
    let connection
    try {
      connection = await mysql.createConnection(this.config)
      const [password] = await connection.execute(`SELECT password FROM users WHERE id = ${user_id}`)
      return password
    } catch (error) {
      console.log(error)
    }
    connection.end()
  }
}
