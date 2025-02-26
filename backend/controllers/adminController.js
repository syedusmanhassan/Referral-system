const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Admin Login
const adminLogin = async (req, res) => {
    const { username, password } = req.body;
  
    console.log('Received login request:', req.body); // Log the request data
  
    try {
      const admin = await Admin.findOne({ username });
      if (!admin) {
        console.log('Admin not found');
        return res.status(400).send('Invalid username or password');
      }
      
      const isMatch = await bcrypt.compare(password, admin.password);
      console.log(password);
      console.log(admin.password);
      if (!isMatch) {
        console.log('Password does not match');
        return res.status(400).send('Invalid username or password');
      }
  
      const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.send({ token });
    } catch (error) {
      console.log('Error:', error.message); // Log any errors
      res.status(500).send(error.message);
    }
  };
  
  // Forgot Password
  const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).send('Admin not found');
      }
  
      const resetToken = crypto.randomBytes(32).toString('hex');
      admin.resetPasswordToken = resetToken;
      admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await admin.save();
  
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'enter-your-email-here@gmail.com',
          pass: 'enter-your-password-here', // Use the app password generated from Google
        },
      });
  
      const mailOptions = {
        to: admin.email,
        from: 'enter-your-email-here@gmail.com',
        subject: 'Admin Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your admin account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://localhost:3000/admin-reset-password/${resetToken}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
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
  
      const admin = await Admin.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!admin) {
        console.log('Admin not found or token expired');
        return res.status(400).send('Password reset token is invalid or has expired');
      }
  
      admin.password = password;
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpires = undefined;
      await admin.save();
      console.log('Password reset successful');
      res.status(200).send('Password has been reset');
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).send('Server error');
    }
  };
  
  

  const getTotalRegistrations = async (req, res) => {
    try {
      const count = await User.countDocuments();
      res.send({ totalRegistrations: count });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };


  const searchUsers = async (req, res) => {
    const { minRegistrations } = req.query;
    try {
      const users = await User.find().populate('referrals');
      const result = [];
  
      const countReferrals = async (user) => {
        let directCount = user.referrals.length;
        let indirectCount = 0;
  
        const queue = [...user.referrals];
  
        while (queue.length) {
          const referral = queue.shift();
          const referralUser = await User.findById(referral._id).populate('referrals');
          indirectCount += referralUser.referrals.length;
          queue.push(...referralUser.referrals);
        }
  
        return { direct: directCount, indirect: indirectCount, total: directCount + indirectCount };
      };
  
      for (let user of users) {
        const { direct, indirect, total } = await countReferrals(user);
        if (total >= minRegistrations) {
          result.push({ username: user.username, email: user.email, directReferrals: direct, indirectReferrals: indirect, totalRegistrations: total });
        }
      }
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  

module.exports = { getTotalRegistrations, searchUsers, adminLogin, forgotPassword, resetPassword };
