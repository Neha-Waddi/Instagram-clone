const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Story', storySchema);
