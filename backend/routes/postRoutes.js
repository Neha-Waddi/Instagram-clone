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

module.exports = router;
