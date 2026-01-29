const connectDB = require('../_lib/db');
const { protect } = require('../_lib/auth');
const Blog = require('../_models/Blog');
const { handleCors, setCorsHeaders } = require('../_lib/cors');

module.exports = async (req, res) => {
    setCorsHeaders(res);
    if (handleCors(req, res)) return;

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectDB();

        const authResult = await protect(req);
        if (authResult.error) {
            return res.status(authResult.status).json({ message: authResult.error });
        }

        const blogs = await Blog.find({ author: authResult.user._id })
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(blogs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
