const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.post("/create", async (req, res) => {
  try {
    const { user, image, caption } = req.body;
    const newPost = new Post({ user, image, caption });
    await newPost.save();
    res.status(201).json("Post created successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
