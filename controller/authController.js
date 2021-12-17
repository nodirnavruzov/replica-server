const bcrypt = require('bcryptjs')
const config = require('../config/default.json')
const jwt = require('jsonwebtoken')
const DBRequests = require('../sql')
const moment = require('moment')
const HelperService = require('../utils/service')
const { validationResult } = require('express-validator')
const service = new HelperService()
const verifyKey = require('../utils/verifyResetKey')
const sendEmail = require('../service/email')


module.exports.register = async (req, res) => {
  try {
    const con = new DBRequests()
    const { email, password } = req.body
    const verifyData = await sendEmail.verify(email)
    await con.add_verify_code(verifyData)
    const dateNow = moment().format('DD-MM-YYYY HH:mm:ss')
    const result = await con.checkUserEmail(email)
    if (!result.status) {
      return res.status(400).json({ errors: 'This e-mail is already registered' })
    } else {
      const hashedPassword = await bcrypt.hash(password, 12)
      const bool = await con.register({
        ...req.body,
        password: hashedPassword,
        registration_date: dateNow,
        verify: 0,
      })
      // check
      if (bool) {
        res.status(201).json({ status: true, message: 'Registration completed successfully' })
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.verifyCode = async (req, res) => {
  try {
    const { code } = req.body
    const con = new DBRequests()
    const [verify] = await con.verify_code(code)
    if (verify) {
      const result = await con.change_status_verify(verify)
      res.status(201).json({status: true, message: 'Verify completed successfully' })
    } else {
      res.status(500).json({ message: 'code expired or wrong' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}


module.exports.sendVerifyEmail = async (req, res) => {
  try {
    const con = new DBRequests()
    const { email } = req.body
    const verifyData = await sendEmail.verify(email)
    await con.add_verify_code(verifyData)
    res.status(200)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
}

module.exports.login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const con = new DBRequests()
    const { email, password } = req.body
    const gettedUser = await con.getUsersByEmail(email)
    const isMatch = await bcrypt.compare(password, gettedUser[0].password)
    
    if (!isMatch) {
      return res.status(200).json({
        status: isMatch,
        message: 'Password or email is wrong, try again' 
      })
    }
    const token = jwt.sign({ gettedUser: gettedUser.id }, config.jwtSecret, {
      expiresIn: '8h'
    })
    const [user] = service.userModel(gettedUser)
    
    return res.status(200).json({ 
      verify: !!gettedUser[0].verify,  
      status: isMatch,
      token,
      user 
    })
  } catch (error) {
    return res.status(500).json({status: false, message: 'Something went wrong, please try again' })
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

module.exports.sendResetPassword = async (req, res) => {
  try {
    await sendEmail.reset(req.body)
    return res.status(200).json({message: 'Email send'})
  } catch (error) {
    console.log('error', error)
  }
}

module.exports.checkResetToken = async (req, res) => {
  try {
    const token = req.params.token
    const result = await verifyKey(token)
    if (result.status) {
      return res.status(200).json({ email: result.decodedToken.email })
    } else {
      return res.status(200).json({ message: result.message })
    }
  } catch (error) {
    console.log('error', error)
  }
}
module.exports.resetPassword = async (req, res) => {
  try {
    const { password, email } = req.body
    const con = new DBRequests()
    const hashedPassword = await bcrypt.hash(password, 12)
    await con.reset_password({
      email,
      password: hashedPassword
    })
    return res.status(200).json({status: true, message: 'Password changed'})
  } catch (error) {
    console.log('error', error)
  }
}
