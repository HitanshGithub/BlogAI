const express = require('express');
const router = express.Router();
const { summarizeBlog } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/ai/summarize
// @desc    Generate AI summary for blog content
// @access  Private
router.post('/summarize', protect, summarizeBlog);

module.exports = router;
