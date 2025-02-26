const express = require('express');
const { registerUser, loginUser, changePassword, getUserData, getUserRegistrations, getUserReferrals, forgotPassword, resetPassword } = require('../controllers/userController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', auth, changePassword);
router.get('/profile', auth, getUserData);
router.get('/registrations', auth, getUserRegistrations);
router.get('/referrals', auth, getUserReferrals);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

module.exports = router;