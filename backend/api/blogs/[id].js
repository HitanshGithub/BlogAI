const connectDB = require('../_lib/db');
const { protect } = require('../_lib/auth');
const Blog = require('../_models/Blog');

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    await connectDB();

    const { id } = req.query;

    // GET /api/blogs/[id] - Get single blog
    if (req.method === 'GET') {
        try {
            const blog = await Blog.findById(id)
                .populate('author', 'name avatar email');

            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            // Only increment views if 'view' query param is true
            if (req.query.view === 'true') {
                await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } });
                blog.views += 1;
            }

            return res.json(blog);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // PUT /api/blogs/[id] - Update blog
    if (req.method === 'PUT') {
        try {
            const authResult = await protect(req);
            if (authResult.error) {
                return res.status(authResult.status).json({ message: authResult.error });
            }

            let blog = await Blog.findById(id);

            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            if (blog.author.toString() !== authResult.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this blog' });
            }

            const { title, content, summary, coverImage, tags, isPublished, notes } = req.body;

            blog = await Blog.findByIdAndUpdate(
                id,
                { title, content, summary, coverImage, tags, isPublished, notes },
                { new: true, runValidators: true }
            ).populate('author', 'name avatar');

            return res.json(blog);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // DELETE /api/blogs/[id] - Delete blog
    if (req.method === 'DELETE') {
        try {
            const authResult = await protect(req);
            if (authResult.error) {
                return res.status(authResult.status).json({ message: authResult.error });
            }

            const blog = await Blog.findById(id);

            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            if (blog.author.toString() !== authResult.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this blog' });
            }

            await Blog.findByIdAndDelete(id);

            return res.json({ message: 'Blog deleted successfully' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
};
