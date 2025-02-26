const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const jwtSecret = process.env.JWT_SECRET || 'your_secret_key';
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};


const adminAuth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      const admin = await Admin.findOne({ _id: decoded._id });
      if (!admin) {
        throw new Error('Access denied');
      }
      req.user = admin;
      next();
    } catch (error) {
      res.status(401).send('Unauthorized');
    }
  };

module.exports = { auth, adminAuth };
