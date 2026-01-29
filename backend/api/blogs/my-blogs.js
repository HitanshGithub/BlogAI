const connectDB = require('../_lib/db');
const { protect } = require('../_lib/auth');
const Blog = require('../_models/Blog');

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

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
