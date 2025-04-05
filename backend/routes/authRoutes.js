// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { logoutUser } = require('../controllers/authController');

// Logout route
router.get('/logout', logoutUser);

module.exports = router;
