import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db  from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'Im not using Envs woow just testing';

export const register = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name, student_id, faculty_position, specialization } = req.body;
        const role = 'student'; // Default to 'student' if not provided
        const hashed_password = await bcrypt.hash(password, 10);
        
        const user = await db.User.create({
            username,
            email,
            password_hash: hashed_password,
            role,
            first_name,
            last_name,
            student_id: role === 'student' ? student_id : null,
            faculty_position: role === 'facilitator' ? faculty_position : null,
            specialization: role === 'facilitator' ? specialization : null
        });
        
        const userResponse = user.toJSON();
        delete userResponse.password_hash;
        
        return res.status(201).json(userResponse);
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        return res.status(500).json({ error: "Registration failed" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await db.User.scope('withPassword').findOne({ where: { username } });
        
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        const userResponse = user.toJSON();
        delete userResponse.password_hash;
        
        return res.status(200).json({ 
            token,
            user: userResponse
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Login failed" });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const userResponse = user.toJSON();
        delete userResponse.password_hash;
        
        return res.status(200).json(userResponse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch profile" });
    }
};