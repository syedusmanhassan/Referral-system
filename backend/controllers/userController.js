const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// User Registration
const registerUser = async (req, res) => {
    console.log("Register user endpoint hit");
    const { username, email, password, referrer } = req.body;
    try {
      const user = new User({ username, email, password });
      if (referrer) {
        const referrerUser = await User.findOne({ referralCode: referrer });
        if (referrerUser) {
          user.referrer = referrerUser._id;
          referrerUser.referrals.push(user._id);
          await referrerUser.save();
        } else {
          return res.status(400).send('Invalid referral code');
        }
      }
      user.referralCode = `REF-${Date.now()}`;
      await user.save();
      res.status(201).send('User registered');
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  };
  

// User Login
const loginUser = async (req, res) => {
    console.log("Login endpoint hit");
    const { email, password } = req.body;
    console.log('Received login request:', req.body);
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found");
        return res.status(400).send('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(password);
      console.log(user.password);
      if (!isMatch) {
        console.log("Password does not match");
        return res.status(400).send('Invalid credentials');
      }
      const token = user.generateAuthToken();
      console.log("Login successful");
      res.send({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  };
  

// Change Password
const changePassword = async (req, res) => {
  const { password } = req.body;
  try {
    req.user.password = password;
    await req.user.save();
    res.send('Password changed');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get User Data
const getUserData = async (req, res) => {
  res.send(req.user);
};

// Get User Registrations
const getUserRegistrations = async (req, res) => {
  const countReferrals = async (userId) => {
    const user = await User.findById(userId).populate('referrals');
    let count = user.referrals.length;
    for (let referral of user.referrals) {
      count += await countReferrals(referral._id);
    }
    return count;
  };
  const totalRegistrations = await countReferrals(req.user._id);
  res.send({ totalRegistrations });
};

// Get User Referrals
const getUserReferrals = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('referrals');
      const directReferrals = user.referrals.length;
  
      const indirectReferrals = await Promise.all(
        user.referrals.map(async (referral) => {
          const subReferrals = await User.findById(referral._id).populate('referrals');
          return subReferrals.referrals.length;
        })
      );
  
      const totalIndirectReferrals = indirectReferrals.reduce((acc, count) => acc + count, 0);
  
      res.send({ directReferrals, indirectReferrals: totalIndirectReferrals });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

// Send Password Reset Email
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send('User not found');
      }
  
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
  
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'enter-your-email-here@gmail.com',
          pass: 'enter-your-password-here', // Use the app password generated from Google
        },
      });
  
      const mailOptions = {
        to: user.email,
        from: 'enter-your-email-here',
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://localhost:3000/reset-password/${resetToken}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
      //Manually configure the the website...
      //http://${req.headers.host}/reset-password/${resetToken}\n\n
  
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.error('There was an error: ', err);
          res.status(500).send('Error sending email');
        } else {
          res.status(200).send('Recovery email sent');
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  
  
// Reset Password
const resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;
    try {
      console.log('Received reset token:', resetToken);
      console.log('Received new password:', password);
  
      const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        console.log('User not found or token expired');
        return res.status(400).send('Password reset token is invalid or has expired');
      }
  
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.log('Password reset successful');
      res.status(200).send('Password has been reset');
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).send('Server error');
    }
  };
  



module.exports = { registerUser, loginUser, changePassword, getUserData, getUserRegistrations, getUserReferrals, forgotPassword, resetPassword };
