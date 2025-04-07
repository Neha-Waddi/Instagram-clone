const Story = require('../models/Story');
const { uploadToCloudinary } = require('../utils/cloudinary');

const uploadStory = async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.path, 'instagram_stories');

    const story = await Story.create({
      user: req.body.userId,
      image: result.secure_url,
    });

    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('user', 'username profilePic')
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadStory, getStories };
