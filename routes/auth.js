var express = require('express')
const { body } = require('express-validator')
var router = express.Router()

const { 
  register, 
  login, 
  checkResetPassword, 
  sendResetPassword, 
  checkResetToken, 
  resetPassword, 
  verifyCode, 
  sendVerifyEmail, 
} = require('../controller/authController')

router.post('/register', body('email').isEmail(), body('password').isLength({ min: 6 }), register )

router.post('/login', body('email').isEmail(), body('password').isLength({ min: 6 }), login )

router.post('/check-reset-password', checkResetPassword )

router.get('/check-reset-token/:token', checkResetToken )

router.post('/reset-password', resetPassword )

router.post('/verify-code', verifyCode )

router.post('/send-reset-email', sendResetPassword )

router.post('/send-verify-email', sendVerifyEmail )

module.exports = router
