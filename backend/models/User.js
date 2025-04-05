// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  bio: { type: String, default: '' },
  profilePic: { type: String, default: '' },
});

module.exports = mongoose.model('User', userSchema);
