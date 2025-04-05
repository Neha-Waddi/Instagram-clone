const User = require('../models/User');
const Post = require('../models/Post'); // assuming you have this

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('-password');
    const posts = await Post.find({ user: userId });

    res.status(200).json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};


exports.updateProfilePicAndBio = async (req, res) => {
  try {
    const { bio } = req.body;
    const profilePic = req.file?.path;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...(bio && { bio }),
        ...(profilePic && { profilePic }),
      },
      { new: true }
    );

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

