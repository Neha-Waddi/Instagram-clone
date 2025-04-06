const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {imageUpload,videoUpload} = require('../utils/multer');
const Post = require('../models/Post');
const User = require('../models/User');

const {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
  commentOnPost
} = require('../controllers/postController');

// ✅ Protected routes (require authentication)
router.post('/', protect, imageUpload.single('image'), createPost);
router.get('/feed', protect, getAllPosts); // Feed posts
router.get('/user/:userId', protect, getUserPosts);
router.put('/like/:id', protect, likePost);
router.post('/comment/:id', protect, commentOnPost);

// ✅ Public routes

// Explore route
router.get('/explore', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profilePic')
      .select('-__v');

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts
    });
  } catch (err) {
    console.error('Explore error:', err);
    res.status(500).json({
      error: 'Failed to fetch explore posts',
      details: err.message
    });
  }
});

// Search route
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 30 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(q, 'i');

    const posts = await Post.find({
      $or: [
        { caption: searchRegex },
        { tags: { $in: [q.toLowerCase()] } },
        { location: searchRegex }
      ]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profilePic')
      .select('-__v');

    const totalResults = await Post.countDocuments({
      $or: [
        { caption: searchRegex },
        { tags: { $in: [q.toLowerCase()] } },
        { location: searchRegex }
      ]
    });

    res.json({
      results: posts,
      query: q,
      page: parseInt(page),
      totalResults,
      totalPages: Math.ceil(totalResults / limit)
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      error: 'Search failed',
      details: err.message
    });
  }
});

// Trending tags
router.get('/trending/tags', async (req, res) => {
  try {
    const trendingTags = await Post.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
          latestPost: { $last: '$$ROOT' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          tag: '$_id',
          count: 1,
          samplePost: {
            image: '$latestPost.image',
            postId: '$latestPost._id'
          }
        }
      }
    ]);

    res.json(trendingTags);
  } catch (err) {
    console.error('Trending tags error:', err);
    res.status(500).json({ error: 'Failed to fetch trending tags' });
  }
});

// ✅ Dynamic route (must come LAST!)
router.get('/:postId([0-9a-fA-F]{24})', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('user', 'name profilePic')
      .populate('comments.user', 'name profilePic');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

module.exports = router;
