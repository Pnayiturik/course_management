import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import dotenv from 'dotenv';
dotenv.config();

// Ensure JWT_SECRET is set
const JWT_SECRET = process.env.JWT_SECRET ;

const registerUser = async (req, res, role, roleData = {}) => {
    try {
        const { username, email, password, first_name, last_name } = req.body;

        // Check if email or username already exists
        const existingUserByUsername = await db.User.findOne({ where: { username } });
        if (existingUserByUsername) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const existingUserByEmail = await db.User.findOne({ where: { email } });
        if (existingUserByEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashed_password = await bcrypt.hash(password, 10);

        // Create user transaction to ensure data consistency
        const result = await db.sequelize.transaction(async (t) => {
            const user = await db.User.create({
                username,
                email,
                password_hash: hashed_password,
                role,
                first_name,
                last_name
            }, { transaction: t });

            if (role === 'student') {
                await db.Student.create({
                    user_id: user.id,
                    student_id: roleData.student_id
                }, { transaction: t });
            } else if (role === 'facilitator') {
                await db.Facilitator.create({
                    user_id: user.id,
                    faculty_position: roleData.faculty_position,
                    specialization: roleData.specialization
                }, { transaction: t });
            } else if (role === 'manager') {
                await db.Manager.create({
                    user_id: user.id,
                    department: roleData.department
                }, { transaction: t });
            }

            return user;
        });

        const userResponse = result.toJSON();
        delete userResponse.password_hash;

        return res.status(201).json(userResponse);

    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "Username or email already exists" });
        }
        return res.status(500).json({ error: "Registration failed" });
    }
};

// Student registration
export const registerStudent = async (req, res) => {
    const { student_id } = req.body;
    if (!student_id) {
        return res.status(400).json({ error: "Student ID is required" });
    }
    await registerUser(req, res, 'student', { student_id });
};

// Facilitator registration
export const registerFacilitator = async (req, res) => {
    const { faculty_position, specialization } = req.body;
    await registerUser(req, res, 'facilitator', { faculty_position, specialization });
};

// Manager registration
export const registerManager = async (req, res) => {
    const { department } = req.body;
    await registerUser(req, res, 'manager', { department });
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
        
        // Fetch role-specific data
        let roleData = {};
        switch(user.role) {
            case 'student':
                const student = await db.Student.findOne({ where: { user_id: user.id } });
                if (student) roleData = student.toJSON();
                break;
            case 'facilitator':
                const facilitator = await db.Facilitator.findOne({ where: { user_id: user.id } });
                if (facilitator) roleData = facilitator.toJSON();
                break;
            case 'manager':
                const manager = await db.Manager.findOne({ where: { user_id: user.id } });
                if (manager) roleData = manager.toJSON();
                break;
        }
        
        const userResponse = {
            ...user.toJSON(),
            ...roleData
        };
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
        const user = await db.User.findByPk(req.user.id, {
            include: [
                {
                    model: req.user.role === 'student' ? db.Student : 
                           req.user.role === 'facilitator' ? db.Facilitator : db.Manager,
                    attributes: { exclude: ['user_id', 'id'] }
                }
            ]
        });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const userResponse = user.toJSON();
        if (user[user.role.charAt(0).toUpperCase() + user.role.slice(1)]) {
            Object.assign(userResponse, user[user.role.charAt(0).toUpperCase() + user.role.slice(1)].toJSON());
        }
        delete userResponse.password_hash;
        
        return res.status(200).json(userResponse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch profile" });
    }
};