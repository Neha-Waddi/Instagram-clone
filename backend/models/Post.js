// backend/models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
