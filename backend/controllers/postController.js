// controllers/postController.js
const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file.path;

    const newPost = new Post({
      user: req.body.userId, // Or from auth middleware
      image,
      caption,
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created', post: newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
  .populate('user', 'username profilePic') // populate post author
  .populate('comments.user', 'username profilePic') // populate commenter
  .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(id);
    post.likes = post.likes.filter((uid) => uid.toString() !== userId);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { userId, text } = req.body;

  try {
    const post = await Post.findById(id);
    post.comments.push({ user: userId, text });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
