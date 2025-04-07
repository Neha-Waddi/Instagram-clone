const express = require('express');
const upload = require('../middleware/upload');
const { uploadStory, getStories } = require('../controllers/storyControllers');

const router = express.Router();

router.post('/upload', upload.single('story'), uploadStory);
router.get('/', getStories);

module.exports = router;
