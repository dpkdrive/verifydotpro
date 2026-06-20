const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getProfile } = require('../controllers/authController');
const requireAdminAuth = require('../middleware/auth');

// One-time use to create your first admin — remove or protect this route after setup!
router.post('/register', registerAdmin);

router.post('/login', loginAdmin);
router.get('/me', requireAdminAuth, getProfile);

module.exports = router;
