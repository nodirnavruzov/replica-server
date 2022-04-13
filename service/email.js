"use strict";
const nodemailer = require("nodemailer");
const config = require('../config/default.json')
const genLink  = require('../utils/generateLink')
const getCode  = require('../utils/generateCode')

module.exports.reset = async (user, cb) => {

  try {
    const link = await genLink(user)
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port: 465,
      secure: true,
      auth: {
        user: config.smptLogin,
        pass: config.smptPassword,
      }
    })
    transporter.sendMail({
      from: "Replica Blog", // sender address
      to: user.email, // list of receivers
      subject: "Hello Friend", // Subject line
      html: `<b>Link for reset password </b>
        <div><a href="${link}">Reset password</a></div>
      `, // html body
    }, (err, mess) => {
      if(err) {
        cb(err)
      } else {
        cb(null, mess)
      }
    });
  } catch (error) {
    cb(error)
  }
}


module.exports.verify = async (email, cb) => {
  
  try {
    const data = await getCode(email)
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port: 465,
      secure: true,
      auth: {
        user: config.smptLogin,
        pass: config.smptPassword,
      }
    });
  
    transporter.sendMail({
      from: 'Replica Blog', // sender address
      to: email, // list of receivers
      subject: "Hello Friend", // Subject line
      html:
        `<b> Verification code</b>
         <h1>${data.code}</h1>
        `, // html body
    }, (err, _) => {
      if(!err) {
        cb(null, data)
      } else {
        console.log('err ======>', err)
        cb(err)
      }
    });
  } catch (error) {
    cb(error)
  }

}
