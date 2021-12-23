const DBRequests = require('../sql')
const authorNameInfo = require('../utils/authorNameInfo')
const sort = require('../utils/sort')
const HelperService = require('../utils/service')
const service = new HelperService()

module.exports.getAllAricles = async (req, res) => {
  try {
    const con = new DBRequests()
    const row = await con.getAllArticles()
    for (let i = 0; i < row.length; i++) {
      let post = row[i]
      if (post.likes_count >= 0) {
        post.likes_count = { count: post.likes_count, inc: true }
      } else {
        post.likes_count = { count: post.likes_count, dec: true }
      }
    }
    const posts = await authorNameInfo(row, 'Array')
    const sortedByDate = sort(posts)
    res.json(sortedByDate)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.addNewPost = async (req, res) => {
  try {
    const con = new DBRequests()
    const status = await con.addPost(req.body)
    const posts = await con.user_posts(req.body)
    await con.update_post_count(posts.length, req.body)
    const currentUser = await con.user(req.body.user_id)
    const user = service.userModel(currentUser)
    res.json({ status, user })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.getPosts = async (req, res) => {
  try {
    const con = new DBRequests()
    const row = await con.getAllPosts()
    const posts = await authorNameInfo(row, 'Array')
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.getPost = async (req, res) => {
  try {
    const con = new DBRequests()
    const row = await con.getPost(req.params.id)
    const post = await authorNameInfo(...row, 'Object')

    if (post[0].likes_count >= 0) {
      post[0].likes_count = { count: post[0].likes_count, inc: true }
    } else {
      post[0].likes_count = { count: post[0].likes_count, dec: true }
    }
    
    res.json(post)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.getNews = async (req, res) => {
  try {
    const con = new DBRequests()
    const row = await con.getAllNews()
    for (let i = 0; i < row.length; i++) {
      let post = row[i]
      if (post.likes_count >= 0) {
        post.likes_count = { count: post.likes_count, inc: true }
      } else {
        post.likes_count = { count: post.likes_count, dec: true }
      }
    }
    const posts = await authorNameInfo(row, 'Array')
    const sortedByDate = sort(posts)
    res.json(sortedByDate)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.getUserPosts = async (req, res) => {
  try {
    const con = new DBRequests()
    const row = await con.user_posts(req.query)
    const posts = await authorNameInfo(row, 'Array')
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.getUserBookmark = async (req, res) => {
  try {
    const con = new DBRequests()
    const row = await con.getSavedPosts(req.query)
    const posts = row.map(item => item[0])
    const savedPosts = await authorNameInfo(posts, 'Array')
    res.json(savedPosts)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}


module.exports.savePost = async (req, res) => {
  try {
    const con = new DBRequests()
    const row = await con.save_post(req.body)
    res.status(200).json(row)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.checkSavedPost = async (req, res) => {
  try {
    const con = new DBRequests()
    const [status] = await con.check_saved_posts(req.body)
    if (status) {
      res.status(200).json({ status: true })
    } else {
      res.status(200).json({ status: false })
    }
    res.end()
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.contentLike = async (req, res) => {
  try {
    const con = new DBRequests()
    const row = await con.content_like(req.body)
    res.status(200).json(row)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.getContentLikes = async (req, res) => {
  try {
    const con = new DBRequests()
    const row = await con.get_content_likes_count(req.query)
    if (row[0].likes_count >= 0) {
      row[0].likes_count = { count: row[0].likes_count, inc: true }
    } else {
      row[0].likes_count = { count: row[0].likes_count, dec: true }
    }
    res.status(200).json(row)
    res.end()
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.getUserLikes = async (req, res) => {
  try {
    const con = new DBRequests()
    const row = await con.get_user_likes(req.query)
    if (!row.length) {
      res.status(200).json({ row, status: null })
    } else if (row[0].status_like == 1) {
      res.status(200).json({ row, status: true })
    } else if (row[0].status_like == 0) {
      res.status(200).json({ row, status: false })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}