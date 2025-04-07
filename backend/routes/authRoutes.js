// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

router.get('/logout', (req, res) => {
    res.clearCookie('token').status(200).json({ message: 'Logged out' });
  });

module.exports = router;
