import db from '../models/index.js';

export const createClass = async (req, res) => {
    try {
        // Only managers can create classes
        if (req.user.role !== 'manager') {
            return res.status(403).json({ 
                error: "Forbidden",
                message: "Only managers can create classes" 
            });
        }

        const { name, code, trimester, intake_period, mode, cohort_id } = req.body;
        
        // Validate required fields
        if (!name || !code || !cohort_id) {
            return res.status(400).json({ 
                error: "Validation error",
                details: ["Name, code, and cohort_id are required"]
            });
        }

        // Check if cohort exists
        const cohort = await db.Cohort.findByPk(cohort_id);
        if (!cohort) {
            return res.status(404).json({ 
                error: "Not found",
                message: "Cohort not found" 
            });
        }

        // Check if class code already exists
        const existingClass = await db.Class.findOne({ where: { code } });
        if (existingClass) {
            return res.status(400).json({ 
                error: "Validation error",
                message: "Class code must be unique" 
            });
        }

        const classObj = await db.Class.create({
            name,
            code,
            trimester,
            intake_period,
            mode,
            cohort_id,
            created_by: req.user.id
        });
        
        // Fetch the complete class data with cohort information
        const completeClass = await db.Class.findByPk(classObj.id, {
            include: [{
                model: db.Cohort,
                as: 'cohort',
                attributes: ['id', 'name']
            }],
            attributes: { exclude: ['created_by'] }
        });

        return res.status(201).json(completeClass);
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: "Validation error",
                details: error.errors.map(e => e.message) 
            });
        }
        return res.status(500).json({ 
            error: "Internal server error",
            message: "Failed to create class" 
        });
    }
};

export const getAllClasses = async (req, res) => {
    try {
        const { cohort_id, intake_period, mode, page = 1, limit = 10 } = req.query;
        let where = {};
        
        // Build filters
        if (cohort_id) where.cohort_id = cohort_id;
        if (intake_period) where.intake_period = intake_period;
        if (mode) where.mode = mode;

        // Pagination
        const offset = (page - 1) * limit;
        
        const { count, rows: classes } = await db.Class.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [{
                model: db.Cohort,
                as: 'cohort',
                attributes: ['id', 'name']
            }],
            attributes: { exclude: ['created_by'] },
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            data: classes
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: "Internal server error",
            message: "Failed to fetch classes" 
        });
    }
};

export const getClassById = async (req, res) => {
    try {
        const { id } = req.params;
        const classObj = await db.Class.findByPk(id, {
            include: [{
                model: db.Cohort,
                as: 'cohort',
                attributes: ['id', 'name']
            }],
            attributes: { exclude: ['created_by'] }
        });
        
        if (!classObj) {
            return res.status(404).json({ 
                error: "Not found",
                message: "Class not found" 
            });
        }
        
        return res.status(200).json(classObj);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: "Internal server error",
            message: "Failed to fetch class" 
        });
    }
};

export const updateClass = async (req, res) => {
    try {
        // Only managers can update classes
        if (req.user.role !== 'manager') {
            return res.status(403).json({ 
                error: "Forbidden",
                message: "Only managers can update classes" 
            });
        }

        const { id } = req.params;
        const { name, code, trimester, intake_period, mode, cohort_id } = req.body;
        
        const classObj = await db.Class.findByPk(id);
        if (!classObj) {
            return res.status(404).json({ 
                error: "Not found",
                message: "Class not found" 
            });
        }

        // Check if cohort exists if being updated
        if (cohort_id) {
            const cohort = await db.Cohort.findByPk(cohort_id);
            if (!cohort) {
                return res.status(404).json({ 
                    error: "Not found",
                    message: "Cohort not found" 
                });
            }
        }
        
        // Check if new code already exists (excluding current class)
        if (code && code !== classObj.code) {
            const existingClass = await db.Class.findOne({ where: { code } });
            if (existingClass) {
                return res.status(400).json({ 
                    error: "Validation error",
                    message: "Class code must be unique" 
                });
            }
        }

        const updatedClass = await classObj.update({
            name: name || classObj.name,
            code: code || classObj.code,
            trimester: trimester || classObj.trimester,
            intake_period: intake_period || classObj.intake_period,
            mode: mode || classObj.mode,
            cohort_id: cohort_id || classObj.cohort_id
        });
        
        // Fetch the complete updated class data
        const completeClass = await db.Class.findByPk(updatedClass.id, {
            include: [{
                model: db.Cohort,
                as: 'cohort',
                attributes: ['id', 'name']
            }],
            attributes: { exclude: ['created_by'] }
        });

        return res.status(200).json(completeClass);
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: "Validation error",
                details: error.errors.map(e => e.message) 
            });
        }
        return res.status(500).json({ 
            error: "Internal server error",
            message: "Failed to update class" 
        });
    }
};

export const deleteClass = async (req, res) => {
    try {
        // Only managers can delete classes
        if (req.user.role !== 'manager') {
            return res.status(403).json({ 
                error: "Forbidden",
                message: "Only managers can delete classes" 
            });
        }

        const { id } = req.params;
        
        const classObj = await db.Class.findByPk(id);
        if (!classObj) {
            return res.status(404).json({ 
                error: "Not found",
                message: "Class not found" 
            });
        }
        
        // Check if class has any associated enrollments
        const hasEnrollments = await db.Enrollment.findOne({ where: { class_id: id } });
        if (hasEnrollments) {
            return res.status(400).json({ 
                error: "Bad request",
                message: "Cannot delete class with associated enrollments",
                solution: "Remove all enrollments before deleting this class"
            });
        }

        await classObj.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: "Internal server error",
            message: "Failed to delete class" 
        });
    }
};