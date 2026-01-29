const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Blog Platform API is running' });
});

// Error handling middleware
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
