const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {imageUpload,videoUpload} = require('../utils/multer'); // Configure multer for videos
const Reel = require('../models/Reel');
const fs = require('fs');

// Upload reel
const cloudinary = require('../utils/cloudinary');

router.post('/', protect, videoUpload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "reels"
    });

    const reel = new Reel({
      user: req.user.id,
      video: result.secure_url, // Cloudinary URL
      videoPublicId: result.public_id, // Cloudinary public_id
      caption: req.body.caption,
      duration: req.body.duration
    });

    await reel.save();
    
    // Optionally delete the local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: 'Reel uploaded successfully',
      reel: {
        _id: reel._id,
        video: reel.video,
        caption: reel.caption,
        user: reel.user
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ 
      error: 'Failed to upload reel',
      details: err.message 
    });
  }
});
// Get all reels
router.get('/', async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate('user', 'username profilePic')
      .sort({ createdAt: -1 });
    res.json(reels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like/unlike reel
router.put('/like/:id', protect, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    const userId = req.user.id;

    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    const likeIndex = reel.likes.indexOf(userId);
    if (likeIndex === -1) {
      reel.likes.push(userId);
    } else {
      reel.likes.splice(likeIndex, 1);
    }

    await reel.save();
    res.json(reel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add comment
router.post('/comment/:id', protect, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    const { text } = req.body;

    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    reel.comments.push({
      user: req.user.id,
      text
    });

    await reel.save();
    res.json(reel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment views
router.put('/view/:id', async (req, res) => {
  try {
    const reel = await Reel.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json(reel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;