const connectDB = require('../../_lib/db');
const { protect } = require('../../_lib/auth');
const Blog = require('../../_models/Blog');
const { handleCors, setCorsHeaders } = require('../../_lib/cors');

module.exports = async (req, res) => {
    setCorsHeaders(res);
    if (handleCors(req, res)) return;

    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectDB();

        const authResult = await protect(req);
        if (authResult.error) {
            return res.status(authResult.status).json({ message: authResult.error });
        }

        const { id } = req.query;

        let blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.author.toString() !== authResult.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update notes for this blog' });
        }

        blog.notes = req.body.notes || '';
        await blog.save();

        res.json({ notes: blog.notes });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
