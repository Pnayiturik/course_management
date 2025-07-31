import db from '../models/index.js';

export const createModule = async (req, res) => {
    try {
        // Only managers can create modules
        if (req.user.role !== 'manager') {
            return res.status(403).json({ error: "Only managers can create modules" });
        }

        const { code, name, description, credits, is_active = true } = req.body;
        
        // Validate required fields
        if (!code || !name || credits === undefined) {
            return res.status(400).json({ error: "Code, name, and credits are required" });
        }

        // Check if module code already exists
        const existingModule = await db.Module.findOne({ where: { code } });
        if (existingModule) {
            return res.status(400).json({ error: "Module code already exists" });
        }

        const module = await db.Module.create({
            code,
            name,
            description,
            credits,
            is_active,
            created_by: req.user.id
        });
        
        return res.status(201).json({
            id: module.id,
            code: module.code,
            name: module.name,
            description: module.description,
            credits: module.credits,
            is_active: module.is_active,
            created_at: module.created_at
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: "Validation error",
                details: error.errors.map(e => e.message) 
            });
        }
        return res.status(500).json({ 
            error: "Failed to create module",
            message: error.message 
        });
    }
};

export const getAllModules = async (req, res) => {
    try {
        const { active, page = 1, limit = 10 } = req.query;
        let where = {};
        
        // Filter by active status if provided
        if (active === 'true') {
            where.is_active = true;
        } else if (active === 'false') {
            where.is_active = false;
        }

        // Pagination
        const offset = (page - 1) * limit;
        
        const { count, rows } = await db.Module.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            attributes: ['id', 'code', 'name', 'description', 'credits', 'is_active', 'created_at'],
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            data: rows
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: "Failed to fetch modules",
            message: error.message 
        });
    }
};

export const getModuleById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const module = await db.Module.findByPk(id, {
            attributes: ['id', 'code', 'name', 'description', 'credits', 'is_active', 'created_at', 'updated_at'],
            include: [{
                model: db.User,
                as: 'creator',
                attributes: ['id', 'first_name', 'last_name', 'email']
            }]
        });
        
        if (!module) {
            return res.status(404).json({ error: "Module not found" });
        }
        
        return res.status(200).json(module);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: "Failed to fetch module",
            message: error.message 
        });
    }
};

export const updateModule = async (req, res) => {
    try {
        // Only managers can update modules
        if (req.user.role !== 'manager') {
            return res.status(403).json({ error: "Only managers can update modules" });
        }

        const { id } = req.params;
        const { code, name, description, credits, is_active } = req.body;
        
        const module = await db.Module.findByPk(id);
        if (!module) {
            return res.status(404).json({ error: "Module not found" });
        }
        
        // Check if new code already exists (excluding current module)
        if (code && code !== module.code) {
            const existingModule = await db.Module.findOne({ where: { code } });
            if (existingModule) {
                return res.status(400).json({ error: "Module code already exists" });
            }
        }

        const updatedModule = await module.update({
            code: code || module.code,
            name: name || module.name,
            description: description !== undefined ? description : module.description,
            credits: credits !== undefined ? credits : module.credits,
            is_active: is_active !== undefined ? is_active : module.is_active
        });
        
        return res.status(200).json({
            id: updatedModule.id,
            code: updatedModule.code,
            name: updatedModule.name,
            description: updatedModule.description,
            credits: updatedModule.credits,
            is_active: updatedModule.is_active,
            updated_at: updatedModule.updated_at
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: "Validation error",
                details: error.errors.map(e => e.message) 
            });
        }
        return res.status(500).json({ 
            error: "Failed to update module",
            message: error.message 
        });
    }
};

export const deleteModule = async (req, res) => {
    try {
        // Only managers can delete modules
        if (req.user.role !== 'manager') {
            return res.status(403).json({ error: "Only managers can delete modules" });
        }

        const { id } = req.params;
        
        const module = await db.Module.findByPk(id);
        if (!module) {
            return res.status(404).json({ error: "Module not found" });
        }
        
        // Check if module has any associated classes before deleting
        const hasClasses = await db.Class.findOne({ where: { module_id: id } });
        if (hasClasses) {
            return res.status(400).json({ 
                error: "Cannot delete module with associated classes",
                solution: "Deactivate the module instead by setting is_active to false"
            });
        }

        await module.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: "Failed to delete module",
            message: error.message 
        });
    }
};