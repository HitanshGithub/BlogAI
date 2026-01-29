const connectDB = require('../_lib/db');
const { protect } = require('../_lib/auth');
const Blog = require('../_models/Blog');
const { handleCors, setCorsHeaders } = require('../_lib/cors');

module.exports = async (req, res) => {
    setCorsHeaders(res);
    if (handleCors(req, res)) return;

    await connectDB();

    // GET /api/blogs - Get all blogs
    if (req.method === 'GET') {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const query = { isPublished: true };

            if (req.query.search) {
                query.$text = { $search: req.query.search };
            }

            if (req.query.tag) {
                query.tags = req.query.tag;
            }

            const blogs = await Blog.find(query)
                .populate('author', 'name avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Blog.countDocuments(query);

            return res.json({
                blogs,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalBlogs: total
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // POST /api/blogs - Create blog
    if (req.method === 'POST') {
        try {
            const authResult = await protect(req);
            if (authResult.error) {
                return res.status(authResult.status).json({ message: authResult.error });
            }

            const { title, content, summary, coverImage, tags, isPublished, notes } = req.body;

            const blog = await Blog.create({
                title,
                content,
                summary: summary || { context: '', coreIdeas: [], actionables: [] },
                coverImage: coverImage || '',
                tags: tags || [],
                notes: notes || '',
                author: authResult.user._id,
                isPublished: isPublished !== undefined ? isPublished : true
            });

            const populatedBlog = await Blog.findById(blog._id)
                .populate('author', 'name avatar');

            return res.status(201).json(populatedBlog);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
};
