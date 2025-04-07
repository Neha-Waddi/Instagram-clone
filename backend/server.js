// backend/server.js
const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const mongoose = require('mongoose');
const path = require('path');



mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection failed:', err));

  app.use((req, res, next) => {
    console.log(`[404] ${req.method} ${req.originalUrl}`);
    res.status(404).send('Route not found');
  });
  