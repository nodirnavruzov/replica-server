"use strict";
const nodemailer = require("nodemailer");
const genLink  = require('../utils/generateLink')
const getCode  = require('../utils/generateCode')

module.exports.reset = async (user) => {

  try {
    const link = await genLink(user)
  
    let transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru', // no need to set host or port etc.
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'replica.blog@mail.ru',
        pass: 'hFGqyDCaJBFzwhV9bAzS'
      }
    });
  
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <replica.blog@mail.ru>', // sender address
      to: user.email, // list of receivers
      subject: "Hello ✔", // Subject line
      html: `<b>Link for reset password </b>
        <div><a href="${link}">Reset password</a></div>
      `, // html body
    });
  } catch (error) {
    return error
  }
}


module.exports.verify = async (email) => {
  try {
    const data = await getCode(email)
    let transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru', // no need to set host or port etc.
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'replica.blog@mail.ru',
        pass: 'hFGqyDCaJBFzwhV9bAzS'
      }
    });
  
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <replica.blog@mail.ru>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      html:
        `<b> Verification code</b>
         <h1>${data.code}</h1>
        `, // html body
    });
    return data
  } catch (error) {
    return error
  }

}
