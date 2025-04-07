// backend/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const reelRoutes = require('./routes/reelRoutes');
const storyRoutes=require('./routes/storyRoutes');



const app = express();
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
  "http://localhost:3000",
  "https://instagram-clone-08.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/posts',postRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/stories',storyRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
