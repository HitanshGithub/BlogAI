const connectDB = require('../_lib/db');
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

        const tags = await Blog.distinct('tags');
        res.json(tags);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
