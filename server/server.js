const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
// const Issue = require('../models/issue');

dotenv.config();
connectDB();

const app = express();
app.use(cors());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use express.json() only for JSON routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const issueRoutes = require('./routes/issues');

console.log("authRoutes typeof:", typeof authRoutes);
console.log("userRoutes typeof:", typeof userRoutes);
console.log("issueRoutes typeof:", typeof issueRoutes);

app.use('/api/auth', express.json(), authRoutes);
app.use('/api/user', express.json(), userRoutes);
app.use('/api/issues', issueRoutes); // ✅ now using the working import

app.get('/', (req, res) => {
  res.send('Welcome to FixMyCity API 🏙️');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
