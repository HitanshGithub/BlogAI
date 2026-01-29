const express = require('express');
const router = express.Router();
const {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    updateNotes,
    deleteBlog,
    getMyBlogs,
    getAllTags
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/blogs/tags
// @desc    Get all unique tags
// @access  Public
router.get('/tags', getAllTags);

// @route   GET /api/blogs
// @desc    Get all published blogs
// @access  Public
router.get('/', getBlogs);

// @route   GET /api/blogs/my-blogs
// @desc    Get current user's blogs
// @access  Private
router.get('/my-blogs', protect, getMyBlogs);

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @access  Public
router.get('/:id', getBlog);

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private
router.post('/', protect, createBlog);

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put('/:id', protect, updateBlog);

// @route   PATCH /api/blogs/:id/notes
// @desc    Update blog notes only
// @access  Private
router.patch('/:id/notes', protect, updateNotes);

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private
router.delete('/:id', protect, deleteBlog);

module.exports = router;
