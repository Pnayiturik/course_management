import db from '../models/index.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await db.User.findAll({
            attributes: { exclude: ['password_hash'] },
            include: [
                {
                    model: db.Student,
                    required: false,
                    attributes: { exclude: ['user_id', 'id'] },
                    include: [{
                        model: db.Class,
                        as: 'Class',
                        attributes: ['id', 'name']
                    }]
                },
                {
                    model: db.Facilitator,
                    required: false,
                    attributes: { exclude: ['user_id', 'id'] }
                },
                {
                    model: db.Manager,
                    required: false,
                    attributes: { exclude: ['user_id', 'id'] }
                }
            ]
        });

        // Combine user data with role-specific data
        const formattedUsers = users.map(user => {
            const userJson = user.toJSON();
            let roleData = {};
            
            if (user.role === 'student' && user.Student) {
                roleData = {
                    ...user.Student.toJSON(),
                    class: user.Student.Class // Include class information
                };
            } else if (user.role === 'facilitator' && user.Facilitator) {
                roleData = user.Facilitator.toJSON();
            } else if (user.role === 'manager' && user.Manager) {
                roleData = user.Manager.toJSON();
            }
            
            return {
                ...userJson,
                ...roleData
            };
        });

        return res.status(200).json(formattedUsers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, first_name, last_name, ...roleData } = req.body;
        
        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Update common user fields
        const updatedUser = await user.update({
            username,
            email,
            first_name,
            last_name
        });
        
        // Update role-specific fields
        switch(user.role) {
            case 'student':
                if (roleData.student_id) {
                    const student = await db.Student.findOne({ where: { user_id: id } });
                    if (student) {
                        await student.update(roleData);
                    } else {
                        await db.Student.create({ user_id: id, ...roleData });
                    }
                }
                break;
                
            case 'facilitator':
                const facilitator = await db.Facilitator.findOne({ where: { user_id: id } });
                if (facilitator) {
                    await facilitator.update(roleData);
                } else {
                    await db.Facilitator.create({ user_id: id, ...roleData });
                }
                break;
                
            case 'manager':
                const manager = await db.Manager.findOne({ where: { user_id: id } });
                if (manager) {
                    await manager.update(roleData);
                } else {
                    await db.Manager.create({ user_id: id, ...roleData });
                }
                break;
        }
        
        // Fetch the complete updated user data
        const completeUser = await db.User.findByPk(id, {
            attributes: { exclude: ['password_hash'] },
            include: [
                {
                    model: user.role === 'student' ? db.Student : 
                           user.role === 'facilitator' ? db.Facilitator : db.Manager,
                    attributes: { exclude: ['user_id', 'id'] },
                    include: user.role === 'student' ? [{
                        model: db.Class,
                        as: 'Class',
                        attributes: ['id', 'name']
                    }] : []
                }
            ]
        });
        
        const response = completeUser.toJSON();
        if (completeUser[user.role.charAt(0).toUpperCase() + user.role.slice(1)]) {
            Object.assign(response, completeUser[user.role.charAt(0).toUpperCase() + user.role.slice(1)].toJSON());
        }
        
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        return res.status(500).json({ error: "Update failed" });
    }
};

export const updateStudentClass = async (req, res) => {
    try {
        // Only managers can access this endpoint (enforced by middleware)
        const { studentId } = req.params;
        const { class_id } = req.body;

        // Verify the student exists and is actually a student
        const studentUser = await db.User.findOne({
            where: { id: studentId, role: 'student' },
            include: [{
                model: db.Student,
                required: true
            }]
        });

        if (!studentUser) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Verify the class exists if class_id is provided
        if (class_id) {
            const classExists = await db.Class.findByPk(class_id);
            if (!classExists) {
                return res.status(400).json({ error: "Class not found" });
            }
        }

        // Update the student's class
        await db.Student.update(
            { class_id: class_id || null },
            { where: { user_id: studentId } }
        );

        // Return the updated student data
        const updatedStudent = await db.User.findByPk(studentId, {
            attributes: { exclude: ['password_hash'] },
            include: [{
                model: db.Student,
                attributes: { exclude: ['user_id', 'id'] },
                include: [{
                    model: db.Class,
                    as: 'Class',
                    attributes: ['id', 'name']
                }]
            }]
        });

        const response = updatedStudent.toJSON();
        Object.assign(response, updatedStudent.Student.toJSON());

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update student class" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Delete role-specific record first
        switch(user.role) {
            case 'student':
                await db.Student.destroy({ where: { user_id: id } });
                break;
            case 'facilitator':
                await db.Facilitator.destroy({ where: { user_id: id } });
                break;
            case 'manager':
                await db.Manager.destroy({ where: { user_id: id } });
                break;
        }
        
        // Then delete the user
        await user.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Deletion failed" });
    }
};