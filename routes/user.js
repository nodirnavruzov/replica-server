var express = require('express')
var router = express.Router()
const checkUser = require('../middleware/checkUser')
const upload = require('../middleware/uploadAvatar')
const { body } = require('express-validator')
const { 
  getUser, 
  updatedUser, 
  comparePassword, 
  uploadAvatar, 
  changeSettings, 
  removeAvatar, 
  changePassword, 
} = require('../controller/userController')

router.get('/get-user/:id', getUser)
router.get('/upadated-user/:id', checkUser, updatedUser)

router.post('/compare-password', comparePassword)

router.post('/upload-avatar', checkUser, upload.single('avatar'), uploadAvatar)

router.delete('/remove-avatar', removeAvatar)

router.post('/change-settings', checkUser, changeSettings)

router.post('/change-password', body('password').isLength({ min: 6 }), checkUser, changePassword)

module.exports = router
