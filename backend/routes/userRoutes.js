// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Assuming the upload middleware is defined here
const protect = require('../middleware/authMiddleware'); // JWT authentication middleware

const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const {
  getUserProfile,
  followUser,
  unfollowUser,
  updateProfile,
  searchUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

router.post(
  '/register',
  [
    body("name").notEmpty().withMessage("Full Name is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Password must be at least 6 characters", errors: errors.array() });
    }

    try {
      const { name, username, email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        name,       
        username,
        email,
        password: hashedPassword,
      });

      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({ message: "User registered successfully", token });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);
router.get('/search', protect, searchUsers);



// GET user profile by ID
router.get('/:id', protect, getUserProfile);

// Follow a user
router.put('/follow/:id', protect, followUser);

// Unfollow a user
router.put('/unfollow/:id', protect, unfollowUser);

// Edit profile (update name, bio, and profile picture)
router.put('/edit-profile', protect, upload.single('profilePic'), updateProfile);

// Update profile with profile picture
router.put('/update/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updates = { name, bio };

    // If image uploaded via Cloudinary, req.file.path is the secure URL
    if (req.file && req.file.path) {
      updates.profilePic = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ user: updatedUser });
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});
router.put('/update', updateUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;
