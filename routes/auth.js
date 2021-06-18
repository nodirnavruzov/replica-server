var express = require('express')
var router = express.Router()
const bcrypt = require('bcryptjs')
const config = require('../config/default.json')
const jwt = require('jsonwebtoken')
const configSQL = require('../config/sql.config')
const DBRequests = require('../sql')
const auth = require('../middleware/auth')
const moment = require('moment')
const HelperService = require('../utils/service')
const { body, validationResult } = require('express-validator')
const service = new HelperService()

router.post('/register', body('email').isEmail(), body('password').isLength({ min: 6 }), async (req, res) => {
  try {
    const dateNow = moment().format('DD-MM-YYYY HH:mm:ss')
    const { email, password } = req.body
    const con = new DBRequests(configSQL)
    const result = await con.checkUserEmail(email)
    if (!result.status) {
      return res.status(400).json({ errors: 'This e-mail is already registered' })
    } else {
      const hashedPassword = await bcrypt.hash(password, 12)
      const bool = await con.register({
        ...req.body,
        password: hashedPassword,
        registration_date: dateNow
      })
      if (bool) {
        res.status(201).json({ message: 'Registration completed successfully' })
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

router.post('/login', body('email').isEmail(), body('password').isLength({ min: 6 }), async (req, res) => {
  const errors = validationResult(req)
  console.log(errors)
  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    const con = new DBRequests(configSQL)
    const gettedUser = await con.getUsersByEmail(email)
    const isMatch = await bcrypt.compare(password, gettedUser[0].password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Password or email is wrong, try again' })
    }
    const token = jwt.sign({ gettedUser: gettedUser.id }, config.jwtSecret, {
      expiresIn: '8h'
    })
    const user = service.userModel(gettedUser)
    res.status(200).json({ token, user })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})

module.exports = router
