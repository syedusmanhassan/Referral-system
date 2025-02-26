const express = require('express');
const { getTotalRegistrations, searchUsers, adminLogin, forgotPassword, resetPassword } = require('../controllers/adminController');
const { adminAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/total-registrations', adminAuth, getTotalRegistrations);
router.get('/search', adminAuth, searchUsers);
router.post('/login', adminLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

module.exports = router;
