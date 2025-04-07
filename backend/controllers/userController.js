// backend/controllers/userController.js
const User = require('../models/User');
const Post = require('../models/Post');
const cloudinary = require('../utils/cloudinary'); // ✅ Make sure this is present


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const posts = await Post.find({ user: req.params.id }).sort({ createdAt: -1 });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow.followers.includes(currentUser._id)) {
      userToFollow.followers.push(currentUser._id);
      currentUser.following.push(userToFollow._id);

      await userToFollow.save();
      await currentUser.save();
    }

    res.json({ message: 'User followed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );

    await userToUnfollow.save();
    await currentUser.save();

    res.json({ message: 'User unfollowed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, bio } = req.body;

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.bio = bio || user.bio;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profilePics',
      });
      user.profilePic = result.secure_url;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Profile update failed:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.searchUsers = async (req, res) => {
  const { q } = req.query;
  console.log('Search query:', q); // ✅ log here
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
      ]
    }).select('_id username name profilePic followers');

    console.log('Found users:', users); // ✅ log here

    res.json(users);
  } catch (err) {
    console.error('Search failed:', err.message);
    res.status(500).json({ error: 'Search failed' });
  }
};

