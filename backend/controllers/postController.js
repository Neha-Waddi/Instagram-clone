const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file?.path; // use .path for Cloudinary

    if (!image) return res.status(400).json({ message: 'Image is required' });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'posts',
    });

    const post = await Post.create({
      caption,
      image: result.secure_url, // save Cloudinary URL
      user: req.user._id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Post creation failed:', err); // ✅ this will help you debug
    res.status(500).json({ message: 'Server Error' });
  }
};



// backend/controllers/postController.js

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name username profilePic')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getUserPosts = (req, res) => {};


const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1); // unlike
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: index === -1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const commentOnPost = async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id).populate('comments.user', 'name');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      user: req.user._id,
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    await post.populate('comments.user', 'name'); // re-populate for latest comment

    res.status(201).json({ comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
  commentOnPost
};
