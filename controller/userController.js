const DBRequests = require('../sql')
const bcrypt = require('bcryptjs')


module.exports.getUser = async (req, res) => {
  try {
    const con = new DBRequests()
    const user = await con.user(req.params.id)
    delete user[0].password
    const x = { user_id: req.params.id }
    const row = await con.user_posts(x)
    let count = 0
    for (let i = 0; i < row.length; i++) {
      count += Number(row[i].likes_count)
    }
    if (count >= 0) {
      user[0].likes_count = { count, inc: true }
    } else {
      user[0].likes_count = { count, dec: true }
    }
    
    res.json(user[0]).status(200)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.updatedUser = async (req, res) => {
  try {
    const con = new DBRequests()
    const user = await con.user(req.params.id)
    delete user[0].password
    res.json(user).status(200)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.comparePassword = async (req, res) => {
  try {
    const con = new DBRequests()
    const password = await con.get_user_password(req.body.user_id)
    const isMatch = await bcrypt.compare(req.body.current_password, password[0].password)
    if (!isMatch) {
      return res.status(200).json({
        status: false,
        message: 'Current Password is wrong, try again'
      })
    } else {
      return res.status(200).json({ status: true, message: 'Current password is matching' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.uploadAvatar = async (req, res) => {
  try {
    const url = `http://localhost:3000/${req.file.filename}`
    res.status(200).json({
      url
    })
  } catch (error) {
    res.status(500).json({ essage: 'Something went wrong, please try again' })
  }
}

module.exports.removeAvatar = async (req, res) => {
  try {
    const connection = new DBRequests()
    const result = await connection.remove_avatar(req.query.id)
    res.status(200).json({ status: true, message: 'Avatar successfully deleted' })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Something went wrong, please try again'
    })
  }
}

module.exports.changeSettings = async (req, res) => {
  let response
  try {
    const con = new DBRequests()
    const password = await con.get_user_password(req.body.userForm.id)
    const isMatch = await bcrypt.compare(req.body.userForm.current_password, password[0].password)
    if (isMatch) {
      if (req.body.userForm.avatar == '') {
        req.body.userForm.avatar = 'http://localhost:3000/avatar'
      }
      response = await con.change_settings(req.body.userForm)
      res.status(200).json({ status: true, message: 'Settings changed' })
    } else {
      res.status(200).json({
        status: false,
        message: 'Current Password is wrong, try again'
      })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.changePassword = async (req, res) => {
  let response
  try {
    const con = new DBRequests()
    const password = await con.get_user_password(req.body.userForm.id)
    const isMatch = await bcrypt.compare(req.body.userForm.current_password, password[0].password)
    if (isMatch) {
      const hashedPassword = await bcrypt.hash(req.body.userForm.new_password, 12)
      const user = {
        id: req.body.userForm.id,
        password: hashedPassword
      }
      response = await con.change_password(user)
      res.status(200).json({ status: true, message: 'Password changed' })
    } else {
      res.status(200).json({
        status: false,
        message: 'Something went wrong, please try again'
      })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}