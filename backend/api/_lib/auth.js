const jwt = require('jsonwebtoken');
const User = require('../_models/User');
const connectDB = require('./db');

const protect = async (req) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return { error: 'Not authorized, no token', status: 401 };
    }

    try {
        await connectDB();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return { error: 'User not found', status: 401 };
        }

        return { user };
    } catch (error) {
        return { error: 'Not authorized, token failed', status: 401 };
    }
};

module.exports = { protect };
