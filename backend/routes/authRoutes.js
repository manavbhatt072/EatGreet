const express = require('express');
const router = express.Router();
const { register, login, getProfile, getRestaurants, updateProfile, updatePassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.get('/restaurants', protect, authorize('super-admin'), getRestaurants);

module.exports = router;
