// const e = require("express");
const mysql = require('mysql2/promise')
// TODO fix 'To many connections' con.end() not working check con.relase()

const connection = require('../sql/connect');


module.exports = class DBRequests {
  
  async register(req) {
    try {
      await connection.execute(
        `INSERT INTO users(firstname,lastname, email, password, registration_date, avatar) VALUES ('${req.firstname}','${req.lastname}', '${req.email}', '${req.password}', '${req.registration_date}', '')`
      )
      return true
    } catch (error) {
      return error
    }
  }

  async getUsersByEmail(userEmail) {
    try {
      const [rows] = await connection.execute(`SELECT *  FROM users WHERE email = '${userEmail}'`)
      return rows
    } catch (error) {
      return error
    }
  }

  async getUsersById(id) {
    try {
      const [users] = await connection.execute(`SELECT *  FROM users WHERE id = '${id}'`)
      return users
    } catch (error) {
      return error
    }
  }

  async getUsers() {
    try {
      const [users] = await connection.execute(`SELECT *  FROM users`)
      return users
    } catch (error) {
      return error
    }
  }

  async checkUserEmail(email) {
    try {
      const [rows] = await connection.execute(`SELECT * FROM users WHERE email = '${email}'`)
      if (rows.length) {
        return { status: false, message: 'already registered' }
      } else {
        return { status: true }
      }
    } catch (error) {
      return error
    }
  }

  async getAllPosts() {
    try {
      const [rows] = await connection.execute('SELECT * FROM posts  order by date DESC')
      return rows
    } catch (error) {
      return error
    }
  }

  async getAllNews() {
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM posts WHERE category = 'News' order by original_date DESC"
      )
      return rows
    } catch (error) {
      return error
    }
  }

  async getAllArticles() {

    try {
      const [rows] = await connection.execute(`SELECT * FROM posts WHERE category != 'News'`)

      return rows
    } catch (error) {
      return error
    }
  }

  async getArticlesCategory(category) {
    try {
      const [rows] = await connection.execute(
        `SELECT * FROM posts WHERE category = '${category}'
        order by date DESC
        `
      )
      return rows
    } catch (error) {
      return error
    }
  }

  async addPost(data) {
    try {
      const post = mysql.escape(data.post)
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
      return error
    }
  }

  async getPost(id) {
    try {
      const [rows] = await connection.execute(`SELECT * FROM  posts WHERE id = '${id}'`)
      let views = rows[0].views + 1
      rows[0].views = views
      await connection.execute(`UPDATE posts SET views=${views} WHERE id = '${id}'`)
      return rows
    } catch (error) {
      return error
    }
  }

  async user_posts(user) {
    try {
      const [posts] = await connection.execute(
        `SELECT * FROM  posts WHERE user_id = '${user.user_id}' order by date DESC`
      )
      return posts
    } catch (error) {
      return error
    }
  }
  async update_post_count(count, body) {
    try {
      await connection.execute(`UPDATE users SET post_count=${count} WHERE id=${body.user_id}`)
    } catch (error) {
      return error
    }
  }

  async user(id) {
    try {
      const [user] = await connection.execute(`SELECT * FROM users WHERE id = '${id}'`)
      return user
    } catch (error) {
      return error
    }
  }

  async getSavedPosts(id) {
    try {
      const [ides] = await connection.execute(`SELECT * FROM saved_posts  WHERE user_id = '${id.user_id}'`)
      const posts = []
      for (const iterator of ides) {
        const [post] = await connection.execute(`SELECT * FROM posts WHERE id = '${iterator.post_id}'`)
        posts.push(post)
      }

      return posts
    } catch (error) {
      return error
    }
  }

  async save_post(ides) {
    try {
      let row = []
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

        return { message: 'added', post_id: ides.post_id }
      }
    } catch (error) {
      console.error(error)
    }
  }

  async check_saved_posts(ides) {
    try {
      const [status] = await connection.execute(`
      SELECT * FROM saved_posts WHERE post_id = '${ides.post_id}' && user_id = '${ides.user_id}'`)
      return status
    } catch (error) {
      return error
    }
  }
  async content_like(body) {
    let ex_result = null // result

    // initial parameters
    const is_like = body.value == 'like' ? 1 : 0
    let step = is_like ? 1 : -1 // step for update post count

    try {
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
      return error
    }
    return ex_result
  }

  async get_content_likes_count(query) {
    
    let likes
    try {
      ;[likes] = await connection.execute(`SELECT likes_count FROM posts WHERE id = ${query.post_id}`)
    } catch (error) {
      return error
    }
    return likes
  }

  async get_user_likes(query) {
    try {
      const [row] = await connection.execute(
        `SELECT * FROM likes_table WHERE post_id = ${query.post_id} && user_id = ${query.user_id}`
      )
      return row
    } catch (error) {
      return error
    }
  }

  async upload_avatar(obj) {
    const url_avatar = mysql.escape(obj.url)
    try {
      const [row] = await connection.execute(
        `UPDATE users SET avatar = ${url_avatar} WHERE id = ${obj.user_id}`
      )
      if (row.changedRows == 1) {
        return obj.url
      } else {
        return false
      }
    } catch (error) {
      return error
    }
  }

  async remove_avatar(id) {
    try {
      const [row] = await connection.execute(`UPDATE users SET avatar='' WHERE id=${id}`)
      return row
    } catch (error) {
      return error
    }
  }

  async change_settings(user) {
    let query = `UPDATE users SET firstname='${user.firstname}', lastname='${user.lastname}', email='${user.email}'`
    if (user.avatar != '') {
      query += `, avatar='${user.avatar}'`
    }
    query += ` WHERE id='${user.id}'`
    try {
      const [res] = await connection.execute(query)
      return res
    } catch (error) {
      return error
    }
  }

  async change_password(user_info) {
    // const password = mysql.escape(user_info.password)
    try {
      const row = await connection.execute(
        `UPDATE users SET password='${user_info.password}' WHERE id='${user_info.id}'`
      )
      return row
    } catch (error) {
      return error
    }
  }
  async reset_password(user) {
    try {
      const [row] = await connection.execute(
        `UPDATE users SET password='${user.password}' WHERE email='${user.email}'`
      )
      return row
    } catch (error) {
      return error
    }
  }

  async get_user_password(user_id) {
    try {
      const [password] = await connection.execute(`SELECT password FROM users WHERE id = ${user_id}`)
      return password
    } catch (error) {
      return error
    }
  }

  async add_verify_code(data) {
    const email = mysql.escape(data.email)
    try {
      const [rows] = await connection.execute(`SELECT * FROM verify_code WHERE email = ${email}`)
      if (rows.length) {
        const [row] = await connection.execute(`UPDATE verify_code SET email='${data.email}', code='${data.code}', exp='${data.exp}'`)

      } else {
        const [row] = await connection.execute(`INSERT INTO verify_code(email,code,exp) VALUES ("${data.email}","${data.code}","${data.exp}")`)
      }
    } catch (error) {
      return error
    }
  }

  async verify_code(data) {
    try {
     const [row] = await connection.execute(`SELECT * FROM verify_code WHERE code = '${data}'`)
     return row
    } catch (error) {
      return error
    }
  }

  async change_status_verify(data) {
    const email = mysql.escape(data.email)
    try {
     const [row] = await connection.execute(`UPDATE users SET verify='1' WHERE email=${email}`)
     return row
    } catch (error) {
      return error
    }
  }

}
