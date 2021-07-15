var express = require('express')
var router = express.Router()
const DBRequests = require('../sql')
const checkUser = require('../middleware/checkUser')
const upload = require('../middleware/uploadAvatar')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')

router.get('/get-user/:id', async (req, res) => {
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
})
router.get('/upadated-user/:id', checkUser, async (req, res) => {
  try {
    const con = new DBRequests()
    const user = await con.user(req.params.id)
    delete user[0].password
    res.json(user).status(200)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

router.post('/compare-password', async (req, res) => {
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
})

router.post('/upload-avatar', checkUser, upload.single('avatar'), async (req, res) => {
  try {
    const url = `http://localhost:3000/${req.file.filename}`
    res.status(200).json({
      url
    })
  } catch (error) {
    res.status(500).json({ essage: 'Something went wrong, please try again' })
  }
})
router.delete('/remove-avatar', async (req, res) => {
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
})

router.post('/change-settings', checkUser, async (req, res) => {
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
})

router.post('/change-password', body('password').isLength({ min: 6 }), checkUser, async (req, res) => {
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
})

module.exports = router
