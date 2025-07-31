import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: "Authorization token required" });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find user with role-specific data
        const user = await db.User.findByPk(decoded.id, {
            attributes: { exclude: ['password_hash'] },
            include: [
                {
                    model: decoded.role === 'student' ? db.Student : 
                           decoded.role === 'facilitator' ? db.Facilitator : db.Manager,
                    attributes: { exclude: ['user_id', 'id'] }
                }
            ]
        });
        
        if (!user) {
            return res.status(403).json({ error: "Invalid token - user not found" });
        }
        
        // Verify token hasn't been revoked (add this if you implement token revocation)
        // const tokenRevoked = await checkTokenRevocation(token);
        // if (tokenRevoked) {
        //     return res.status(403).json({ error: "Token revoked" });
        // }
        
        // Combine user data with role-specific data
        const userData = user.toJSON();
        const roleModel = decoded.role.charAt(0).toUpperCase() + decoded.role.slice(1);
        if (user[roleModel]) {
            Object.assign(userData, user[roleModel].toJSON());
        }
        
        req.user = userData;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: "Invalid token" });
        }
        
        return res.status(500).json({ error: "Authentication failed" });
    }
};

export const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: "Forbidden",
                message: `Required roles: ${roles.join(', ')}`
            });
        }
        
        next();
    };
};

// Optional: Higher-order role checkers for specific roles
export const isStudent = authorizeRoles('student');
export const isFacilitator = authorizeRoles('facilitator');
export const isManager = authorizeRoles('manager');
export const isStaff = authorizeRoles(['facilitator', 'manager']);

// Optional: Token blacklist/revocation check
// async function checkTokenRevocation(token) {
//     // Implement your token revocation logic here
//     // For example, check against a blacklist in Redis or database
//     return false;
// }