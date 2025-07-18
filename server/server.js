const express = require('express');
const cors = require('cors'); // Make sure cors is required
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();
const corsOptions = {
  origin: 'https://bright-tartufo-c3a91f.netlify.app', // ✅ your Netlify domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));


// Serve uploaded images (Keep this if you have image uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse JSON bodies for specific routes (as you had it)
// Ensure express.json() is applied to routes that need it
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const issueRoutes = require('./routes/issues');

// You can keep these console logs for debugging if needed, but remove for production
console.log("authRoutes typeof:", typeof authRoutes);
console.log("userRoutes typeof:", typeof userRoutes);
console.log("issueRoutes typeof:", typeof issueRoutes);

app.use(express.json()); // ✅ Add this line to parse JSON for all routes that follow, or keep it per route as you had.
 // Using it globally here is common practice before route definitions.

app.use('/api/auth', authRoutes); // express.json() is now global, no need to add here
app.use('/api/user', userRoutes); // express.json() is now global, no need to add here
app.use('/api/issues', issueRoutes);

// Your root route - this is what you see when you visit your backend URL directly
app.get('/', (req, res) => {
  res.send('Welcome to FixMyCity API 🏙️');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));