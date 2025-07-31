import  db  from '../models/index.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await db.User.findAll({
            attributes: { exclude: ['password_hash'] }
        });
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, first_name, last_name, student_id, faculty_position, specialization } = req.body;
        
        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const updatedUser = await user.update({
            username,
            email,
            first_name,
            last_name,
            student_id: user.role === 'student' ? student_id : null,
            faculty_position: user.role === 'facilitator' ? faculty_position : null,
            specialization: user.role === 'facilitator' ? specialization : null
        });
        
        const userResponse = updatedUser.toJSON();
        delete userResponse.password_hash;
        
        return res.status(200).json(userResponse);
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        return res.status(500).json({ error: "Update failed" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await user.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Deletion failed" });
    }
};