import jwt from 'jsonwebtoken';
import  db  from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Forbidden" });
        }
        
        const user = await db.User.findByPk(decoded.id);
        if (!user) {
            return res.status(403).json({ error: "Forbidden" });
        }
        
        req.user = user.toJSON();
        next();
    });
};

export const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }
        next();
    };
};