const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  referralCode: { type: String, unique: true },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resetPasswordToken: { type: String }, 
  resetPasswordExpires: { type: Date }  
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateAuthToken = function() {
  const jwtSecret = process.env.JWT_SECRET || 'your_secret_key';
  return jwt.sign({ id: this._id, role: this.role }, jwtSecret, { expiresIn: '1h' });
};

module.exports = mongoose.model('User', userSchema);
