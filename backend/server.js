const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/authRoutes');



dotenv.config();

const app = express();

const storyRoutes=require('./routes/storyRoutes.js');
app.use('/api/stories', storyRoutes);


app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // Your frontend origin
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
  }));
  
app.use(cookieParser());


const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.use('/api/auth', authRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);


if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error("Error: Missing environment variables (MONGO_URI or JWT_SECRET)");
    process.exit(1);
}


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Instagram Clone API Running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
