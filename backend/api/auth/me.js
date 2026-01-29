const { protect } = require('../_lib/auth');
const connectDB = require('../_lib/db');
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

        res.json({
            _id: authResult.user._id,
            name: authResult.user.name,
            email: authResult.user.email
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: error.message });
    }
};
