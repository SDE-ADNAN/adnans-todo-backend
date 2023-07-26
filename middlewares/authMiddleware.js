const jwt = require('jsonwebtoken');


const authenticateUser = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication token missing.' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        req.userId = decoded.userId;
        next()
    } catch (error) {
        console.error('Error authenticating user: ', error);
        return res.status(401).json({ message: 'Invalid authentication token. ' })
    }
}

module.exports = authenticateUser;