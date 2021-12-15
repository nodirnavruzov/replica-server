const bcrypt = require('bcryptjs')
const config = require('../config/default.json')
const jwt = require('jsonwebtoken')
const DBRequests = require('../sql')
const moment = require('moment')
const HelperService = require('../utils/service')
const { validationResult } = require('express-validator')
const service = new HelperService()
const  verifyKey = require('../utils/verifyResetKey')


module.exports.register = async (req, res) => {
  try {
    const dateNow = moment().format('DD-MM-YYYY HH:mm:ss')
    const { email, password } = req.body
    const con = new DBRequests()
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
}

module.exports.login = async (req, res) => {
  const errors = validationResult(req)
  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    const con = new DBRequests()
    const gettedUser = await con.getUsersByEmail(email)
    const isMatch = await bcrypt.compare(password, gettedUser[0].password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Password or email is wrong, try again' })
    }
    const token = jwt.sign({ gettedUser: gettedUser.id }, config.jwtSecret, {
      expiresIn: '8h'
    })
    const user = service.userModel(gettedUser)
    res.status(200).json({status: true, token, user })
  } catch (error) {
    res.status(500).json({status: false, message: 'Something went wrong, please try again' })
  }
}

module.exports.checkResetPassword = async (req, res) => {
  try {
    const token = req.body.t
    const result = await verifyKey(token)
    if (result.status) {
      const con = new DBRequests()
      const gettedUser = await con.get_reset_password(result.decodedToken)
      delete gettedUser[0].token
      delete gettedUser[0].password
      const user = gettedUser
      return res.status(result.statusCode).json({ ...user })
    }else {
      return res.status(result.statusCode).json({ ...result })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.resetPassword = async (req, res) => {
  try {
    const con = new DBRequests()
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    req.body.password = hashedPassword
    const result = await con.change_password(req.body)
    res.status(200).json({ passwordReset: !!result })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}