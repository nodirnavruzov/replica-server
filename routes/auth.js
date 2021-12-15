var express = require('express')
const { body } = require('express-validator')
var router = express.Router()

const { 
  register, 
  login, 
  checkResetPassword, 
  resetPassword, 
} = require('../controller/authController')

router.post('/register', body('email').isEmail(), body('password').isLength({ min: 6 }), register )

router.post('/login', body('email').isEmail(), body('password').isLength({ min: 6 }), login )

router.post('/check-reset-password', checkResetPassword )

router.post('/reset-password', resetPassword )

module.exports = router
