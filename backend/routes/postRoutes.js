// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { createPost, getAllPosts } = require('../controllers/postController');
const upload = require('../middleware/upload');

const {
    likePost,
    unlikePost,
    addComment,
  } = require('../controllers/postController');
  
  // Like a post
  router.put('/like/:id', likePost);
  
  // Unlike a post
  router.put('/unlike/:id', unlikePost);
  
  // Add comment
  router.post('/comment/:id', addComment);
  

router.post('/', upload.single('image'), createPost);
router.get('/', getAllPosts);

// GET /api/posts/trending
router.get("/trending", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ likes: -1, createdAt: -1 })
      .limit(10)
      .populate("user", "username profilePic");

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trending posts" });
  }
});


module.exports = router;
