const Blog = require('../models/Blog');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { isPublished: true };

        // Search functionality
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        // Tag filter
        if (req.query.tag) {
            query.tags = req.query.tag;
        }

        const blogs = await Blog.find(query)
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Blog.countDocuments(query);

        res.json({
            blogs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBlogs: total
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name avatar email');

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Only increment views if 'view' query param is true (first load only)
        if (req.query.view === 'true') {
            await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
            blog.views += 1;
        }

        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    };
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
    try {
        const { title, content, summary, coverImage, tags, isPublished, notes } = req.body;

        const blog = await Blog.create({
            title,
            content,
            summary: summary || { context: '', coreIdeas: [], actionables: [] },
            coverImage: coverImage || '',
            tags: tags || [],
            notes: notes || '',
            author: req.user._id,
            isPublished: isPublished !== undefined ? isPublished : true
        });

        const populatedBlog = await Blog.findById(blog._id)
            .populate('author', 'name avatar');

        res.status(201).json(populatedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check ownership
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this blog' });
        }

        const { title, content, summary, coverImage, tags, isPublished, notes } = req.body;

        blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, content, summary, coverImage, tags, isPublished, notes },
            { new: true, runValidators: true }
        ).populate('author', 'name avatar');

        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update blog notes only
// @route   PATCH /api/blogs/:id/notes
// @access  Private
const updateNotes = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check ownership
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update notes for this blog' });
        }

        blog.notes = req.body.notes || '';
        await blog.save();

        res.json({ notes: blog.notes });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check ownership
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this blog' });
        }

        await Blog.findByIdAndDelete(req.params.id);

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's blogs
// @route   GET /api/blogs/my-blogs
// @access  Private
const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id })
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(blogs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all unique tags
// @route   GET /api/blogs/tags
// @access  Public
const getAllTags = async (req, res) => {
    try {
        const tags = await Blog.distinct('tags');
        res.json(tags);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getBlogs, getBlog, createBlog, updateBlog, updateNotes, deleteBlog, getMyBlogs, getAllTags };
