const nodemailer = require('nodemailer');
const crypto = require('crypto');
const config = require('../config/emailConfig');
const { request } = require('express');

const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass
  }
});

exports.sendOtp = (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomBytes(3).toString('hex');
  req.session.otp = otp;
  req.session.email = email;
  console.log("otp",req.session.otp)
  const mailOptions = {
    from: config.email.auth.user,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  console.log(otp)
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      res.status(200).send('OTP sent');
    }
  });
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  console.log(otp)
  if (req.session.otp === otp && req.session.email === email) {
    res.status(200).send('Login successful');
  } else {
    res.status(400).send('Invalid OTP');
  }
};
